import * as express from 'express';
import TicketService from './ticket.service';
import { GenericResponse } from '../../interfaces/GenericResponse';
import { IAuthenticatedReq } from '../../interfaces/request.interface';
import { ITicket } from './ticket.schema';
import { ResponseModel } from '../../model/response-model';
import { isCustomer } from '../../middlewares/customer.middleware';
import { isUser } from '../../middlewares/auth.middleware';
import IController from '../../interfaces/Icontroller.interface';
import { validateTicketRequest } from '../../middlewares/request/ticket.validator';
import { isValidRequest } from '../../middlewares/isValidRequest.middleware';

export default class TicketController implements IController {

    private ticketService: TicketService;
    router = express.Router();

    constructor({ ticketService }) {
        this.ticketService = ticketService;
        this.initRoutes();
    }

    initRoutes(): any {

      this.router.get(
            '/ticket/:ticketId',
            isUser,
            this.fetchTicket
        );
        this.router.get(
            '/ticket',
            isCustomer,
            this.fetchTickets
        );

        this.router.post(
            '/ticket',
            isCustomer,
            validateTicketRequest("createTicket"),
            isValidRequest,
            this.createTicket
        );

        this.router.patch(
            '/ticket/:ticketId',
            isCustomer,
            this.updateTicket
        );
    }

    createTicket = async (req: IAuthenticatedReq, res: GenericResponse): Promise<ResponseModel<ITicket>> => {
      try {

        req.body.createdBy = req.user?._id;
        const response = await this.ticketService.createTicket(req.body);
        return res.sendResponse(response);

      } catch (error) {
        console.error('createTicket error \n %o', error);
        return res.handleRequestError(error);
      }
    }

    fetchTicket = async (req: IAuthenticatedReq, res: GenericResponse): Promise<ResponseModel<ITicket>> => {
      try {

        const { ticketId } = req.params;
        const response = await this.ticketService.fetchTicket(req.user, ticketId);
        return res.sendResponse(response);

      } catch (error) {
        console.error('createTicket error \n %o', error);
        return res.handleRequestError(error);
      }
    }

    fetchTickets = async (req: IAuthenticatedReq, res: GenericResponse): Promise<ResponseModel<ITicket[]>> => {
      try {
        const response = await this.ticketService.getTickets(req.body);
        return res.sendResponse(response);

      } catch (error) {
        console.error('fetchTickets error \n %o', error);
        return res.handleRequestError(error);
      }
    }

    updateTicket = async (req: IAuthenticatedReq, res: GenericResponse): Promise<ResponseModel<ITicket>> => {
      try {

        const { user, body } = req;
        const { ticketId } =  req.params;
        const response = await this.ticketService.updateTicket(user, ticketId, body);
        return res.sendResponse(response);

      } catch (error) {
        console.error('createTicket error \n %o', error);
        return res.handleRequestError(error);
      }
    }
}