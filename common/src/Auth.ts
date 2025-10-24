import 'dotenv/config'

import jsonwebtoken from 'jsonwebtoken';

export let PRIVATE_KEY = '';

if(process.env.PRIVATE_KEY){
    PRIVATE_KEY = process.env.PRIVATE_KEY;
}


export class Auth {

    public static validateToken(req : any, res : any, next: any) {
        const token =  req.headers.auth;
        if(!token) return res.status(401).send({message: 'Acces Denied. No Token Provided.'});

        try{
            const payload = jsonwebtoken.verify(token, PRIVATE_KEY);
            const userId = typeof payload != 'string' && payload.user;

            if(!userId){
                return res.status(401).send({message: 'Invalid Token.'});
            }

            req.headers['user'] = JSON.parse(payload.user).email;

            return next();
        }catch (error : any) {
            console.log(`Error validating JWT: ${error.message}`);
            return res.status(401).send({message: 'Invalid Token.'});
        }
    }
}