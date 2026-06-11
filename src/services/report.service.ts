import { ReportModel } from '../models/report.model';
import { CustomError } from '../lib';
import { ApiError } from '../enums';

const findAll = async () => {
  return ReportModel.find().sort({ createdAt: -1 });
};

const findById = async (id: string) => {
  const report = await ReportModel.findById(id);
  if (!report) throw new CustomError(ApiError.Report.notFound);
  return report;
};

export const reportService = { findAll, findById };
