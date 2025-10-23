import express from 'express';

import authRoutes from './auth.routes.js';
import userProfileRoutes from './user/profile.routes.js';
import paymentRoutes from './payment/payment.routes.js';
import jazzcashRoutes from './payment/jazzcash.route.js';

const router = express.Router();

const defaultRoutes = [
  // auth routes
  {
    path: '/auth',
    route: authRoutes
  },
  {
    path: '/user/profile',
    route: userProfileRoutes
  },
  {
    path: '/payment',
    route: paymentRoutes
  },
  {
    path: '/jazzcash',
    route: jazzcashRoutes
  }
];

defaultRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
