export class Cors {
    public static setCors(req: any, res: any, next: any){
        console.log("Cors accessed! Method: " + req.method);
        res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
		res.setHeader('Access-Control-Allow-Headers', '*');

        next();
    }
}