interface coordinates {
    x: number;
    y: number;
}

interface size {
    height: number;
    width: number;
}

export abstract class BaseNote
{
    create_at: number;
    content: string;
    id: string;
    position: coordinates;
    sizes: size;

    protected constructor(content: string, x_coordinate: number, y_coordinate: number, height: number, width: number);
    protected constructor(content: string, x_coordinate: number, y_coordinate: number, height: number, width: number, id: string, createdAt: number);
    protected constructor(content: string, x_coordinate: number, y_coordinate: number, height: number, width: number, id?: string, createdAt?: number) {
        this.create_at = createdAt || Date.now();
        this.content = content ;
        this.id = id || `${this.create_at}` + `${Math.random().toString(36).substring(2,9)}`;
        this.position = {x: x_coordinate, y: y_coordinate};
        this.sizes = {height: height, width: width};
    }


    changeCoordinate(x_coordinate:number, y_coordinate:number): void {
        this.position.x = x_coordinate;
        this.position.y = y_coordinate;
    }

    abstract updateContent: (newContent: string) => void;
}
