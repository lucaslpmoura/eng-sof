import { User } from "./User";


export class UserList {
    list: User[];
    maxSize: number = 10;


    constructor() {
        this.list = [];
    }

    registerUser(userData: any) {
        let newUser = this.createUser(userData);
        this.addUser(newUser);
    }

    private createUser(userData: any) : User {
        if(typeof userData.email != 'string' || !userData.email.includes('@')){
            throw new UserListError('User email is invalid.', UserListErrorType.INVALID_FIELDS);
        }

        if(typeof userData.username != 'string' || !/^[A-Za-z0-9]*$/.test(userData.username)){
            throw new UserListError('Invalid username.', UserListErrorType.INVALID_FIELDS);
        }

          if (typeof userData.password != 'string') {
            throw new UserListError('User password is invalid.', UserListErrorType.INVALID_FIELDS);
        }

        return new User(userData.email, userData.username, userData.password);
    }

    private addUser(user: User): void {
        if(this.list.length >= this.maxSize){
            throw new UserListError('Maximum number of users reached.', UserListErrorType.LIST_FULL);
        }
        if(this.isUserRegistered(user)){
            throw new UserListError('User with this email is already Registered.', UserListErrorType.USER_REGISTERED);
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