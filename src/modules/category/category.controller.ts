import * as express from 'express';
import { GenericResponse } from '../../interfaces/GenericResponse';
import { IAuthenticatedReq } from '../../interfaces/request.interface';
import { ResponseModel } from '../../model/response-model';
import { isAdmin } from '../../middlewares/admin.middleware';
import { ICategory } from './category.schema';
import IController from '../../interfaces/Icontroller.interface';
import CategoryService from './category.service';

export default class CategoryController implements IController {

    private categoryService: CategoryService;
    router = express.Router();

    constructor({ categoryService }) {
        this.categoryService = categoryService;
        this.initRoutes();
    }

    initRoutes(): any {

      this.router.get(
            '/category/:categoryId',
            isAdmin,
            this.fetchCategory
        );
        
        this.router.get(
            '/category',
            isAdmin,
            this.fetchCategories
        );
    }

  fetchCategory = async (req: IAuthenticatedReq, res: GenericResponse): Promise<ResponseModel<ICategory>> => {
    try {

      const { categoryId } = req.params;
      const response = await this.categoryService.fetchCategory( categoryId);
      return res.sendResponse(response);

    } catch (error) {
      console.error('fetchCategory error \n %o', error);
      return res.handleRequestError(error);
    }
  }

  fetchCategories = async (req: IAuthenticatedReq, res: GenericResponse): Promise<ResponseModel<ICategory[]>> => {
    try {
      const response = await this.categoryService.fetchCategories();
      return res.sendResponse(response);

    } catch (error) {
      console.error('fetchCategories error \n %o', error);
      return res.handleRequestError(error);
    }
  }
}