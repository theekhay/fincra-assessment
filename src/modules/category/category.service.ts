import { ResponseModel } from "../../model/response-model";
import { ObjectId } from 'mongodb';
import { ICategory } from "./category.schema";
import { CreateCategoryRequest, UpdateCategoryRequest } from "./category.interface";

export default class CategoryService  {

    categoryModel: any

    constructor({ categoryModel }){
        this.categoryModel = categoryModel;
    }

  async createCategory(request: CreateCategoryRequest): Promise<ResponseModel<ICategory>> {
      try {    
    
        const category = await this.categoryModel.create(request);
        return new ResponseModel("Category Created successfully", category);
      } catch (error) {
        console.error('createCategory error \n %o', error);
        throw new Error(error.message || "Error creating category");
      }
  }

  async fetchCategory(categoryId: string): Promise<ResponseModel<ICategory>> {
    try {   

      const category = await this.categoryModel.findById( new ObjectId(categoryId));
      return new ResponseModel("Category fetched successfully", category);
    
    } catch (error) {
      console.error('fetchCategory error \n %o', error);
      throw new Error(error.message || "Error creating categorys");
    }
  }

  async updateCategory(categoryId: string,  updateCategoryRequest: UpdateCategoryRequest): 
  Promise<ResponseModel<ICategory>> {
    try {   
      const category = await this.categoryModel.findById(categoryId);

      if(! category){
        throw new Error("Category not found!");
      }

      const result = await this.categoryModel.findByIdAndUpdate( categoryId, updateCategoryRequest, { runValidators: true , new: true});
      return new ResponseModel("Category updated successfully", result);
    
    } catch (error) {
      console.error('updateCategory error \n %o', error);
      throw new Error(error.message || "Error creating categorys");
    }
  }

async fetchCategories(): Promise<ResponseModel<ICategory[]>> {
    try {    
      const categorys = await this.categoryModel.find();
      return new ResponseModel("Categoryies fetched successfully", categorys);
    } catch (error) {
      console.error('getCategories error \n %o', error.message);
      return new ResponseModel("Categories fetched successfully", [], false);
    }
  }

}