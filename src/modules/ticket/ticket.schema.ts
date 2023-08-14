// import * as Mongoose from 'mongoose';
import mongoose, { Schema, Document } from 'mongoose';
import { SupportStatus } from '../../enums/commons.enums';

export interface ISupportTrail extends Document{
  _id?: string;
  createdBy: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITicket extends Document {
  _id: string
  subject: string;
  body: string;
  status: SupportStatus;
  createdBy: string;
  trail: ISupportTrail[];
  createdAt: string;
}

const trailSchema = new Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
  body: { type: String, required: true },
}, { timestamps: true,  versionKey: false});

const ticketSchema = new Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user'  },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  status: { type: String, enum: SupportStatus, default: SupportStatus.OPEN },
  trail: [{ type: trailSchema, default: [] }]
}, { timestamps: true,  versionKey: false});


export const ticketModel =  mongoose.model<ITicket>('Ticket', ticketSchema);