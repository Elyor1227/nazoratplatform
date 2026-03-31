import mongoose from 'mongoose';

export const ROLES = {
  CONSTRUCTION_COMPANY: 'construction_company',
  GASN: 'gasn',
  TAX_INSPECTION: 'tax_inspection',
  LABOR_INSPECTION: 'labor_inspection',
};

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: Object.values(ROLES),
    },
    organizationName: { type: String, trim: true },
    fullName: { type: String, trim: true },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
