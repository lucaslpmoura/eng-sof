
import {Entity} from '../../common/src/Entity';
import { EntityType } from '../../common/src/EntityType';

export class User extends Entity{
    
    username: string;
    email: string;
    password: string;

    constructor(username: string, email: string, password: string) {
        super(EntityType.USER);
        this.username = username;
        this.email = email;
        this.password = password;
        
    }
}