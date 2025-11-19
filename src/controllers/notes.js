import createHttpError from 'http-errors';
import {
  createNote,
  deleteNotebyID,
  getAllNotes,
  getNoteByID,
  updateNote,
} from '../services/notes.js';

//============================================================

const buildNotesFilter = (query) => {
  return {
    tag: query.tag,
    search: query.search,
  };
};

export const getNotesController = async (req, res) => {
  const notes = await getAllNotes({
    page: req.validatedQuery.page,
    perPage: req.validatedQuery.perPage,
    search: req.validatedQuery.search,
    sortBy: req.validatedQuery.sortBy,
    sortOrder: req.validatedQuery.sortOrder,
    filters: buildNotesFilter(req.validatedQuery),
    userId: req.user._id,
  });

  const message = notes.notes.length
    ? 'Successfully found notes!'
    : 'You don’t have any saved notes yet.';

  res.status(200).json({
    status: 200,
    message,
    data: notes,
  });
  return;
};

//============================================================

export const getNoteByIdController = async (req, res) => {
  const { noteId } = req.params;
  const note = await getNoteByID(noteId, req.user._id);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found note with id ${noteId}!`,
    data: note,
  });
};

//============================================================

export const createNoteController = async (req, res) => {
  const note = await createNote({ ...req.body }, req.user._id);

  res.status(201).json({
    status: 201,
    message: `Successfully created a note!`,
    data: note,
  });
};

//============================================================

export const patchNoteController = async (req, res, next) => {
  const { noteId } = req.params;

  const result = await updateNote(noteId, { ...req.body }, req.user._id);

  if (!result) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a note!`,
    data: result.note,
  });
};

//============================================================

export const deleteNoteController = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await deleteNotebyID(noteId, req.user._id);

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully deleted a note!`,
    data: note,
  });
};
