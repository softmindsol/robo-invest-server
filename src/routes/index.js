import express from 'express';

import authRoutes from './auth.routes.js';

const router = express.Router();

const defaultRoutes = [
  // auth routes
  {
    path: '/auth',
    route: authRoutes
  }
];

defaultRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
