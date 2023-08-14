import { AccountType } from '../enums/commons.enums';

export default class SeedService  {

    ticketModel: any;
    userModel: any;
    categoryModel: any;

    constructor({ ticketModel, userModel, categoryModel }){
        this.ticketModel = ticketModel;
        this.userModel = userModel;
        this.categoryModel = categoryModel;
    }

  async seed() {

    let adminUser;
    let supportUser;
    let customer;

      try {    

        await this.userModel.deleteMany({});
        await this.categoryModel.deleteMany({});

        adminUser = await this.userModel.create({
          firstName: "Admin",
          lastName: "user",
          email: "admin@fincra.com",
          password: "P@ssw0rd",
          type: AccountType.ADMIN
        })

        supportUser = await this.userModel.create({
          firstName: "support",
          lastName: "user",
          email: "support@fincra.com",
          password: "P@ssw0rd1",
          type: AccountType.SUPPORT
        })

        customer = await this.userModel.create({
          firstName: "Adamu",
          lastName: "Obi",
          email: "customer@yahoo.com",
          password: "P@ssw0rd2",
          type: AccountType.CUSTOMER
        })

        await this.categoryModel.create({
          name: "Refund",
          createdBy: adminUser?._id
        })

        return;
      } catch (error) {
        console.error('createTicket error \n %o', error);
        throw new Error(error.message || "Error creating tickets");
      }
  }

}