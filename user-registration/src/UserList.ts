import { User } from "@eng-sof/common"
import { DBManager } from "@eng-sof/common";

import postgres from 'postgres'

export class UserList extends DBManager{
    maxSize: number = 3;

    constructor() {
        super();
        this.table = 'User';

    }

    async registerUser(userData: any) {
        let newUser = this.createUser(userData);
        await this.addUser(newUser);        
    }

    private createUser(userData: any): User {
        if (typeof userData.email != 'string' || !userData.email.includes('@')) {
            throw new UserListError('User email is invalid.', UserListErrorType.INVALID_FIELDS);
        }

        if (typeof userData.username != 'string' || !/^[A-Za-z0-9]*$/.test(userData.username)) {
            throw new UserListError('Invalid username.', UserListErrorType.INVALID_FIELDS);
        }

        if (typeof userData.password != 'string') {
            throw new UserListError('User password is invalid.', UserListErrorType.INVALID_FIELDS);
        }

        return new User(userData.username, userData.email, userData.password);
    }

    private async addUser(user: User): Promise<void> {
        console.log('Checking size..')
        let size = await this.size();
        if (size >= this.maxSize) {
            throw new UserListError('Maximum number of users reached.', UserListErrorType.LIST_FULL);
        }
        
        if (await this.isUserRegistered(user)) {
            throw new UserListError('User with this email is already Registered.', UserListErrorType.USER_REGISTERED);
        }

        //this.list.push(user);
        try {
            this.insertUserToDB(user)
                .then(async () => {
                    try {
                        const result: postgres.Row = await this.getUserFromDB(user.id);

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
        const usersInDB = await this.sql
            `SELECT u_id, email FROM Users WHERE email=${user.email} `;

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
        return await this.getAllUsersFromDB();
    }

    public async getUser(id: string): Promise<any> {
        return await this.getUserFromDB(id);
    }

    private async getAllUsersFromDB(): Promise<any> {
        const users = await this.sql
            `SELECT * FROM Users`;

        return users;
    }

    private async getUserFromDB(id: string): Promise<postgres.Row> {
        console.log(`Retrieving from DB: ${id}`)
        const userInDB = await this.sql
            `SELECT u_id, email FROM Users WHERE u_id=${id} `;
        return userInDB[0];
    }
    
    private async insertUserToDB(user: User): Promise<void>{
        this.insert(user)
    }

}

class UserListError extends Error {
    type: UserListErrorType

    constructor(msg: string, type: UserListErrorType) {
        super(msg);
        this.type = type;
    }


}


export enum UserListErrorType {
    INVALID_FIELDS,

    LIST_FULL,
    USER_REGISTERED,

}