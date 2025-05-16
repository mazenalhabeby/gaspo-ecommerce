import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from '@Prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.ordersService.createOrder(dto);
  }

  @Put(':id')
  async updateOrder(
    @Param('id') orderId: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.updateOrder(orderId, dto);
  }

  @Put(':id/pay')
  async updatePayment(
    @Param('id') orderId: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.confirmPayment(orderId, dto);
  }
}
