import { body } from "express-validator";

export const validateTicketRequest  = ( method ) => {

    switch ( method ) {

        case 'createTicket': {

            return [

                body('subject')
                .exists().withMessage("Ticket subject is required")
                .notEmpty().withMessage("subject cannot be empty"),

                body('body')
                .exists().withMessage("Please provide a body for your ticket")
                .notEmpty().withMessage("Ticket body cannot be empty"),
            ]
        }
    }
}