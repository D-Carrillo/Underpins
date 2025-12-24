export class BaseThread {
    private readonly color: string = "#8b0000";
    private readonly threadID: string;

    constructor(threadID: string) {
        this.threadID = threadID;
    }

    public getColor = ():string => this.color;

    public getThreadID = (): string => this.threadID;
}
