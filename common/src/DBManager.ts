import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import postgres from 'postgres'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });



export abstract class DBManager {

    sql: postgres.Sql;
    table: string = '';
    columns: string[] = [];

    host: string = 'localhost';
    port: number = 5432;
    database: string = 'mydb';
    username: string = 'postgres';
    password:string  = 'postgres';


    constructor() {
        this.loadPostgresCredentials();

        this.sql = postgres({
            host: this.host,
            port: this.port,
            database: this.database,
            username: this.username,
            password: this.password
        });
    }

    async fetchAll() {
        const result = await this.sql`SELECT * FROM ${this.sql(this.table)}`;
        return result;
    }

    async fetch(key: string, value: any){
        const result = await this.sql`SELECT * FROM ${this.sql(this.table)} WHERE ${this.sql(key)}=${value}`;
        return result;
    }

    async insert(data: any){
        const result = await this.sql`INSERT INTO ${this.sql(this.table)} ${this.sql(data)}`;
        return result;
    }

    async delete(key: string, value: any){
        const result = await this.sql`DELETE FROM ${this.sql(this.table)} WHERE ${this.sql(key)}=${value}`;
        return result;
    }

    async size(){
        const result = await this.sql`SELECT COUNT(*) FROM ${this.sql(this.table)}`;
        return result[0].count;
    }
    
        private loadPostgresCredentials(){
        if(process.env.POSTGRES_HOST){
            this.host = process.env.POSTGRES_HOST;
        }
        if(process.env.POSTGRES_PORT){
            this.port = parseInt(process.env.POSTGRES_PORT);
        }
        if(process.env.POSTGRES_DATABASE){
            this.database = process.env.POSTGRES_DATABASE;
        }
        if(process.env.POSTGRES_USERNAME){
            this.username = process.env.POSTGRES_USERNAME;
        }
        if(process.env.POSTGRES_PASSWORD){
            this.password = process.env.POSTGRES_PASSWORD;
        }
    }
}