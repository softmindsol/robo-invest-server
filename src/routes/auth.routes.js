import { Router } from 'express';
import { addValidation } from '../utils/index.js';
import { loginSchema, registerSchema } from '../schemas/auth.validator.js';
import { login, logout, register } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/index.js';
import { ROLES } from '../constants/index.js';

const router = new Router();

router.post('/register', addValidation(registerSchema), register);
router.post('/login', addValidation(loginSchema), login);
router.post(
  '/logout',
  verifyJWT([
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.CARE_MANAGER,
    ROLES.FINANCE,
    ROLES.FRONTLINE_STAFF,
    ROLES.SERVICE_USER,
    ROLES.RECRUITMENT
  ]),
  logout
);

export default router;
