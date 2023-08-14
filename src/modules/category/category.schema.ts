// import * as Mongoose from 'mongoose';
import mongoose, { Schema, Document } from 'mongoose';
import { SupportStatus } from '../../enums/commons.enums';

export interface ICategory extends Document {
  name: string;
  active: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema({
  name: { type: String, required: true, trim: true },
  active: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user'  },
}, { timestamps: true,  versionKey: false});


export const categoryModel =  mongoose.model<ICategory>('Category', categorySchema);