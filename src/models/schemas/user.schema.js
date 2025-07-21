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

export const personalDetailsSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    CNICNumber: { type: String, unique: true },
    issueDate: { type: Date },
    expireDate: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    maritalStatus: {
      type: String,
      enum: ['Single', 'Married', 'Divorced', 'Widowed']
    },
    dateOfBirth: { type: Date },
    permanentAddress: { type: String },
    fathersOrHusbandsName: {
      selection: { type: String, enum: ['Father', 'Husband'] },
      name: { type: String }
    },
    mothersName: { type: String },
    placeOfBirth: { type: String },
    nationality: { type: String },
    uploadFrontSideOfCNIC: { type: String },
    uploadBackSideOfCNIC: { type: String },
    dualNationality: { type: Boolean },
    isPakistaniResident: {
      type: Boolean,
      default: false,
      required: function () {
        return this.accountType === 'Sahulat';
      }
    }
  },
  { _id: false }
);

export const financialDetailsSchema = new Schema(
  {
    occupation: { type: String },
    occupationIndustry: { type: String },
    incomeSource: { type: String },
    employerAddress: { type: String },
    employerCountry: { type: String },
    yearsEmployed: { type: Number },
    salaryAmount: { type: Number },
    grossAnnualIncome: { type: Number }, // Only for Normal
    numberOfDependents: { type: Number }, // Only for Normal
    proofOfIncome: { type: String }, // Only for Normal
    proofOfEmployment: { type: String }, // Only for Normal
    companyLetterhead: { type: String }, // Only for Normal
    taxFilingStatus: { type: Boolean, default: false },
    NTN: { type: String },
    deductZakat: { type: Boolean, default: false },
    existingInvestmentAccount: { type: Boolean, default: false }
  },
  { _id: false }
);

export const fatcaComplianceSchema = new Schema(
  {
    hasUSCitizenshipOrGreenCard: { type: Boolean },
    bornInUSA: { type: Boolean },
    hasUSAddress: { type: Boolean },
    USAddress: { type: String },
    hasUSTelephone: { type: Boolean },
    USTelephone: { type: String },
    POAWithUSTransferAgent: { type: Boolean }
  },
  { _id: false }
);

export const standardDueDiligenceSchema = new Schema(
  {
    isPEP: { type: Boolean },
    pepDetails: { type: String },
    hasRefusedAccount: { type: Boolean },
    refusalDetails: { type: String },
    hasOffshoreLinks: { type: Boolean },
    offshoreLinksDetails: { type: String },
    ownsHighValueItems: { type: Boolean },
    highValueDetails: { type: String }
  },
  { _id: false }
);

export const passportDetailsSchema = new Schema(
  {
    passportNumber: { type: String },
    placeOfIssue: { type: String },
    dateOfIssue: { type: Date },
    dateOfExpiry: { type: Date },
    uploadMainPassportPage: { type: String }
  },
  { _id: false }
);

export const beneficiaryDetailsSchema = new Schema(
  {
    name: { type: String },
    CNICNumber: { type: String },
    address: { type: String },
    contactNumber: { type: String },
    relationship: { type: String },
    uploadFrontSideOfCNIC: { type: String },
    uploadBackSideOfCNIC: { type: String },
    fatcaCompliance: fatcaComplianceSchema,
    standardDueDiligence: standardDueDiligenceSchema,
    isForeigner: { type: Boolean },
    passportDetails: passportDetailsSchema
  },
  { _id: false }
);

export const investmentGoalsSchema = new Schema(
  {
    objective: {
      type: String,
      enum: [
        'Retirement',
        'Higher Education',
        'Buy property',
        'Long term wealth'
      ],
      default: 'Retirement'
    },
    timeHorizon: {
      type: String,
      enum: [
        '1 to 2 years',
        '3 to 5 years',
        '6 to 10 years',
        '11 to 20 years',
        'Over 20 years'
      ],
      default: '1 to 2 years'
    },
    monthlyIncome: {
      type: String,
      enum: [
        '25,000 to 50,000',
        '50,000 to 100,000',
        '100,000 to 200,000',
        '200,000 to 500,000',
        '500,000 to 1 million',
        'Rs. 1 million +'
      ],
      default: '25,000 to 50,000'
    },
    educationLevel: {
      type: String,
      enum: [
        'Matric',
        'Intermediate',
        'A Levels',
        'Bachelors',
        'Masters or Higher'
      ],
      default: 'Matric'
    },
    investmentExperience: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advance'],
      default: 'Beginner'
    },
    totalNetWorth: {
      type: String,
      enum: [
        'Under Rs. 1 million',
        'Between Rs. 1 and 3 million',
        'Between Rs. 5 and 10 million',
        'More than Rs. 10 million'
      ],
      default: 'Under Rs. 1 million'
    },
    dependentsOnIncome: {
      type: String,
      enum: ['0', '1', '2 or more', '4 or more'],
      default: '0'
    },
    marketVolatilityReaction: {
      type: String,
      enum: ['Buy more', 'Sell everything', 'Hold investments, do nothing'],
      default: 'Buy more'
    }
  },
  { _id: false }
);
