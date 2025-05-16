// types/types.ts

// ================= Enums =================

export enum UserRole {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  MANAGER = "MANAGER",
  GUEST = "GUEST",
}

export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum DiscountType {
  PERCENT = "PERCENT",
  FIXED = "FIXED",
}

export enum FulfillmentStatus {
  UNFULFILLED = "UNFULFILLED",
  PARTIALLY_FULFILLED = "PARTIALLY_FULFILLED",
  FULFILLED = "FULFILLED",
  RETURNED = "RETURNED",
  CANCELLED = "CANCELLED",
}

export enum ShipmentStatus {
  PENDING = "PENDING",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
  RETURNED = "RETURNED",
}

export enum ShippingMethod {
  STANDARD = "STANDARD",
  EXPRESS = "EXPRESS",
  FREESHIP = "FREESHIP",
  PICKUP = "PICKUP",
}

export enum StockMovementType {
  IN = "IN",
  OUT = "OUT",
}

export enum ReturnStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  RECEIVED = "RECEIVED",
  REFUNDED = "REFUNDED",
}

export enum DiscountApplyTo {
  EACH = "EACH",
  SECOND_ONLY = "SECOND_ONLY",
  NTH_ONLY = "NTH_ONLY",
  SUBTOTAL = "SUBTOTAL",
}

// ================= Interfaces =================

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string
  price: number
  stock: number
  sku?: string
  metadata?: unknown
  categoryId?: string
  images?: ProductImage[]
  variants?: ProductVariant[]
  translations?: ProductTranslation[]
  productDiscounts?: ProductDiscount[]
}

export interface ProductImage {
  id: string
  url: string
  altText?: string
  position: number
  productId: string
  variantId?: string
}

export interface ProductVariant {
  id: string
  slug: string
  sku?: string
  price: number
  stock: number
  productId: string
  metadata?: unknown
  attributes?: VariantAttribute[]
}

export interface VariantAttribute {
  id: string
  name: string
  value: string
  variantId: string
}

export interface ProductDiscount {
  id: string
  productId: string
  minQuantity: number
  maxQuantity?: number
  type: DiscountType
  value: number
  applyTo: DiscountApplyTo
  createdAt: string
}

export interface ProductTranslation {
  id: string
  productId: string
  language: string
  name: string
  description: string
  descriptionJson?: unknown
  createdAt: string
}

export interface Order {
  id: string
  userId?: string
  guestName?: string
  guestEmail?: string
  guestPhone?: string
  status: OrderStatus
  totalAmount: number
  shippingMethod?: ShippingMethod
  paymentMethod?: string
  trackingNumber?: string
  paidAt?: string
  invoiceNumber?: string
  currency?: string
  shippingAddressId?: string
  discountCodeId?: string
  fulfillmentStatus: FulfillmentStatus
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  basePrice: number
  discount?: number
  tax?: number
  totalPrice: number
}

export interface Address {
  id: string
  country: string
  state?: string
  city: string
  zip: string
  street1: string
  street2?: string
  company?: string
}

export interface Category {
  id: string
  name: string
}

export interface User {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  avatarUrl?: string
  role: UserRole
  isVerified: boolean
  isActive: boolean
  preferredLanguage?: string
  currency?: string
  metadata?: unknown
  createdAt: string
  updatedAt: string
}

export interface Shipment {
  id: string
  orderId: string
  carrier: string
  trackingNumber: string
  labelUrl?: string
  status: ShipmentStatus
  shippedAt?: string
  deliveredAt?: string
  metadata?: unknown
  lastSyncedAt?: string
  failureReason?: string
  createdAt: string
  updatedAt: string
}

export interface ReturnRequest {
  id: string
  orderId: string
  orderItemId: string
  reason: string
  status: ReturnStatus
  quantity: number
  refundAmount?: number
  resolution?: string
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  userId?: string
  title: string
  message: string
  type: string
  read: boolean
  sentAt: string
}
