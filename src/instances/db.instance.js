import Users from '../models/user.model.js';
import { DBQuery } from '../services/db.service.js';

const userDB = new DBQuery(Users);

export { userDB };
