import { Methods } from "./Methods";
import { Headers, intoRecord } from "./Headers";

export default class Request {
    url: string;
    method: Methods;
    header: Headers;
    body: any;
    unsecure: boolean

    constructor(url: string, method: Methods, header: Headers, body: any | undefined, unsecure: boolean) {
        this.url = url;
        this.method = method;
        this.header = header;
        this.body = body;
        this.unsecure = unsecure;
    }

    async send() {
        const method = this.method.toLowerCase();

        let result;

        switch(method) {
            case 'get':
                result = await this.sendGet();
                break;
            case 'post':
                result = await this.sendPost();
                break;
            case 'put': 
                result = await this.sendPut();
                break;
            case 'delete': 
                result = await this.sendDelete();
                break;
        }

        return result;
    }

    private async sendPost(): Promise<Response> {
        if(!this.body)
            throw new Error("Body cannot be empty on post");
        
        const response = await fetch(this.url, {
            method: 'POST',
            headers: intoRecord(this.header),
            body: JSON.stringify(this.body),
        });
        
        return response;
    }

    private async sendGet(): Promise<Response> {
        const response = await fetch(this.url);

        return response;
    }

    private async sendPut(): Promise<Response> {
        const response = await fetch(this.url, {
            method: 'PUT',
            headers: intoRecord(this.header),
            body: this.MapBody(),
        });

        return await response;
    }

    private async sendDelete(): Promise<Response> {
        const response = await fetch(this.url, {
            method: 'DELETE'
        })

        return response;
    }

    private MapBody(): any {
        let body: any;

        switch(this.header) {
            case Headers.JSON: 
                body = JSON.stringify(this.body);
                break;
            case Headers.URL_ENCODED:
                if(this.body)
                    body = this.body.toString()
                break;
            default:
                body = JSON.stringify(this.body);
                break;
        }
        
        return body;
    }
}