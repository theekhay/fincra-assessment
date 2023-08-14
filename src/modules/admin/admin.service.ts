import { ExportFormat } from "../../enums/commons.enums";
import { ResponseModel } from "../../model/response-model";
import { FetchTicketRequest, TicketStatusUpdateRequest } from "../ticket/interface";
import { ITicket } from "../ticket/ticket.schema";
import { AdminTicketUpdateRequest } from "./admin.interface";

export default class AdminService  {

    ticketModel: any

    constructor({ ticketModel }){
        this.ticketModel = ticketModel;
    }

    async updateTicket(ticketId: string,  updateTicketRequest: AdminTicketUpdateRequest): 
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

        if(updateTicketRequest.trail){
            query['$addToSet'] = { trail: updateTicketRequest.trail }
        }
    
        const result = await this.ticketModel.findByIdAndUpdate( ticketId, query, { runValidators: true , new: true});
        return new ResponseModel("Ticket updated successfully", result);
        
        } catch (error) {
        console.error('updateTicket error \n %o', error);
        throw new Error(error.message || "Error creating tickets");
        }
    }

    async updateTicketStatus(ticketId: string, updateTicketRequest: TicketStatusUpdateRequest): 
    Promise<ResponseModel<ITicket>> {
        try {   
        const ticket = await this.ticketModel.findById(ticketId);

        if(! ticket){
            throw new Error("Ticket not found!");
        }

        const result = await this.ticketModel.findByIdAndUpdate( ticketId, { status: updateTicketRequest.status }, { runValidators: true , new: true});

        console.log('result', result);
        
        return new ResponseModel("Tickets updated successfully", result);
        } catch (error) {
        console.error('updateTicketStatus error \n %o', error);
        throw new Error(error.message || "Error updating ticket.");
        }
    }

    async getTickets(filter?: FetchTicketRequest): Promise<ResponseModel<ITicket[]>> {
        try {    
        const tickets = await this.ticketModel.find().sort({ createdAt: 'desc' });
        return new ResponseModel("Tickets fetched successfully", tickets);
        } catch (error) {
        console.error('getTickets error \n %o', error);
        return new ResponseModel("Tickets fetched successfully", [], false);
        }
    }

    async exportTicketReport(filter?: { startDate: string, endDate: string, format: ExportFormat }): Promise<void> {
        try {    
        const tickets = await this.ticketModel.find({
            createAt: { $gte: new Date(filter.startDate), $lt: new Date(filter.endDate)}
        }).sort({ createdAt: 'desc' });
        
        } catch (error) {
            console.error('exportTicketReport error \n %o', error);
            throw new Error(error.mssage || "Error processing request")
        }
    }

}