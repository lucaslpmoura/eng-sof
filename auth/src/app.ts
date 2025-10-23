import { UserDBManager, encryptPassword } from '@eng-sof/common';
import { Auth, PRIVATE_KEY } from './Auth.js';


import express, { json } from 'express';
import jsonwebtoken  from 'jsonwebtoken'

const app = express();
app.use(express.json());
const port = 8002;


const dbManager = new UserDBManager();

app.post('/login', async (req, res) => {
    let status = 400;
    let msg = 'Invalid email or password.';

    try{
        if(req.body.email && req.body.password){
        const result = await dbManager.fetch('email', req.body.email);
    
        if(result.length == 0){
            throw new LoginError(`No user registered with ${req.body.email} in DB.`, LoginErrorType.NO_SUCH_USER);
        }

        if(encryptPassword(req.body.password) != result[0].pword){
            throw new LoginError(`Invalid password for ${req.body.email}.`, LoginErrorType.INVALID_PASSWORD);
        }

        const token = jsonwebtoken.sign(
            {user: JSON.stringify({email: req.body.email, password: req.body.password})},
            PRIVATE_KEY,
            { expiresIn: '60m'}
        )

        status = 200;
        msg = 'Login made succesfully';

        res.status(status);
        res.send({message: msg, token: token});
    }


    }catch(err: any){
        console.log(`Error logging in as ${req.body.email}: ${err.message}`)
        res.status(status);
        res.send({message: msg}); 
    }

    
});

app.use('/*splat', Auth.validateToken);

app.get('/private', (req,res) => {
    return res.status(200).send({message: 'This is a private route!'});
})

app.listen(port, () => {
    return console.log(`Login Service is listening at http://localhost:${port}`);
});

class LoginError extends Error {
    type: LoginErrorType;

    constructor(msg: string, type: LoginErrorType){
        super(msg);
        this.type = type;
    }
}

enum LoginErrorType {
    NO_SUCH_USER,
    INVALID_PASSWORD
}