export class BaseThread {
    private readonly color: string = "#8b0000";
    private readonly id: string;

    constructor(threadID: string) {
        this.id = threadID;
    }

    public getColor = ():string => this.color;

    public getThreadID = (): string => this.id;
}
