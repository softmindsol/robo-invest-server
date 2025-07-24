import Users from '../models/user.model.js';
import RefreshToken from '../models/refresh-token.model.js';
import { DBQuery } from '../services/db.service.js';

const userDB = new DBQuery(Users);
const refreshTokenDB = new DBQuery(RefreshToken);

export { userDB, refreshTokenDB };
