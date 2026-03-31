import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    storedName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const reportSchema = new mongoose.Schema(
  {
    companyUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    periodYear: { type: Number, required: true },
    periodMonth: { type: Number, min: 1, max: 12, required: true },
    employeeCount: { type: Number, required: true, min: 0 },
    payrollFund: { type: Number, required: true, min: 0 },
    contractAmount: { type: Number, required: true, min: 0 },
    constructionType: { type: String, required: true, trim: true },
    invoices: [invoiceSchema],
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

reportSchema.index({ companyUserId: 1, periodYear: 1, periodMonth: 1 }, { unique: true });

export const Report = mongoose.model('Report', reportSchema);
