import JWT from "jsonwebtoken";

export class TokenService {

    static generateToken = async (id: string ) => {

        const secretkey =  process.env.JWT_SECRET_KEY;
        const expiresIn = '6h';        
        return JWT.sign({ id }, secretkey, { expiresIn : expiresIn});
    }

    static validateToken = async (token: any) => {
        return await JWT.verify(token, process.env.JWT_SECRET_KEY);
    }

}
