import postgres from 'postgres'

export abstract class DBManager {

    sql: postgres.Sql;
    table: string = '';


    constructor() {
        this.sql = postgres({
            host: 'localhost',
            port: 5432,
            database: 'mydb',
            username: 'postgres',
            password: 'ietec',
        });
    }

    async fetchAll() {
        const result = await this.sql`SELECT * FROM ${this.table}`;
        return result;
    }

    async fetch(key: string, value: any){
        const result = await this.sql`SELECT * FROM WHERE ${key}=${value}`;
        return result;
    }

    async insert(data: any){
        const result = await this.sql`INSERT INTO ${this.table} (${Object.keys(data).toString()}) VALUES (${Object.values(data).toString()})`;
        return result;
    }

    async size(){

        const result = await this.sql`SELECT COUNT(*) FROM ${this.table}`
        console.log('Size: ')
        console.log(result);
        return result[0].count;
    }
    

}