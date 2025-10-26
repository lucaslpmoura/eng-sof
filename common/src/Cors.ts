export class Cors {
    public static setCors(req: any, res: any, next: any){
        res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', '*');

        next();
    }
}