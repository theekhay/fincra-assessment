import App from './app'
import * as bodyParser from 'body-parser'
import cors from 'cors'
import container from './src/container'
import { pagination } from './src/utils/paginaiton.util'
import { IRequestFilter, OrderDirection } from './src/interfaces/request.interface'
import { error404, errorHandler, normalizePort } from './src/utils/common.util';
import dbConfig from './config/db.config';



if(process.env.NODE_ENV !== 'test'){
 dbConfig.connect()
}


const app = new App({
  port: normalizePort(process.env.PORT),

  middleWares: [
     bodyParser.json({
      limit: '50mb'
    }),
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit: 50000
    }),
    
    cors(),

    function (req, _res, next) {
      req.startTime = Date.now()
      next()
    },
  
    function (req, res, next) {
      req.paginate = () => {
        const options: IRequestFilter = {
          limit: Number(req.query.limit) || 20,
          page: Number(req.query.page) || 0,
          orderDirection: req.query.orderDirection || OrderDirection.DESC,
          orderBy: req.query.orderBy || 'created_at'
        }

        return options
      }

      res.sendResponse = function ({ data, message = 'successful', success }) {
        return res.status(200).json({
					success,
					message: message || 'Operation Successful', 
					data
				})
      }

      res.handleRequestError = function (
        error,
        status = 400,
        msg = error.message || 'Operation failed'
      ) {
        let message: String
        let data

        //logRequest(req, status)
        return res.status(status).json({
          success: false,
          message: msg,
          data
        })
      }

      res.sendCustomResponse = (data, status = 200, message: string = 'Operation Successful', success: boolean = true) => {
       // logRequest(req, status)
        if (data?.total)
          data['pagination'] = pagination(
            data?.total,
            req.paginate(),
            {},
            req?._parsedUrl?.pathname
          )
        return res.status(status).json({
          success,
          message,
          data
        })
      }

      next()
    }
  ],

  controllers: [
    container.resolve('ticketController'),
    container.resolve('userController'),
    container.resolve('authController'),
    container.resolve('adminController'),
  ],

  services: {
    seedService: container.resolve('seedService'),
  },

  postMiddleWares: [error404, errorHandler]
})

app.listen()

export default app
