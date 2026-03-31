import mongoose from 'mongoose';

/** GASN tomonidan kiritilgan smeta/loyiha bazaviy ko'rsatkichlar */
const projectDocumentSchema = new mongoose.Schema(
  {
    companyUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true, trim: true },
    smetaEmployeeCount: { type: Number, min: 0, default: 0 },
    smetaContractSum: { type: Number, min: 0, default: 0 },
    smetaPayrollEstimate: { type: Number, min: 0, default: 0 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

projectDocumentSchema.index({ companyUserId: 1 });

export const ProjectDocument = mongoose.model('ProjectDocument', projectDocumentSchema);
