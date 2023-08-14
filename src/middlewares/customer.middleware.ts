import container from "../container";
import jwt from 'jsonwebtoken';
import { AccountType } from "../enums/commons.enums";

export const isCustomer = (req, res, next) => {

    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined" && bearerHeader.split(" ")[0].toLowerCase() === 'bearer') {
        req.token = bearerHeader.split(" ")[1];
        checkToken(req, res, next)

    } else {
        return res.status(403).json({
            success: false,
            message: "Authorization needed."
        })
    }
}

const checkToken = function (req, res, next) {    
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, data) => {

        if (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid Token",
                data: err.toString()
            })
        }        

        const userService = container.resolve('userService');

        console.log('data.id', data.id);
        
        userService.findById(data.id)

        

            .then(user => {

                console.log('user', user);
                console.log('env', process.env.NODE_ENV);
                

                if (user?.type !== AccountType.CUSTOMER ) {

                    return res.status(401).json({

                        success: false,
                        message: "Unauthorized!!",
                    })
                } else {
                    req.user = user
                }
                next();
            })
            .catch(err => {

                return res.status(403).json({

                    success: false,
                    message: "Unauthorized.",
                    data: err.toString()
                })

            })
    })
}
