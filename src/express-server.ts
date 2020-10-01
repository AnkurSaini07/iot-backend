import * as express from "express";
import * as bodyParser from "body-parser";
import {Container} from "typedi";

const expressApp = express();

expressApp.use(bodyParser.json());

export const Get = (path: string) => {
    return (target: any, name: string) => {
        expressApp.get(path, (req, res) => {
            const service = Container.get(target.constructor);
            // @ts-ignore
            return service[name](req, res);
        });
    };
};

export const Post = (path: string) => {
    return (target: any, name: string) => {
        expressApp.post(path, (req, res) => {
            const service = Container.get(target.constructor);
            // @ts-ignore
            return service[name](req, res);
        });
    };
};

export default expressApp;
