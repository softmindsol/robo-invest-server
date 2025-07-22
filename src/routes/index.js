import express from 'express';

import authRoutes from './auth.routes.js';
import userProfileRoutes from './user/profile.routes.js';

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
  }
];

defaultRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
