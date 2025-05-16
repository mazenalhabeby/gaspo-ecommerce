import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  DiscountApplyTo,
  DiscountType,
  Order,
  Prisma,
  ProductDiscount,
  ShippingMethod,
} from '@Prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService, OrderItemsType } from 'src/common';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new order based on the provided data transfer object (DTO).
   *
   * @param dto - The data transfer object containing order details.
   *
   * @throws {BadRequestException} If no items are provided in the order or if the quantity of an item exceeds the available stock.
   * @throws {NotFoundException} If a product or shipping address specified in the order is not found.
   *
   * @returns A promise that resolves to the created order, including its items.
   *
   * The method performs the following steps:
   * 1. Validates that at least one item is included in the order.
   * 2. Fetches product details for each item and ensures sufficient stock is available.
   * 3. Calculates discounts and total prices for each item.
   * 4. Validates the shipping address if provided.
   * 5. Creates the order and its associated items in a database transaction.
   * 6. Updates the stock of each product based on the ordered quantities.
   */
  async createOrder(dto: CreateOrderDto): Promise<Order> {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('At least one item is required');
    }

    const orderItems: OrderItemsType[] = [];
    let totalAmount = 0;

    for (const item of dto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product not found: ${item.productId}`);
      }

      if (item.quantity > product.stock) {
        throw new BadRequestException(`Not enough stock for ${product.name}`);
      }

      const discount = await this.getProductDiscount(
        product.id,
        item.quantity,
        product.price,
      );

      const totalPrice = product.price * item.quantity - discount;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        basePrice: product.price,
        discount,
        totalPrice,
      });

      totalAmount += totalPrice;
    }

    if (dto.addressId) {
      const address = await this.prisma.address.findUnique({
        where: { id: dto.addressId },
      });
      if (!address) {
        throw new NotFoundException('Shipping address not found');
      }
    }

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: dto.userId ?? null,
          guestName: dto.guestName ?? null,
          guestEmail: dto.guestEmail ?? null,
          guestPhone: dto.guestPhone ?? null,
          totalAmount,
          shippingAddressId: dto.addressId ?? null,
          shippingMethod: (dto.shippingMethod as ShippingMethod) ?? 'STANDARD',
          paymentMethod: dto.paymentMethod ?? 'MANUAL',
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
        },
      });

      for (const item of dto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return created;
    });

    return order;
  }

  /**
   * Updates an existing order with the provided data.
   *
   * @param orderId - The unique identifier of the order to update.
   * @param dto - An object containing the updated order details.
   *   - `status` (optional): The new status of the order.
   *   - `paymentMethod` (optional): The updated payment method for the order.
   *   - `shippingMethod` (optional): The updated shipping method for the order.
   * @returns A promise that resolves to the updated order, including its items.
   * @throws {NotFoundException} If the order with the specified ID is not found.
   */
  async updateOrder(orderId: string, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: dto.status ?? order.status,
        paymentMethod: dto.paymentMethod ?? order.paymentMethod,
        shippingMethod: dto.shippingMethod ?? order.shippingMethod,
      },
      include: { items: true },
    });
  }

  /**
   * Confirms the payment for an order by updating its status to 'PAID'.
   *
   * @param orderId - The unique identifier of the order to confirm payment for.
   * @param dto - An object containing optional updates for the order's payment and shipping methods.
   *
   * @returns A promise that resolves to the updated order, including its items and shipments.
   *
   * @throws {NotFoundException} If the order with the given ID is not found.
   * @throws {BadRequestException} If the order has already been marked as 'PAID'.
   */
  async confirmPayment(orderId: string, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status === 'PAID') throw new BadRequestException('Already paid');

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        paymentMethod: dto.paymentMethod ?? order.paymentMethod,
        shippingMethod: dto.shippingMethod ?? order.shippingMethod,
      },
      include: { items: true, Shipments: true },
    });
  }

  /**
   * Calculates the discount for a product based on its quantity, price, and applicable discount rules.
   *
   * @param productId - The unique identifier of the product for which the discount is being calculated.
   * @param quantity - The quantity of the product being purchased.
   * @param price - The price of a single unit of the product.
   * @returns A promise that resolves to the calculated discount amount.
   *
   * @throws {BadRequestException} If there is a known Prisma client error while fetching discount rules.
   * @throws {InternalServerErrorException} If there is an unexpected error while fetching discount rules.
   *
   * The discount is determined by evaluating the product's discount rules in descending order of `minQuantity`.
   * Each rule specifies the conditions under which it applies and how the discount is calculated:
   * - `DiscountApplyTo.EACH`: Applies the discount to each unit of the product.
   * - `DiscountApplyTo.SECOND_ONLY`: Applies the discount only to the second unit if the quantity is 2 or more.
   * - `DiscountApplyTo.NTH_ONLY`: Applies the discount to every nth unit based on the `minQuantity` value.
   * - `DiscountApplyTo.SUBTOTAL`: Applies the discount to the subtotal of the product's price and quantity.
   *
   * If no discount rules match the given quantity, the method returns 0.
   */
  private async getProductDiscount(
    productId: string,
    quantity: number,
    price: number,
  ): Promise<number> {
    let rules: ProductDiscount[] = [];

    try {
      rules = await this.prisma.productDiscount.findMany({
        where: { productId },
        orderBy: { minQuantity: 'desc' },
      });
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(err.message);
      }
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }
      throw new InternalServerErrorException(
        'Unexpected error loading discounts',
      );
    }

    for (const rule of rules) {
      const { minQuantity, maxQuantity, type, value, applyTo } = rule;

      const matchesQuantity =
        quantity >= minQuantity && (!maxQuantity || quantity <= maxQuantity);

      if (!matchesQuantity) continue;

      const isPercent = type === DiscountType.PERCENT;
      const multiplier = value / 100;

      switch (applyTo) {
        case DiscountApplyTo.EACH:
          return isPercent ? price * quantity * multiplier : value * quantity;

        case DiscountApplyTo.SECOND_ONLY:
          return quantity >= 2 ? (isPercent ? price * multiplier : value) : 0;

        case DiscountApplyTo.NTH_ONLY: {
          const nthCount = Math.floor(quantity / minQuantity);
          return isPercent ? price * multiplier * nthCount : value * nthCount;
        }

        case DiscountApplyTo.SUBTOTAL:
          return isPercent ? price * quantity * multiplier : value;
      }
    }

    return 0;
  }
}
