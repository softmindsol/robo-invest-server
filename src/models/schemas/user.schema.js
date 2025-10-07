import mongoose from 'mongoose';

const { Schema } = mongoose;

export const emailVerificationSchema = new Schema(
  {
    otp: {
      type: String
    },
    expiry: {
      type: Date
    },
    updatedAt: {
      type: Date
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }
);

export const resetPasswordSchema = new Schema(
  {
    otp: String,
    expiry: Date,
    verified: { type: Boolean, default: false },
    updatedAt: { type: Date }
  },
  { _id: false }
);

export const personalDetailsSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    cnic: {
      type: String,
      required: true,
      index: {
        unique: true,
        sparse: true
      }
    },
    issueDate: { type: Date, required: true },
    expireDate: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    maritalStatus: {
      type: String,
      enum: ['Single', 'Married', 'Divorced', 'Widowed'],
      required: true
    },
    dob: { type: Date, required: true },
    permanentAddress: { type: String, required: true },
    nameType: { type: String, enum: ['Father', 'Husband'], default: 'Father' },
    fatherOrHusband: { type: String, required: true },
    motherName: { type: String, required: true },
    birthPlace: { type: String, required: true },
    nationality: { type: String },
    cnicFront: { type: String }, // Storing URL or path to uploaded file
    cnicBack: { type: String }, // Storing URL or path to uploaded file
    dualNationality: { type: Boolean, default: false },
    pakistaniCitizen: { type: Boolean } // Conditional for Sahulat
  },
  { _id: false }
);

export const financialDetailsSchema = new Schema(
  {
    occupation: { type: String, required: true },
    occupationIndustry: { type: String, required: true },
    incomeSource: { type: String, required: true },
    employerAddress: { type: String, required: true },
    employerCountry: { type: String },
    yearsEmployed: { type: Number },
    salaryAmount: { type: Number },
    taxFilingStatus: { type: Boolean, default: false },
    ntn: { type: String },
    deductZakat: { type: Boolean, default: false },
    investmentAccount: { type: Boolean, default: false },

    // Conditional for Normal account type
    grossAnnualIncome: { type: Number },
    numberOfDependents: { type: Number },
    proofOfIncome: { type: String }, // URL/path
    proofOfEmployment: { type: String }, // URL/path
    companyLetterhead: { type: String } // URL/path
  },
  { _id: false }
);

export const beneficiaryDetailsSchema = new Schema(
  {
    name: { type: String, required: true },
    cnic: { type: String, required: true },
    relationship: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    cnicFront: { type: String },
    cnicBack: { type: String },

    // Conditional for Normal account type (FATCA / SDD)
    isUsCitizen: { type: Boolean },
    isUsResident: { type: Boolean },
    hasUsAddress: { type: Boolean },
    usAddressEmail: { type: String },
    hasUsTelephone: { type: Boolean },
    usTelephoneNumber: { type: String },
    usAuthorizedSignatory: { type: String },
    isPublicFigure: { type: Boolean },
    publicFigureDetails: { type: String },
    isAccountRefusal: { type: Boolean },
    accountRefusalDetails: { type: String },
    hasOffshoreLinks: { type: Boolean },
    offshoreLinksDetails: { type: String },
    hasHighValueDeals: { type: Boolean },
    highValueDealsDetails: { type: String },

    isForeigner: { type: String, enum: ['yes', 'no'], default: 'no' },
    passportNumber: { type: String },
    placeOfIssue: { type: String },
    dateOfIssue: { type: Date },
    dateOfExpiry: { type: Date },
    passportUpload: { type: String }
  },
  { _id: false }
);

export const investmentGoalsSchema = new Schema(
  {
    investmentObjective: { type: String, required: true },
    investmentHorizon: { type: String, required: true },
    monthlyIncome: { type: String, required: true },
    educationLevel: { type: String, required: true },
    investmentExperience: { type: String, required: true },
    totalNetWorth: { type: String, required: true },
    dependents: { type: String, required: true },
    riskTolerance: { type: String, required: true },
    riskLevel: { type: String, required: true }
  },
  { _id: false }
);

export const passwordHistorySchema = new Schema(
  {
    password: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);
