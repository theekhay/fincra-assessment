import bcrypt from 'bcrypt'
import { UserService } from '../user'
import { IUser } from '../user/user.schema'
import { ResponseModel } from '../../model/response-model'
import { TokenService } from '../../utils/token.service'
import { LoginRequest, LoginResponse } from './auth.interface'

export default class AuthService {
	
	private userService: UserService;

	constructor({userService}) {
		this.userService = userService
	}

	loginWithPassword = async (credentials: LoginRequest): Promise<ResponseModel<LoginResponse>> => {
		try {
			let { email, password, type } = credentials

			let user: IUser = await this.userService.findByEmailAndAccount(email, type);
			if (!user) {
				throw new Error("Invalid user/password provided.")
			}

			const validPwd = await bcrypt.compareSync(password, user.password)
			if (!validPwd) throw new Error('Invalid login details')

			const token = await TokenService.generateToken(user._id)
		
			return new ResponseModel("Login successful", {
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				token,
			});
		} catch (error) {
			console.error('login error', error);
			throw new Error(error)
		}
	}
}
