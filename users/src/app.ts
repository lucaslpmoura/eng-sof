import { UserList, RegisterUserErrorType } from './UserList';

import express from 'express';



const app = express();
app.use(express.json());
const port = 8001;

let users = new UserList();

// Gets the list of all registered users
app.get('/users', (req, res) => {
    res.status(200);
    res.send(users.list);
});


// Adds a new user to the list of registered users
app.post('/users', (req, res) => {
    let status = 500;
    let message = 'The server could not handle your request.';


    try {
        users.registerUser(req.body);
        status = 200;
        message = 'User registered succesfully.';
    } catch (err: any) {
        console.log(`Error creating user: ${err.message}`);
        message = 'A new user could not be created.';

        switch (err.type) {
            case RegisterUserErrorType.FIELDS_MISSING:
                status = 400;
                message += ' Fields Missing.';
                break;
            case RegisterUserErrorType.INVALID_FIELDS:
                status = 400;
                message += ' Inavlid Fields.';
                break;
            case RegisterUserErrorType.USER_REGISTERED:
                status = 400;
                message += ' User with this email aready exists.';
                break;
            case RegisterUserErrorType.LIST_FULL:
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