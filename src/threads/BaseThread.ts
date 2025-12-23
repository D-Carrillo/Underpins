export class BaseThread {
    private readonly destination: string;
    private readonly color: string = "#8b0000";

    constructor(destinationID: string) {
        this.destination = destinationID;
    }

    public getDestination = (): string => this.destination;

    public getColor = ():string => this.color;
}
