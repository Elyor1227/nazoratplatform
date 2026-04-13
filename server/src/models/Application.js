import mongoose from 'mongoose';

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

const registrationSummarySchema = new mongoose.Schema(
  {
    materials: { type: Number, default: null },
    equipment: { type: Number, default: null },
    machinery: { type: Number, default: null },
    wages: { type: Number, default: null },
    otherExpenses: { type: Number, default: null },
    vat: { type: Number, default: null },
  },
  { _id: false }
);

const workVolumeRowSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    labelUz: { type: String, default: '' },
    unit: { type: String, default: '' },
    volume: { type: Number, default: null },
    pricePerUnit: { type: Number, default: null },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    companyUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    objectName: { type: String, required: true, trim: true },
    notes: { type: String, default: '' },
    /** Xulosa jadval + ishlar hajmi (yangi arizalar uchun majburiy) */
    registrationSummary: { type: registrationSummarySchema, default: undefined },
    registrationEmployeeCount: { type: Number, default: null },
    workVolumes: { type: [workVolumeRowSchema], default: undefined },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.PENDING,
    },
    gasnInspectorFio: { type: String, default: '' },
    reviewedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    attachments: [
      {
        fileName: { type: String, required: true },
        storedName: { type: String, required: true },
        step: { type: Number, min: 2, max: 5 },
      },
    ],
  },
  { timestamps: true }
);

applicationSchema.index({ companyUserId: 1, createdAt: -1 });
applicationSchema.index({ status: 1, createdAt: -1 });

export const Application = mongoose.model('Application', applicationSchema);
