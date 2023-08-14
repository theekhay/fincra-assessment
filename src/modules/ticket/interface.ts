import { AccountType, SupportStatus } from "../../enums/commons.enums";
import { ISupportTrail } from "./ticket.schema";

export interface TicketUpdateRequest{
    subject?: string;
    body?: string;
    trail?: ISupportTrail,
}

export interface CreateTicketRequest{
    subject: string;
    body: string;
    createdBy: string
}

export interface FetchTicketRequest{
    subject: string;
    // trail: ISupportTrail,
}

export interface TicketStatusUpdateRequest{
    status: SupportStatus;
}