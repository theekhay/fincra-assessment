import { Request } from 'express';
import { IUser } from '../modules/user/user.schema';

export interface IAuthenticatedReq extends Request {
  user: IUser;
}

export interface IRequestFilter {

    orderDirection?: OrderDirection,
    orderBy?: String,
    sortBy?: string,
    skip?: number,
    limit: number,
    page: number
}

export enum OrderDirection {

    ASC="ASC",
    DESC= "DESC"
}
