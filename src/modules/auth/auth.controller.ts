import * as express from 'express';
import { Request }from 'express';
import { GenericResponse } from '../../interfaces/GenericResponse';
import { ResponseModel } from '../../model/response-model';
import { LoginResponse } from './auth.interface';
import IController from '../../interfaces/Icontroller.interface';
import AuthService from './auth.service';

export default class AuthController implements IController {

    private authService: AuthService;
    router = express.Router();

    constructor({ authService }) {
        this.authService = authService;
        this.initRoutes();
    }

    initRoutes(): any {
        this.router.post(
            '/auth/login',
            this.login
        );
    }

    login = async (req: Request, res: GenericResponse): Promise<ResponseModel<LoginResponse>> => {
    try {
      console.log('req.body', req.body);
      
      const response = await this.authService.loginWithPassword(req.body);
      return res.sendResponse(response);

    } catch (error) {
      console.error('createTicket error \n %o', error);
      return res.handleRequestError(error);
    }
  }
}