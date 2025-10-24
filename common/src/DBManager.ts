import postgres from 'postgres'

export abstract class DBManager {

    sql: postgres.Sql;
    table: string = '';
    columns: string[] = [];

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
    

}