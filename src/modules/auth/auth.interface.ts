import { AccountType } from "../../enums/commons.enums";

export interface LoginRequest{
    email: string;
    password: string;
    type: AccountType;
}

export interface LoginResponse{
    firstName: string;
    lastName: string;
    email: string;
    token: string
}