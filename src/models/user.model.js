import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY
} from '../configs/env.config.js';

const { Schema, model } = mongoose;

// ======================= 🔥 Base User Schema =======================
const baseOptions = {
  discriminatorKey: 'role',
  collection: 'users',
  timestamps: true
};

const BaseUserSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }
  },
  baseOptions
);

BaseUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

BaseUserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

BaseUserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY
    }
  );
};

const User = model('User', BaseUserSchema);

// ======================= 🔥 Service User Schema =======================
const ServiceUserSchema = new Schema({
  address: { type: String },
  phoneNumber: { type: String },
  dateOfBirth: { type: Date },
  careLevel: { type: String },
  status: { type: String },
  primaryCarer: { type: String },
  emergencyContact: { type: String },
  medicalConditions: [String],
  additionalNotes: { type: String }
});

const ServiceUser = User.discriminator('Service User', ServiceUserSchema);

// ======================= 🔥 Super Admin Schema =======================
const SuperAdminSchema = new Schema({});
const SuperAdmin = User.discriminator('Super Admin', SuperAdminSchema);

// ======================= 🔥 Admin Schema =======================
const AdminSchema = new Schema({
  department: { type: String }
});
const Admin = User.discriminator('Admin', AdminSchema);

// ======================= 🔥 Care Manager Schema =======================
const CareManagerSchema = new Schema({
  assignedRegions: [String]
});
const CareManager = User.discriminator('Care Manager', CareManagerSchema);

// ======================= 🔥 Frontline Staff Schema =======================
const FrontlineStaffSchema = new Schema({
  shift: { type: String },
  assignedUsers: [String]
});
const FrontlineStaff = User.discriminator(
  'Frontline Staff',
  FrontlineStaffSchema
);

// ======================= 🔥 Finance Schema =======================
const FinanceSchema = new Schema({
  financeDepartmentCode: { type: String }
});
const Finance = User.discriminator('Finance', FinanceSchema);

// ======================= 🔥 Recruitment Schema =======================
const RecruitmentSchema = new Schema({
  recruiterLevel: { type: String }
});
const Recruitment = User.discriminator('Recruitment', RecruitmentSchema);

export {
  User,
  ServiceUser,
  SuperAdmin,
  Admin,
  CareManager,
  FrontlineStaff,
  Finance,
  Recruitment
};

export default User;
