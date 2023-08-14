import { AccountType } from "../../enums/commons.enums";
import { ResponseModel } from "../../model/response-model";
import { IUser } from "../user/user.schema";
import { CreateTicketRequest, FetchTicketRequest, TicketStatusUpdateRequest, TicketUpdateRequest } from "./interface";
import { ITicket } from "./ticket.schema";
import { ObjectId } from 'mongodb';

export default class TicketService  {

    ticketModel: any

    constructor({ ticketModel }){
        this.ticketModel = ticketModel;
    }

  async createTicket(request: CreateTicketRequest): Promise<ResponseModel<ITicket>> {
      try {    

        console.log('request', request);
        
        const ticket = await this.ticketModel.create(request);
        return new ResponseModel("Tickets Created successfully", ticket);
      } catch (error) {
        console.error('createTicket error \n %o', error);
        throw new Error(error.message || "Error creating tickets");
      }
  }

  async fetchTicket(requestUser: IUser, ticketId: string): Promise<ResponseModel<ITicket>> {
    try {   

      const ticket = await this.ticketModel.findById( new ObjectId(ticketId));
      
      if(ticket.createdBy?._id?.toString() !== requestUser._id?.toString() && 
      requestUser.type !== AccountType.ADMIN && 
      requestUser.type !== AccountType.SUPPORT){
        throw new Error("Unauthorized");
      }

      return new ResponseModel("Ticket fetched successfully", ticket);
    } catch (error) {
      console.error('fetchTicket error \n %o', error);
      throw new Error(error.message || "Error creating tickets");
    }
  }

  async updateTicket(requestUser: IUser, ticketId: string,  updateTicketRequest: TicketUpdateRequest): 
  Promise<ResponseModel<ITicket>> {
    try {   
      const ticket: ITicket = await this.ticketModel.findById(ticketId);

      if(! ticket){
        throw new Error("Ticket not found!");
      }

      if(ticket.trail?.length < 1){
         throw new Error("Kindly wait for your ticket to be picked up.");
      }

      let query: Partial<ITicket> = {};

      if(updateTicketRequest.subject && ticket.createdBy?.toString() === requestUser._id?.toString() ){
        query.subject = updateTicketRequest.subject
      }

      if(updateTicketRequest.trail){
        query['$addToSet'] = { trail: updateTicketRequest.trail }
      }
      
      console.log('query', query)

      const result = await this.ticketModel.findByIdAndUpdate( ticketId, query, { runValidators: true , new: true});
      return new ResponseModel("Tickets updated successfully", result);
    
    } catch (error) {
      console.error('updateTicket error \n %o', error);
      throw new Error(error.message || "Error creating tickets");
    }
  }

  async getTickets(requestUser: IUser, filter?: FetchTicketRequest): Promise<ResponseModel<ITicket[]>> {
    try {    
      const tickets = await this.ticketModel.find({ createdBy: requestUser._id }).sort({ createdAt: 'desc' });
      return new ResponseModel("Tickets fetched successfully", tickets);
    } catch (error) {
      console.error('getTickets error \n %o', error);
      // throw new Error(error.message || "Error fetching tickets");
      return new ResponseModel("Tickets fetched successfully", [], false);
    }
  }

}