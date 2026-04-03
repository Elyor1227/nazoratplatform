import mongoose from 'mongoose';

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

const applicationSchema = new mongoose.Schema(
  {
    companyUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    objectName: { type: String, required: true, trim: true },
    notes: { type: String, default: '' },
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
