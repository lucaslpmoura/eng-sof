import express from 'express';
import { Response } from 'express';

import 'dotenv/config'
import { Cors } from '@eng-sof/common';

const PROTOCOL = 'http://'
const APP_IP_ADDR = 'localhost';
const BASE_URI = `${PROTOCOL}${APP_IP_ADDR}`;

const USER_REGISTRATION_PORT = '8001';
const USER_REGISTRATION_ENDPOINT = '/users';

const AUTH_PORT = '8002';
const AUTH_ENDPOINT = '/login';

const FEED_PORT = '8003';
const FEED_ENDPOINT = '/post';

const app = express();
app.use(express.json());
const port = 8000;

app.use(Cors.setCors);
app.options('/*route', Cors.setCors);


// Getting User Info
app.get('/api/users', async (req, res) => {
    try{
        const token = req.get('auth');

        if(!token){
            res.status(401).send({status: 401, 'message': 'No token provided.'});
            return;
        }


        let query = '';
        if(req.query){
            if(Object.keys(req.query).length > 1){
                res.status(400).send({status: 400, 'message': 'Invalid Query.'});
            }

            query = `?${Object.keys(req.query)[0]}=${Object.values(req.query)[0]}`;
        }

        const response = await fetch(`${BASE_URI}:${USER_REGISTRATION_PORT}${USER_REGISTRATION_ENDPOINT}${query}`, {
            method: "GET",
            headers: {
                auth: token
            }
        });

        const payload: any = await response.json();
    }catch(err :any){
        console.error(`Error communicating with auth serivice: ${err.message}`);
        res.status(500).send({'status': 500, 'message': 'Error with the API.'});
    }

})
// User Registration
app.post('/api/users', async (req, res) => {
    try {
        const response = await fetch(`${BASE_URI}:${USER_REGISTRATION_PORT}${USER_REGISTRATION_ENDPOINT}`, {
            method: "POST",
            body: JSON.stringify(req.body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const payload: any = await response.json();
        res.status(payload.status).send(payload);
    } catch (err: any) {
        console.error(`Error communicating with user-registration service: ${err.message}`);
        res.status(500).send({ 'status': 500, 'message': 'Error with the API.' });
    }

});



// Login (Getting JWT)
app.post('/api/login', async (req, res) => {
    try {
        const response = await fetch(`${BASE_URI}:${AUTH_PORT}${AUTH_ENDPOINT}`, {
            method: "POST",
            body: JSON.stringify(req.body),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const payload: any = await response.json();
        res.status(payload.status).send(payload);
    }catch(err : any){
        console.error(`Error communicating with auth serivice: ${err.message}`);
        res.status(500).send({'status': 500, 'message': 'Error with the API.'});
    }
    
});


// Posts
// Getting Post(s)
app.get('/api/post', async (req, res) => {
    try{
        const token = req.get('auth');

        if(!token){
            res.status(401).send({status: 401, 'message': 'No token provided.'});
            return;
        }

        let query = '';
        if(req.query){
            if(Object.keys(req.query).length > 1){
                res.status(400).send({status: 400, 'message': 'Invalid Query.'});
            }

            query = `?${Object.keys(req.query)[0]}=${Object.values(req.query)[0]}`;
        }

        const response = await fetch(`${BASE_URI}:${FEED_PORT}${FEED_ENDPOINT}${query}`, {
            method: "GET",
            headers: {
                auth: token
            }
        });

        const payload: any = await response.json();
 
        res.status(payload.status).send(payload);
    }catch(err: any){
        console.error(`Error communicating with feed service: ${err.message}`);
        res.status(500).send({'status': 500, 'message': "Error with the API."});
    }
});


// Making Post
app.post('/api/post', async (req, res) => {
    try{
        const token = req.get('auth');

        if(!token) {
            res.status(401).send({status: 401, 'message': 'No token provided.'});
            return;
        }

        const response = await fetch(`${BASE_URI}:${FEED_PORT}${FEED_ENDPOINT}`, {
            method: "POST",
            body: JSON.stringify(req.body),
            headers: {
                'Content-Type': 'application/json',
                'auth': token
            }
        });

        const payload :any = await response.json();
        res.status(payload.status).send(payload);
    }catch(err: any){
        console.error(`Error communicating POST with feed service: ${err.message}`);
        res.status(500).send({'status': 500, 'message': "Error with the API."});
    }
});

// Deleting Post
app.delete('/api/post', async (req, res) => {
    try{
        const token = req.get('auth');
        if(!token) {
            res.status(401).send({status: 401, 'message': 'No token provided.'});
            return;
        }

        if (!req.query.id) {
            res.status(400).send({message: "No Post ID specified."});
            return;
        }

        const query = `?id=${req.query.id}`;
        console.log(query);

        const response = await fetch(`${BASE_URI}:${FEED_PORT}${FEED_ENDPOINT}${query}`, {
            method: "DELETE",
            body: JSON.stringify(req.body),
            headers: {
                'Content-Type': 'application/json',
                'auth': token
            }
        });

        const payload :any = await response.json();
        res.status(payload.status).send(payload);
    }catch(err:any){
        console.error(`Error communicating DELETE with feed serivce: ${err.message}`);
        res.status(500).send({'status': 500, 'message': 'Error with the API.'});
    }
});

app.listen(port, () => {
    return console.log(`Application is listening at http://localhost:${port}`);
});