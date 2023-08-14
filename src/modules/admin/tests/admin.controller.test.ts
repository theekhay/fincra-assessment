import { Connection, connect } from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { IUser } from "../../user/user.schema";
import { userModel } from '../../user'
import { AccountType, SupportStatus } from "../../../enums/commons.enums";
import { AuthService } from "../../auth";
import { TicketService } from "../../ticket";
import container from "../../../container";
import request from "supertest";
import app from "../../../..";

require("dotenv").config();

const req = request(app.getExpressInstance());
let adminUser: IUser
let supportUser: IUser
let customer: IUser

let customerToken: string;
let adminToken: string;

let authService: AuthService;
let ticketService: TicketService;

describe('AdminController', () => {
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;

    beforeAll(async () => {
      
      try {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();   
        mongoConnection = (await connect(uri)).connection;

       authService = container.resolve('authService');
       ticketService = container.resolve('ticketService');

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
        adminToken = (await authService.loginWithPassword({ email: adminUser.email, password: '1234', type: adminUser.type})).data.token
    
    
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

        const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
      await mongoConnection.close();
        
      } catch (error) {
        return;
      }
    });

    it("should create a category if user is an admin", async () => {  
        const res = await req.post("/v1/admin/category")
        .set({'Authorization': `Bearer ${adminToken}`, Accept: 'application/json'} )
        .send({
          name: "Payments",
        })    

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();  
        expect(res.body?.success).toBe(true);  
        
    });

    it("should return 401 if user who is not an admin attempts to create a ticket", async () => {   
      
      const res = await req.post("/v1/admin/category")
        .set({'Authorization': `Bearer ${customerToken}`, Accept: 'application/json'} )
        .send({
          name: "Payments",
        })    

        console.log('res.body', res.body);
        
        expect(res.statusCode).toBe(401);
        expect(res.body?.success).toBe(false);  
      
    });

    it("should allow an admin or support to update the status of a ticket", async () => {   
    
        const ticket = await ticketService.createTicket({
            subject: 'Test subject',
            body: "test body",
            createdBy: customer?._id
        })
    
      const res = await req.patch(`/v1/admin/ticket/status/${ticket?.data?._id?.toString()}`)
        .set({'Authorization': `Bearer ${adminToken}`, Accept: 'application/json'} )
        .send({
          status: SupportStatus.CLOSED,
        })    
        
        expect(res.statusCode).toBe(200);
        expect(res.body?.success).toBe(true);  
        expect(res.body?.data?.status).toBe(SupportStatus.CLOSED);  
      
    });


    it("should return a 401 when a non-admin tries status of a ticket", async () => {   
    
        const ticket = await ticketService.createTicket({
            subject: 'Test subject',
            body: "test body",
            createdBy: customer?._id
        })
    
      const res = await req.patch(`/v1/admin/ticket/status/${ticket?.data?._id?.toString()}`)
        .set({'Authorization': `Bearer ${customerToken}`, Accept: 'application/json'} )
        .send({
          status: SupportStatus.CLOSED,
        })    
        
        expect(res.statusCode).toBe(401);
        expect(res.body?.success).toBe(false);  
      
    });
});
