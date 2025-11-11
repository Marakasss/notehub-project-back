import { model, Schema, Types } from 'mongoose';

const noteSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'users',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    tag: {
      type: String,
      required: true,
      enum: [
        'All',
        'Work',
        'Personal',
        'Meeting',
        'Shopping',
        'Ideas',
        'Travel',
        'Finance',
        'Health',
        'Important',
        'Todo',
      ],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const notesCollection = model('notes', noteSchema);
