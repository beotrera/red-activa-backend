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
    NeighborhoodModel.find({}, { name: 1, comuna: 1, centroid: 1 }).lean(),
  ]);

  const centroidMap = new Map(
    neighborhoods.map((n) => [n.name, { coordinates: n.centroid.coordinates, comuna: n.comuna }]),
  );

  const map = new Map<
    string,
    { neighborhood: string; nn: number; reports: number; coordinates: [number, number] | null; comuna: number | null }
  >();

  for (const entry of nnByZone) {
    const geo = centroidMap.get(entry._id) ?? null;
    map.set(entry._id, {
      neighborhood: entry._id,
      nn: entry.nn,
      reports: 0,
      coordinates: geo ? (geo.coordinates as [number, number]) : null,
      comuna: geo?.comuna ?? null,
    });
  }
  for (const entry of reportsByZone) {
    const existing = map.get(entry._id);
    if (existing) {
      existing.reports = entry.reports;
    } else {
      const geo = centroidMap.get(entry._id) ?? null;
      map.set(entry._id, {
        neighborhood: entry._id,
        nn: 0,
        reports: entry.reports,
        coordinates: geo ? (geo.coordinates as [number, number]) : null,
        comuna: geo?.comuna ?? null,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.nn + b.reports - (a.nn + a.reports));
};

export const analyticsService = { byNeighborhood };
