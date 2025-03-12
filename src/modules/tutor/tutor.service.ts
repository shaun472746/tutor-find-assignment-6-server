import mongoose from 'mongoose';
import QueryBuilder from '../../app/builder/QueryBuilder';
import { TutorProfile } from '../user-auth/user_auth.model';
import { TAcceptedRequest, TBookingRequest } from './tutor.interface';
import { AcceptRequestModel, BookingRequestModel } from './tutor.model';
import AppError from '../../app/utils/AppError';

const filterApplication = async (params: any) => {
  const { subject, grade, location, rating, rate, isBlocked } = params;

  // Create a query object for the QueryBuilder
  const query = {
    filter: encodeURIComponent(
      JSON.stringify({
        subject: `${subject}-${grade}`,
        rating: rating,
        rate: rate,
      })
    ),

    isBlocked: isBlocked,
  };

  // Initialize the QueryBuilder
  const queryBuilder = new QueryBuilder(TutorProfile.find(), query);

  if (Object.keys(params).length === 0) {
    return await TutorProfile.find().populate({
      path: 'id',
      select: '-createdAt -password -updatedAt -__v',
    });
  }
  return await queryBuilder
    .filter()
    .filterByCity(location)
    .joinAndFilterByIsBlocked()
    .execute();
};

const applySearch = async (params: any) => {
  const { search, isBlocked } = params;
  const query = {
    search: encodeURIComponent(
      JSON.stringify({
        search: search,
      })
    ),
    isBlocked: isBlocked,
  };
  // Initialize the QueryBuilder
  const queryBuilder = new QueryBuilder(
    TutorProfile.find().populate({
      path: 'id',
      select: 'name',
    }),
    query
  );
  return await queryBuilder.search(['subjects', 'userDetails.name']).execute();
};

const applySorting = async (params: any) => {
  const query = {
    sorting: encodeURIComponent(
      JSON.stringify({
        hourly_rate: params.hourly_rate,
        rating: params.rating,
        createdAt: params.createdAt,
      })
    ),
    sortBy: 'hourly_rate,rating,createdAt',
  };

  const queryBuilder = new QueryBuilder(TutorProfile.find(), query);

  return await queryBuilder
    .populate('id', 'users', '_id', 'userDetails')
    .sort() // Apply sorting
    .execute(); // Execute the aggregation pipeline
};

const getTutorProfileFromDB = async (params: any) => {
  if (params.sortBy) {
    const result = await applySorting(params);

    return result;
  }
  if (params.search) {
    return await applySearch(params);
  }

  return await filterApplication(params);
};

const createBookingRequestIntoDB = async (data: TBookingRequest) => {
  try {
    const bookedReq = await BookingRequestModel.find({
      userId: data.userId,
      subjects: data.subjects,
    });
    if (bookedReq.length > 0) {
      throw new AppError(403, 'Already booked for this subject!');
    }
    const result = await BookingRequestModel.create(data);
    return result;
  } catch (err: any) {
    throw new Error(err);
  }
};

const rejectBookingRequestIntoDB = async (id: string) => {
  try {
    await BookingRequestModel.findByIdAndUpdate(id, {
      $set: { available: false },
    });
  } catch (err: any) {
    throw new Error(err);
  }
};

const createAcceptBookingRequestIntoDB = async (data: TAcceptedRequest) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    const result = await AcceptRequestModel.create([{ ...data }], { session });
    await BookingRequestModel.findByIdAndUpdate(
      data?.id,
      {
        $set: { available: false },
      },
      { session }
    );

    await session.commitTransaction();
    await session.endSession();

    return result[0];
  } catch (err: any) {
    throw new Error(err);
  }
};

const getAllBookingsFromDB = async (id: string) => {
  try {
    const result = await BookingRequestModel.find({
      tutorId: id,
      available: true,
    }).populate({
      path: 'userId',
      select: '-password -createdAt -updatedAt -__v',
    });

    return result;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const TutorDetailServices = {
  getTutorProfileFromDB,
  createBookingRequestIntoDB,
  getAllBookingsFromDB,
  createAcceptBookingRequestIntoDB,
  rejectBookingRequestIntoDB,
};
