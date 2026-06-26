import { PersonModel } from '../models/person.model';
import { ReportModel } from '../models/report.model';
import { NeighborhoodModel } from '../models/neighborhood.model';

const byNeighborhood = async () => {
  const [nnByZone, reportsByZone, neighborhoods] = await Promise.all([
    PersonModel.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$neighborhood', nn: { $sum: 1 } } },
    ]),
    ReportModel.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$neighborhood', reports: { $sum: 1 } } },
    ]),
    NeighborhoodModel.find({}, { name: 1, comuna: 1, centroid: 1, boundary: 1 }).lean(),
  ]);

  const nnMap = new Map(nnByZone.map((e) => [e._id as string, e.nn as number]));
  const reportsMap = new Map(reportsByZone.map((e) => [e._id as string, e.reports as number]));

  const result = neighborhoods.map((n) => ({
    neighborhood: n.name,
    nn: nnMap.get(n.name) ?? 0,
    reports: reportsMap.get(n.name) ?? 0,
    coordinates: n.centroid.coordinates as [number, number],
    polygon: n.boundary.coordinates[0] as [number, number][],
    comuna: n.comuna,
  }));

  return result.sort((a, b) => b.nn + b.reports - (a.nn + a.reports));
};

export const analyticsService = { byNeighborhood };
