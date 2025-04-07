# 🛒 Gaspo E-Commerce

**Gaspo E-Commerce** is a modern, scalable e-commerce platform built to support both **B2B and B2C** operations. This monorepo includes a full-featured backend using **NestJS**, **PostgreSQL**, and **Prisma**, and a frontend built with **Next.js** and **Tailwind CSS**.

---

## 📁 Project Structure

- gaspo-ecommerce/
- ├── backend/ # NestJS backend with Prisma ORM and PostgreSQL
- ├── frontend/ # Next.js frontend with Tailwind CSS
- ├── .gitignore # Git ignore configuration for both projects
- └── README.md # This documentation file

---

## 🚀 Tech Stack

### Backend (`/backend`)

- **Framework**: [NestJS](https://nestjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL
- **Auth**: JWT with role-based access (Admin, Customer, Manager, Guest)
- **Core Features**:
  - Products with Variants, Bundles, Translations
  - Multi-shipment Orders & Return Management
  - Stock Movement, Price History
  - Discount Codes & Invoicing
  - Notifications & Activity Logs

### Frontend (`/frontend`)

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: Tailwind CSS
- **SSR & Routing**: Fully supported
- **Multilingual Support**: Product translation ready
- **Core Features**: Product pages, cart, checkout, wishlist

---

## 🛠 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/gaspo-ecommerce.git
cd gaspo-ecommerce
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

### 3. Setup Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## ✨ Key Features

- ✅ User Management (Auth, Roles, Preferences)

- ✅ Product Catalog with Variants, Bundles, and Multilingual Support

- ✅ Cart, Wishlist, and Reviews

- ✅ Orders with Multiple Shipments

- ✅ Return Requests per OrderItem

- ✅ Stock and Pricing History

- ✅ Admin Logs and Notifications

- ✅ Discount and Promo Code Engine

- ✅ Invoice Numbering and Tracking

## 📄 License

This project is licensed under the MIT License.
