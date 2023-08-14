
import { validationResult } from 'express-validator';


export const isValidRequest = (req, res, next) => {

    const errors = validationResult(req);

    if ( ! errors.isEmpty() ) {
    
		const errorsArray = errors.array();
        return res.status(422).send({
            
            success: false,
            // message: "Your request has some validation errors",
			message: errorsArray[0].msg,
            data: errors.array()
        });
    }

    next();
}
