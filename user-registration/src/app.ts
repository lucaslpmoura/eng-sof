import { UserDBManager, UserErrorType } from '@eng-sof/common';

import express from 'express';

const app = express();
app.use(express.json());
const port = 8001;

let users = new UserDBManager();

// Gets the list of all registered users
app.get('/users', async (req, res) => {
    let result  : any[] = [];
    res.status(200);
    if(req.query.id){
        result = await users.getUser(req.query.id.toString());
    }else{
        result = await users.getAllUsers();
    }
    res.send(result);
});


// Adds a new user to the list of registered users
app.post('/users', async (req, res) => {
    let status = 500;
    let message = 'The server could not handle your request.';


    try {
        await users.registerUser(req.body);
        status = 200;
        message = 'User registered succesfully.';
    } catch (err: any) {
        console.log(`Error creating user: ${err.message}`);
        message = 'A new user could not be created.';

        switch (err.type) {
            case UserErrorType.INVALID_FIELDS:
                status = 400;
                message += ' Inavlid Fields.';
                break;
            case UserErrorType.USER_REGISTERED:
                status = 400;
                message += ' User with this email aready exists.';
                break;
            case UserErrorType.LIST_FULL:
                status = 500;
                message += 'Maximum number of users already registered.';
                break;
            default:
                status = 500;
                message = 'Internal Server Error.'
                break;
        }
    }

    res.status(status);
    res.send({ 'message': message });
});



app.listen(port, () => {
    return console.log(`User Service is listening at http://localhost:${port}`);
});