import { Application, ApplicationExternalInterface, AppName, AppType } from "../types/TypeApp";

export abstract class ApplicationExternal implements Application, ApplicationExternalInterface {
    abstract readonly name: AppName;
    abstract readonly link: string;

    readonly type: AppType;
    
    constructor() {
        this.type = "external";
    }

    public open(): void {
        window.open(this.link);
    }
}