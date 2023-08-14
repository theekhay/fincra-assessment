import { Response } from "express"; 

export interface GenericResponse extends Response {

    handleRequestError: any;

    sendResponse(response: { data: any, message: string, success: boolean });

}
