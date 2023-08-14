import { AccountType } from "../../enums/commons.enums";
import { ResponseModel } from "../../model/response-model";
import { IUser } from "./user.schema";
import { ObjectId } from 'mongodb';

export default class UserService {

    userModel: any

    constructor({ userModel }){
        this.userModel = userModel;
    }

  async createUser(): Promise<ResponseModel<IUser>> {
      try {    
        const user = await this.userModel.create({
          firstName: "Tokunbo",
          lastName: "ojo",
          email: "ojo_tokunbo2004@yahoo.com",
          password: "1234",
          type: AccountType.CUSTOMER
        })
        return new ResponseModel("User Created successfully", user);
      } catch (error) {
        console.error('createUser error \n %o', error);
        throw new Error(error.message || "Error fetching users");
      }
  }

  async findById(userId: string): Promise<IUser> {
      try {    
        return await this.userModel.findById(userId);
      } catch (error) {
        console.error('createUser error \n %o', error);
        throw new Error(error.message || "User not found!");
      }
  }

  async findByEmailAndAccount(email: string, type: AccountType): Promise<IUser> {
      try {    

        console.log('email', email);
        console.log('type', type);
        
        return await this.userModel.findOne({ email, type });
      } catch (error) {
        console.error('createUser error \n %o', error);
        throw new Error(error.message || "User not found!");
      }
  }

    async getUsers(): Promise<ResponseModel<IUser[]>> {
    try {    
      const users = await this.userModel.find().sort({ createdAt: 'desc' });
      return new ResponseModel("Users fetched successfully", users);
    } catch (error) {
      console.error('getUsers error \n %o', error);
      throw new Error(error.message || "Error fetching users");
    }
  }

}