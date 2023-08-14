import { Connection, connect } from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { IUser } from "../../user/user.schema";
import { userModel } from '../../user'
import { AccountType } from "../../../enums/commons.enums";
import { AuthService } from "../../auth";
import container from "../../../container";
import request from "supertest";
import app from "../../../..";

require("dotenv").config();

const req = request(app.getExpressInstance());
let adminUser: IUser
let supportUser: IUser
let customer: IUser

let customerToken: string;
let authService: AuthService;

describe('TicketController', () => {
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;

    beforeAll(async () => {
      
      try {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();   
        mongoConnection = (await connect(uri)).connection;

       authService = container.resolve('authService');

        adminUser = await userModel.create({
          firstName: "Admin",
          lastName: "user",
          email: "admin@fincra.com",
          password: "1234",
          type: AccountType.ADMIN
        })

         supportUser = await userModel.create({
          firstName: "support",
          lastName: "user",
          email: "support@fincra.com",
          password: "1234",
          type: AccountType.SUPPORT
        })

        customer = await userModel.create({
          firstName: "Adamu",
          lastName: "Obi",
          email: "customer@yahoo.com",
          password: "1234",
          type: AccountType.CUSTOMER
        })

        customerToken = (await authService.loginWithPassword({ email: customer.email, password: '1234', type: customer.type})).data.token
    
    
      } catch (error) {
        return;
      }
    })

    beforeEach(async () => {

      try {
         jest.clearAllMocks();
      } catch (error) {
        return;
      }
    });

    afterEach(async () => {

      try {
      await mongoConnection.close();
        
      } catch (error) {
        return;
      }
    });

    it("should create a ticket", async () => {  
        const res = await req.post("/v1/ticket")
        .set({'Authorization': `Bearer ${customerToken}`, Accept: 'application/json'} )
        .send({
          subject: "Ticket subject",
          body: "Ticket body",
        })    

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();   
        
    });

    it("should return 422 if required inputs are missing", async () => {   
      
      try {
        const res = await req.post("/v1/ticket")
      .set({'Authorization': `Bearer ${customerToken}`, Accept: 'application/json'} )
      .send({
        subject: "Ticket subject",
      })    

      expect(res.statusCode).toBe(422);
      expect(res.body?.success).toBe(false)
      } catch (error) {
        return;
      }
      
    });

});
