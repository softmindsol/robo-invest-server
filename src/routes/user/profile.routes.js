import { Router } from 'express';

import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { ROLES } from '../../constants/index.js';
import { getUserProfile } from '../../controllers/user/profile.controller.js';
const router = new Router();

router.get('/', verifyJWT([ROLES.USER]), getUserProfile);

export default router;
