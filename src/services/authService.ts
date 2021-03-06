import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
//import {User} from '../models/User';
import {User} from '../beans/User';

const secretKey= "aaa";

export async function generateToken(user:User){
    let data = {
        id: user.id,
        email: user.email
    }

    return await jwt.sign(data,secretKey,{expiresIn:'1d'});
}

export async function decodeToken(token:any) {
    var data = await jwt.verify(token,secretKey);
    return data;
}

//isso é um middleware, nao confundir com as funções acima
export async function authorize(req: Request,res: Response,next: NextFunction) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization ;

    if (!token) {
        res.status(401).json({ //sei la porque aqui nao foi "send"
            message: "Unauthenticated"
        });
    } else {
        jwt.verify(token,secretKey,function(error:any,decoded:any){
            if (error) {
                res.status(401).json({
                    message: "Invalid token"
                });
            } else {
                console.log("decodedAqui>"+decoded);
                //nao posso retornar isso pq mostra as info confidenciais do user em cada request
                //req.body.tokeninfo = decoded;
                next();
            }
        });
    }
};


// exports.generateToken = async(data:any) => {
//     return jwt.sign(data,secretKey,{expiresIn:'1d'});
// }

// exports.decodeToken = async (token:any) => {
//     var data = await jwt.verify(token,secretKey);
//     return data;
// };

// exports.authorize = function(req: Request,res: Response,next: NextFunction) {
//     var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization ;

//     if (!token) {
//         res.status(401).json({ //sei la porque aqui nao foi "send"
//             message: "Unauthenticated"
//         });
//     } else {
//         jwt.verify(token,secretKey,function(error:any,decoded:any){
//             if (error) {
//                 res.status(401).json({
//                     message: "Invalid token"
//                 });
//             } else {
//                 next();
//             }
//         });
//     }
// };

