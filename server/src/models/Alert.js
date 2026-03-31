import mongoose from 'mongoose';

export const ALERT_TYPES = {
  ZERO_EMPLOYEES: 'zero_employees_suspicious',
  PAYROLL_VS_CONTRACT: 'payroll_vs_contract',
  GASN_DEVIATION: 'gasn_smeta_deviation',
  TAX_PAYROLL_LOW: 'tax_payroll_anomaly',
};

const alertSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, enum: Object.values(ALERT_TYPES) },
    severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'warning' },
    companyUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', default: null },
    message: { type: String, required: true },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    acknowledged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

alertSchema.index({ createdAt: -1 });
alertSchema.index({ companyUserId: 1, type: 1 });

export const Alert = mongoose.model('Alert', alertSchema);
