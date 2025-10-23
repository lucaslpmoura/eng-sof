import { User } from "./User.js"
import { DBManager } from "./DBManager.js"

import postgres from 'postgres'

export class UserDBManager extends DBManager{
    maxSize: number = 3;
    


    constructor() {
        super();
        this.table = 'users';

    }

    async registerUser(userData: any) {
        let newUser = this.createUser(userData);
        await this.addUser(newUser);        
    }

    private createUser(userData: any): User {
        if (typeof userData.email != 'string' || !userData.email.includes('@')) {;
            throw new UserError('User email is invalid.', UserErrorType.INVALID_FIELDS);
        }

        if (typeof userData.username != 'string' || !/^[A-Za-z0-9]*$/.test(userData.username)) {
            throw new UserError('Invalid username.', UserErrorType.INVALID_FIELDS);
        }

        if (typeof userData.password != 'string') {
            throw new UserError('User password is invalid.', UserErrorType.INVALID_FIELDS);
        }

        return new User(userData.username, userData.email, userData.password);
    }

    private async addUser(user: User): Promise<void> {
        console.log('Checking size..')
        let size = await this.size();
        if (size >= this.maxSize) {
            throw new UserError('Maximum number of users reached.', UserErrorType.LIST_FULL);
        }
        
        if (await this.isUserRegistered(user)) {
            throw new UserError('User with this email is already Registered.', UserErrorType.USER_REGISTERED);
        }

        //this.list.push(user);
        try {
            this.insert(user.toSchema())
                .then(async () => {
                    try {
                        const result: postgres.Row = await this.getUser(user.id);

                        if (result.u_id == user.id && result.email == user.email) {
                            console.log("User registered succesfully.");
                        } else {
                            throw new Error("Failed to register user!");
                        }
                    } catch (err: any) {
                        console.log(`Error registering user: ${err.message}`)
                    }

                }

                );
        }catch(err: any){
            console.log(`Failed to register user: ${err.message}`);
        }
        
    
    }

    private async isUserRegistered(user: User): Promise<boolean> {
        console.log("Checking to see if user is already registered...");
        const usersInDB = await this.getUser(user.email);

        if(usersInDB.length > 0){
            for(let row of usersInDB){
                if(row.email == user.email){
                    return true;
                }       
            }
        }
        return false;
    }

    public async getAllUsers() {
        return await this.fetchAll();
    }

    public async getUser(key: string): Promise<any> {
        switch(key.includes('@')){
            case true:
                return await this.fetch('email', key);
            case false:
                return await this.fetch('u_id', key);
        }
    }    

}

class UserError extends Error {
    type: UserErrorType

    constructor(msg: string, type: UserErrorType) {
        super(msg);
        this.type = type;
    }


}


export enum UserErrorType {
    INVALID_FIELDS,

    LIST_FULL,
    USER_REGISTERED,

}