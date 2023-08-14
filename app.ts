import express from 'express'
import { Application } from 'express';
import 'reflect-metadata';
import dotenv from 'dotenv';
const envFound = dotenv.config();
import app from '.';
import rateLimit from 'express-rate-limit';
import swaggerUi from "swagger-ui-express";

if (envFound.error && process.env.NODE_ENV === 'development') {
    throw new Error('⚠️  Couldn\'t find .env file  ⚠️');     // This error should crash whole process

}

class App {
    
    public app: Application
    public port: number

    constructor(appInit: { port: number; middleWares: any; controllers: any; services: any; postMiddleWares: any }) {

        this.app = express()
        this.port = appInit.port
        this.rateLimiter();
        this.swagger();
        this.middlewares(appInit.middleWares)
        this.routes(appInit.controllers)
        this.postMiddlewares(appInit.postMiddleWares)
        this.seed(appInit.services);

    }

    private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }) {
        middleWares.forEach(middleWare => {
            this.app.use(middleWare)
        })
    }

    private postMiddlewares(postMiddleWares: { forEach: (arg0: (postMiddleWare: any) => void) => void; }) {
        postMiddleWares.forEach(postMiddleWare => {
            this.app.use(postMiddleWare)
        })
    }

    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void; }) {
        controllers.forEach(controller => {
            this.app.use(`/v1`, controller.router)
        })
    }

    private seed({ seedService }) {
        try{

            if(process.env.NODE_ENV !== 'test'){
                seedService.seed();
            }
        }
    
        catch(err) {
            console.error("error seeding app");
        }
    }

    private rateLimiter() {

        const webLimiter = rateLimit({
            windowMs: 1 * 60 * 1000, // 1 minute makes a windowMs
            max: 5 // limit each IP to 5 requests per windowMs
          });
          
          //  apply to all requests with the /v1/ prefix
          this.app.use("/v1/", webLimiter);

        // const limiter = rateLimit({
        //     windowMs: 60 * 60 * 1000, // 1 hour makes a windowMs
        //     max: 5 // limit each IP to 200 requests per windowMs
        //   });
          
        //   //  apply to all requests with the /v1/ prefix
        //   this.app.use("/v1/",limiter);
    }

    private swagger(){
        this.app.use(
            "/docs",
            swaggerUi.serve,
            swaggerUi.setup(undefined, {
                swaggerOptions: {
                url: "./swagger.json",
                },
            })
            );
    }


    public listen() {
        this.app.listen(this.port, () => {
            console.info("App listening on the http://localhost:%s", this.port);
        })
    }


    getExpressInstance(): Application {
        return this.app;
    }

}

export default App
