import AdminController from "./modules/admin/admin.controller";
import AdminService from "./modules/admin/admin.service";
import { AuthController, AuthService } from "./modules/auth";
import { CategoryController, CategoryService, categoryModel } from "./modules/category";
import { TicketController, TicketService, ticketModel } from "./modules/ticket";
import { UserController, UserService, userModel } from "./modules/user";
import SeedService from "./seeder/seed.service";


const awilix = require('awilix');

const container = awilix.createContainer({
	injectionMode: awilix.InjectionMode.PROXY
});

container.register({

  ticketController: awilix.asClass(TicketController),
  ticketService: awilix.asClass(TicketService),
  ticketModel: awilix.asValue(ticketModel),

  userController: awilix.asClass(UserController),
  userService: awilix.asClass(UserService),
  userModel: awilix.asValue(userModel),

  authController: awilix.asClass(AuthController),
  authService: awilix.asClass(AuthService),

  adminController: awilix.asClass(AdminController),
  adminService: awilix.asClass(AdminService),

  categoryController: awilix.asClass(CategoryController),
  categoryService: awilix.asClass(CategoryService),
  categoryModel: awilix.asValue(categoryModel),

  seedService: awilix.asClass(SeedService),

})

export default container;
