import mongoose, { Schema, Document } from 'mongoose';
import { AccountType } from '../../enums/commons.enums';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  _id?: string
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  type: AccountType
}

const userSchema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, trim: true, unique: true, toLowercase: true },
  password: { type: String, required: true },
  type: { type: String, required: true, enum: AccountType },
}, { timestamps: true,  versionKey: false });


userSchema.pre('save',  async function(next){

    try{

        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
        next()

    } catch( err ){
        next(err);
    }
})

export const userModel = mongoose.model<IUser>('User', userSchema);