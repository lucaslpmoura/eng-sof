import { Entity } from './Entity.js';
import { EntityType } from './EntityType.js';

import { encryptPassword } from './Encryption.js';

export class User extends Entity{
    
    username: string;
    email: string;
    password: string;

    isAdmin: boolean = false;

    sqlColumns: string[] = ['u_id','createdtime','e_type','username','email','pword', 'isadmin'];

    constructor(username: string, email: string, password: string) {
        super(EntityType.USER);
        this.username = username;
        this.email = email;
        this.password = encryptPassword(password);
    }

    public toSchema() : any {
        return {
            'u_id': this.id,
            'createdtime': this.createdTime,
            'e_type': this.type,
            'username': this.username,
            'email': this.email,
            'pword': this.password,
            'isadmin': this.isAdmin
        }
    }

    public static fromSchema(schema: any) : User {
        let user =  new User(
            schema.username, schema.email, ''
        );
        user.id = schema.u_id;
        user.createdTime = schema.createdtime;
        user.isAdmin = schema.isadmin;

        return user;
    }
}