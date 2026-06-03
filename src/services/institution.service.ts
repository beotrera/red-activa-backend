import { InstitutionModel } from '../models/institution.model';
import { CustomError } from '../lib';
import { ApiError } from '../enums';
import { CreateInstitutionDto, NearbyQuery } from '../types';

const create = async (dto: CreateInstitutionDto) => {
  return InstitutionModel.create({
    name: dto.name,
    type: dto.type,
    address: dto.address,
    phone: dto.phone,
    location: {
      type: 'Point',
      coordinates: [dto.longitude, dto.latitude],
    },
  });
};

const findAll = async () => {
  return InstitutionModel.find().sort({ name: 1 });
};

const findById = async (id: string) => {
  const institution = await InstitutionModel.findById(id);
  if (!institution) throw new CustomError(ApiError.Institution.notFound);
  return institution;
};

const findNearby = async ({ longitude, latitude, maxDistance = 10000 }: NearbyQuery) => {
  const institution = await InstitutionModel.findOne({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [longitude, latitude] },
        $maxDistance: maxDistance,
      },
    },
  });
  if (!institution) throw new CustomError(ApiError.Institution.notFound);
  return institution;
};

const update = async (id: string, dto: Partial<CreateInstitutionDto>) => {
  const payload: any = { ...dto };

  if (dto.longitude !== undefined || dto.latitude !== undefined) {
    const current = await findById(id);
    payload.location = {
      type: 'Point',
      coordinates: [
        dto.longitude ?? current.location.coordinates[0],
        dto.latitude ?? current.location.coordinates[1],
      ],
    };
    delete payload.longitude;
    delete payload.latitude;
  }

  const updated = await InstitutionModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!updated) throw new CustomError(ApiError.Institution.notFound);
  return updated;
};

const remove = async (id: string) => {
  const deleted = await InstitutionModel.findByIdAndDelete(id);
  if (!deleted) throw new CustomError(ApiError.Institution.notFound);
};

export const institutionService = { create, findAll, findById, findNearby, update, remove };
