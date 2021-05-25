/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import { Document, Schema, Model, model } from 'mongoose';

export enum Role {
  USER = 'user',
  EDITOR = 'editor',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

export type AccountOrigin = 'local' | 'google';

export interface UserMeta {
  emailNewsletters: boolean;
  emailVerified: boolean;
  authErrors?: number;
  secureToken?: string;
  secureTokenExpires?: string;
}

export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  avatar?: string;
  active: boolean;
  roles: Role[];
  origin: AccountOrigin[];
  meta: UserMeta;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserModelInterface extends Omit<User, 'id'>, Document {
  fullName(): string;
}

const schema = new Schema<UserModelInterface>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: [true, 'Email already in use'],
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: false, select: false },
    avatar: { type: String, required: false },
    active: { type: Boolean, required: true },
    roles: [{ type: String, required: true, lowercase: true }],
    origin: [{ type: String, required: true, lowercase: true }],
    meta: { type: Map, required: true, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret: UserModelInterface): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
  }
);

schema.methods.fullName = function generateFullName(): string {
  return `${this.firstName?.trim()} ${this.lastName?.trim()}`;
};

export const UserModel: Model<UserModelInterface> = model<UserModelInterface>('User', schema);
