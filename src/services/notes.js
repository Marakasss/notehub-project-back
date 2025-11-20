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
  sortBy = 'createdAt',
  sortOrder,
  filters = {},
  userId,
}) => {
  if (!Number.isInteger(page) || page < 1)
    throw createHttpError(400, 'Page must be a positive integer');
  if (!Number.isInteger(perPage) || perPage < 1)
    throw createHttpError(400, 'perPage must be a positive integer');

  const skip = (page - 1) * perPage;

  const query = { userId };

  if (filters.tag && filters.tag !== 'All') {
    query.tag = filters.tag;
  }

  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { content: { $regex: filters.search, $options: 'i' } },
    ];
  }

  const notes = await notesCollection
    .find(query)
    .limit(perPage)
    .skip(skip)
    .sort({ [sortBy]: sortOrder })
    .lean();

  const notesCount = await notesCollection.countDocuments(query);

  return {
    notes,
    ...createPaginationMetadata(page, perPage, notesCount),
  };
};

//============================================================

export const getNoteByID = async (id, userId) => {
  const note = await notesCollection.findOne({ _id: id, userId }).lean();
  return note;
};

//============================================================

export const createNote = async (payload, userId) => {
  const note = await notesCollection.create({ ...payload, userId });
  return note;
};

//x===========================================================

export const updateNote = async (id, payLoad, userId, options = {}) => {
  const updatedNote = await notesCollection.findOneAndUpdate(
    { _id: id, userId },
    { $set: payLoad },
    {
      new: true,
      upsert: options.upsert || false,
    },
  );

  if (!updatedNote) return null;

  return {
    note: updatedNote,
    isNew: options.upsert ? !updatedNote : false,
  };
};

//============================================================

export const deleteNotebyID = async (id, userId) => {
  const note = await notesCollection.findOneAndDelete({
    _id: id,
    userId,
  });
  return note;
};
