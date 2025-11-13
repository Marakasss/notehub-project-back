import { model, Schema } from 'mongoose';

const UsersSchema = new Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: 'https://ac.goit.global/fullstack/react/default-avatar.jpg',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

UsersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('users', UsersSchema);
