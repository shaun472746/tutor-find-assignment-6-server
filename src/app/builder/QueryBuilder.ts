import { FilterQuery, Query, PipelineStage } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;
  private pipeline: PipelineStage[];

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
    this.pipeline = []; // Initialize an empty aggregation pipeline
  }

  // Search method
  search(searchableFields: string[]) {
    if (this.query?.search) {
      const searchObj = JSON.parse(
        decodeURIComponent(this.query.search as string)
      );
      const { search } = searchObj;

      // Build the $or conditions for the $match stage
      const orConditions = searchableFields.map((field) => {
        return {
          [field]: {
            $regex: search
              .replace(/[^a-zA-Z0-9 ]/g, '')
              .toLowerCase()
              .replace(/ /g, '.*'),
            $options: 'i',
          },
        };
      });

      // Add the $match stage to the pipeline

      this.pipeline.push(
        {
          $lookup: {
            from: 'users',
            localField: 'id',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $unwind: '$userDetails',
        },
        {
          $match: {
            $or: orConditions,
          },
        },
        {
          $project: {
            'userDetails.createdAt': 0,
            'userDetails.password': 0,
            'userDetails.updatedAt': 0,
            'userDetails.__v': 0,
          },
        }
      );
    }

    return this;
  }

  // Filter method
  filter() {
    if (this.query?.filter) {
      const queryObj = JSON.parse(
        decodeURIComponent(this.query.filter as string)
      );

      // Build the filter object in a type-safe way
      const filter: Record<string, any> = {};
      if (queryObj.subject) {
        filter['subjects'] = queryObj.subject;
      }
      if (queryObj.rating) {
        const parsedRating = parseFloat(queryObj.rating);
        // Add average rating calculation to the pipeline
        this.pipeline.push({
          $addFields: {
            averageRating: { $avg: '$rating.rate' }, // Compute average of `rate` values
          },
        });
        filter['averageRating'] = { $lte: parsedRating }; // Use computed field
      }

      if (queryObj.rate) {
        filter['hourly_rate'] = { $lte: parseFloat(queryObj.rate) };
      }

      this.pipeline.push({ $match: filter as FilterQuery<T> });
    }

    return this;
  }
  filterByCity(city: string) {
    if (city) {
      this.pipeline.push({
        $match: {
          address: { $regex: city, $options: 'i' }, // Case-insensitive regex match
        },
      });
    }

    return this;
  }

  populate(field: string, from: string, foreignField: string, as: string) {
    this.pipeline.push(
      {
        $lookup: {
          from, // Collection to join
          localField: field, // Field in current collection
          foreignField, // Field in the joined collection
          as, // Output field
        },
      },
      { $unwind: { path: `$${as}`, preserveNullAndEmptyArrays: true } }, // Unwind the array
      {
        $project: {
          'userDetails.createdAt': 0,
          'userDetails.password': 0,
          'userDetails.updatedAt': 0,
          'userDetails.__v': 0,
        },
      }
    );

    return this;
  }

  // Sort method
  sort() {
    const sortBy = this.query?.sortBy as string;

    let sortObj: Record<string, 'asc' | 'desc'> = {};
    if (this.query?.sorting) {
      sortObj = JSON.parse(decodeURIComponent(this.query.sorting as string));
    }

    if (sortBy) {
      // const sortFields = sortBy.split(','); // Split multiple sort fields

      // Build the sort object dynamically
      const sortObject: Record<string, 1 | -1> = {};
      // for (const field of sortFields) {
      //   switch (field) {
      //     case 'hourly_rate':
      //       sortObject['hourly_rate'] =
      //         sortObj['hourly_rate'] === 'asc' ? 1 : -1;
      //       break;
      //     case 'rating':
      //       sortObject['rating'] = sortObj['rating'] === 'asc' ? 1 : -1;
      //       break;
      //     case 'createdAt':
      //       // Use 'createdAt' for tutorProfiles collection or 'userDetails.createdAt' for joined users collection
      //       sortObject['createdAt'] = sortObj['createdAt'] === 'asc' ? 1 : -1;
      //       break;
      //     default:
      //       sortObject['createdAt'] = 1; // Default sorting field
      //   }
      // }

      // Debugging: Check the sort object

      // Add the $sort stage to the pipeline

      sortObject[Object.keys(sortObj)[0]] =
        sortObj[Object.keys(sortObj)[0]] === 'asc' ? 1 : -1;
      this.pipeline.push({ $sort: sortObject });
    }

    return this;
  }

  joinAndFilterByIsBlocked() {
    this.pipeline.push(
      {
        $lookup: {
          from: 'users',
          localField: 'id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $match: {
          'userDetails.isBlocked':
            this.query?.isBlocked === 'true' ? true : false,
        },
      },
      {
        $project: {
          'userDetails.createdAt': 0,
          'userDetails.password': 0,
          'userDetails.updatedAt': 0,
          'userDetails._id': 0,
          'userDetails.__v': 0,
        },
      }
    );

    return this;
  }

  // Execute the aggregation pipeline
  async execute() {
    // console.log(JSON.stringify(this.pipeline, null, 2));
    return await this.modelQuery.model.aggregate(this.pipeline);
  }
}

export default QueryBuilder;
