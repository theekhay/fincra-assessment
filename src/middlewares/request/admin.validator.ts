import { body } from "express-validator";

export const validateAdminRequest  = ( method ) => {

    switch ( method ) {

        case 'updateTicketStatus': {

            return [

                body('status')
                .exists().withMessage("name is required")
                .notEmpty().withMessage("name cannot be empty"),
            ]
        }

        case 'createCategory': {

            return [

                body('name')
                .exists().withMessage("name is required")
                .notEmpty().withMessage("name cannot be empty"),

                body('active')
                .optional()
                .isBoolean().withMessage("boolean value expected for active.")
                .notEmpty().withMessage("active cannot be empty"),
            ]
        }

        case 'updateCategory': {

         return [

            body('name')
            .notEmpty().withMessage("name cannot be empty"),

            body('active')
            .isBoolean().withMessage("boolean value expected for active.")
            .notEmpty().withMessage("active cannot be empty"),
         ]
      }
    }
}