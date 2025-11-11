import createHttpError from 'http-errors';
import { notesCollection } from '../db/models/notes.js';

const createPaginationMetadata = (page, perPage, totalItems) => {
  const totalPages = Math.ceil(totalItems / perPage);

  if (totalItems === 0) {
    return {
      page,
      perPage,
      totalItems,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    };
  }

  if (page < 1 || page > totalPages) {
    throw createHttpError(400, 'Page number out of range');
  }

  return {
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: totalPages > 1 && page > 1,
    hasNextPage: totalItems > page * perPage,
  };
};

export const getAllNotes = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filters = {},
  userId,
}) => {
  if (!Number.isInteger(page) || page < 1) {
    throw createHttpError(400, 'Page must be a positive integer');
  }
  if (!Number.isInteger(perPage) || perPage < 1) {
    throw createHttpError(400, 'perPage must be a positive integer');
  }
  const skip = (page - 1) * perPage;
  const filtersConditions = notesCollection.find();

  if (filters.tag) {
    filtersConditions.where('tag').equals(filters.tag);
  }

  if (filters.search) {
    filtersConditions.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { content: { $regex: filters.search, $options: 'i' } },
    ];
  }

  const notes = await notesCollection
    .find({ userId })
    .merge(filtersConditions)
    .limit(perPage)
    .skip(skip)
    .sort({ [sortBy]: sortOrder });
  const notesCount = await notesCollection
    .find({ userId })
    .merge(filtersConditions)
    .countDocuments();

  return {
    notes,
    ...createPaginationMetadata(page, perPage, notesCount),
  };
};

//--------------------------------------------------------------
