import * as express from 'express';
import UserService from './user.service';
import IController from '../../interfaces/Icontroller.interface';
import { userRoutes } from './user.route';
import { IAuthenticatedReq } from '../../interfaces/request.interface';
import { GenericResponse } from '../../interfaces/GenericResponse';
import { IUser } from './user.schema';
import { ResponseModel } from '../../model/response-model';
;

export default class UserController implements IController {

    private userService: UserService;
    router = express.Router();

    constructor({ userService }) {
        this.userService = userService;
        this.initRoutes();
    }

    initRoutes(): any {

        this.router.get(
            userRoutes.ic,
            this.fetchTickets
        );

        this.router.post(
            '/user',
            this.createUser
        );
    }

    createUser = async (req: IAuthenticatedReq, res: GenericResponse): Promise<ResponseModel<IUser>> => {
    try {
      const response = await this.userService.createUser();
      return res.sendResponse(response);

    } catch (error) {
      console.error('createTicket error \n %o', error);
      return res.handleRequestError(error);
    }
  }

    fetchTickets = async (req: IAuthenticatedReq, res: GenericResponse): Promise<ResponseModel<IUser[]>> => {
    try {
      const response = await this.userService.getUsers();
      return res.sendResponse(response);

    } catch (error) {
      console.error('fetchTickets error \n %o', error);
      return res.handleRequestError(error);
    }
  }
}