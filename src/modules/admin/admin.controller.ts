import * as express from 'express';
import { GenericResponse } from '../../interfaces/GenericResponse';
import { IAuthenticatedReq } from '../../interfaces/request.interface';
import { ResponseModel } from '../../model/response-model';
import { isSupportOrAdmin } from '../../middlewares/issupportoradmin.middleware';
import { TicketService } from '../ticket';
import { ITicket } from '../ticket/ticket.schema';
import { CategoryService } from '../category';
import { ICategory } from '../category/category.schema';
import { isAdmin } from '../../middlewares/admin.middleware';
import { isValidRequest } from '../../middlewares/isValidRequest.middleware';
import { validateAdminRequest } from '../../middlewares/request/admin.validator';
import IController from '../../interfaces/Icontroller.interface';
import AdminService from './admin.service';

export default class AdminController implements IController {

    private ticketService: TicketService;
    private adminService: AdminService;
    private categoryService: CategoryService;
    router = express.Router();

    constructor({ ticketService, userService, categoryService, adminService }) {
        this.ticketService = ticketService;
        this.categoryService = categoryService;
        this.adminService = adminService;
        this.initRoutes();
    }

    initRoutes(): any {

        this.router.patch(
            '/admin/ticket/status/:ticketId',
            isSupportOrAdmin,
            validateAdminRequest('updateTicketStatus'),
            isValidRequest,
            this.updateTicketStatus
        );


        this.router.post(
            '/admin/category',
            isAdmin,
            validateAdminRequest('createCategory'),
            isValidRequest,
            this.createCategory
        );

        this.router.patch(
            '/admin/category/:categoryId',
            isAdmin,
            this.updateTicket
        );

        this.router.patch(
            '/admin/ticket/:ticketId',
            isSupportOrAdmin,
            this.updateTicket
        );

        this.router.get(
            '/admin/ticket',
            isSupportOrAdmin,
            this.fetchTickets
        );

        this.router.get(
            '/admin/ticket/export',
            isAdmin,
            this.exportTicketReport
        );
        
    }


    updateTicket = async (req: IAuthenticatedReq, res: GenericResponse): Promise<ResponseModel<ITicket>> => {
        try {

        const { body } = req;
        const { ticketId } =  req.params;
        const response = await this.adminService.updateTicket(ticketId, body);
        return res.sendResponse(response);

        } catch (error) {
        console.error('updateTicket error \n %o', error.message);
        return res.handleRequestError(error);
        }
    }

    updateTicketStatus = async (req: IAuthenticatedReq, res: GenericResponse): Promise<ResponseModel<ITicket>> => {
        try {

        const { user, body } = req;
        const { ticketId } =  req.params;
        const response = await this.adminService.updateTicketStatus(ticketId, body);
        return res.sendResponse(response);

        } catch (error) {
        console.error('updateTicketStatus error \n %o', error.message);
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

    createCategory = async (req: IAuthenticatedReq, res: GenericResponse): Promise<ResponseModel<ICategory>> => {
        try {

        req.body.createdBy = req.user?._id;
        const response = await this.categoryService.createCategory(req.body);
        return res.sendResponse(response);

        } catch (error) {
        console.error('createCategory error \n %o', error);
        return res.handleRequestError(error);
        }
    }

    updateCategory = async (req: IAuthenticatedReq, res: GenericResponse): Promise<ResponseModel<ICategory>> => {
        try {

        const { categoryId } = req.params;
        const response = await this.categoryService.updateCategory(categoryId, req.body);
        return res.sendResponse(response);

        } catch (error) {
        console.error('updateCategory error \n %o', error.message);
        return res.handleRequestError(error);
        }
    }

    exportTicketReport = async (req: IAuthenticatedReq, res: GenericResponse): Promise<ResponseModel<ICategory>> => {
        try {

        await this.adminService.exportTicketReport(req.body);
        return res.sendResponse(new ResponseModel("Request processed successfully", null));

        } catch (error) {
        console.error('exportTicketReport error \n %o', error.message);
        return res.handleRequestError(error);
        }
    }

}