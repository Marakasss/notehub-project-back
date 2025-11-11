import { getAllNotes } from '../services/notes.js';

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
    // userId: req.user._id,
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
