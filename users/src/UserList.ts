import { User } from "./User";


export class UserList {
    list: User[];
    maxSize: number = parseInt(process.env.MAX_USERS) || 10;


    constructor() {
        this.list = [];
    }

    registerUser(userData: any) {
        let newUser = this.createUser(userData);
        this.addUser(newUser);
    }

    private createUser(userData: any) : User {
        if (!userData.email) {
            throw new RegisterUserError('User email missing. ', RegisterUserErrorType.FIELDS_MISSING);
        }
        if (!userData.username) {
            throw new RegisterUserError('Username missing.', RegisterUserErrorType.FIELDS_MISSING);
        }
        if (!userData.password) {
            throw new RegisterUserError('User password missing.', RegisterUserErrorType.FIELDS_MISSING);
        }

        if(typeof userData.email != 'string' || !userData.email.includes('@')){
            throw new RegisterUserError('User email is invalid.', RegisterUserErrorType.INVALID_FIELDS);
        }

        if(typeof userData.username != 'string' || /^[A-Za-z0-9]*$/.test(userData.username)){
            throw new RegisterUserError('Invalid username.', RegisterUserErrorType.INVALID_FIELDS);
        }

        return new User(userData.email, userData.username, userData.password);
    }

    private addUser(user: User): void {
        if(this.list.length >= this.maxSize){
            throw new RegisterUserError('Maximum number of users reached.', RegisterUserErrorType.LIST_FULL);
        }
        if(this.isUserRegistered(user)){
            throw new RegisterUserError('User with this email is already Registered.', RegisterUserErrorType.USER_REGISTERED);
        }

        this.list.push(user);
    }

    private isUserRegistered(user: User): boolean {
        for(let oldUser of this.list){
            if(oldUser.email == user.email){
                return true;
            }
        }
        
        return false;
    }

}

class RegisterUserError extends Error {
    type: RegisterUserErrorType

    constructor(msg: string, type: RegisterUserErrorType) {
        super(msg);
        this.type = type;
    }


}


export enum RegisterUserErrorType {
    FIELDS_MISSING,
    INVALID_FIELDS,

    LIST_FULL,
    USER_REGISTERED
}