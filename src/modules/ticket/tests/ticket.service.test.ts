import { Connection, connect } from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { IUser } from "../../user/user.schema";
import { userModel } from '../../user'
import { AccountType } from "../../../enums/commons.enums";
import { AuthService } from "../../auth";
import container from "../../../container";
import request from "supertest";
import app from "../../../..";
import TicketService from "../ticket.service";
import { ITicket } from "../ticket.schema";

require("dotenv").config();

const req = request(app.getExpressInstance());
let adminUser: IUser;
let supportUser: IUser;
let customer: IUser;

let ticket: ITicket;

let customerToken: string;
let authService: AuthService;
let ticketService: TicketService;

describe('TicketService', () => {
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

        customerToken = (await authService.loginWithPassword({ email: customer.email, password: customer.password, type: customer.type})).data.token
    
    
      } catch (error) {
        return;
      }
    })

    beforeEach(async () => {

      try {
         jest.clearAllMocks();
         const collections = mongoConnection.collections;
          for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
          }
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

    it("should not allow customer comment until support has responded", async () => { 
      
      try {
        ticket = (await ticketService.createTicket({
          subject: "test subject",
          body: "my complaint",
          createdBy: customer?._id?.toString()
        })).data;

        ticketService.updateTicket(customer, ticket?._id, { subject: "Updated request"} )
      } catch (error) {
        expect(error.message).toBe("Kindly wait for your ticket to be picked up.");
        
      }      
    });


});
