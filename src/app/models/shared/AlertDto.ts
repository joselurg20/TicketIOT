export class AlertsDto {
    id: string = "";
    type: AlertType = AlertType.Info;
    message: string = "";
    autoClose: boolean = true;
    keepAfterRouteChange?: boolean = false;
    fade: boolean = false;
    clearAfterMilliseconds: number | undefined = undefined;
    color: string = "green";

    constructor(init?: Partial<AlertsDto>) {
        Object.assign(this, init);
    }
}


export enum AlertType {
    Success,
    Error,
    Info,
    Warning
}