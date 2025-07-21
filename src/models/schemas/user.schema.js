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
    phoneNumber: { type: String },
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
