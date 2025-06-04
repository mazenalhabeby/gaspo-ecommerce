import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ReviewsModule } from './reviews/reviews.module';
import { DiscountsModule } from './discounts/discounts.module';
import { StockModule } from './stock/stock.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60, limit: 5 }],
    }),
    ProductsModule,
    CategoriesModule,
    CartModule,
    WishlistModule,
    ReviewsModule,
    DiscountsModule,
    StockModule,
    NotificationsModule,
    ActivityLogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
// implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(BlacklistMiddleware)
//       .exclude(
//         { path: 'auth/login', method: RequestMethod.POST },
//         {
//           path: 'auth/register',
//           method: RequestMethod.POST,
//         },
//       )
//       .forRoutes('*');
//   }
// }
