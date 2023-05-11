import Vec2 from "../math/Vec2";
import Color from "../math/Color";
import Rect from "../math/Rect";
export class VertexDataFill
{
    public  vert:Vec2;
    public  color:Color;
    constructor(vert:Vec2,color:Color)
    {
        this.vert =vert;
        this.color =color;
    }

}

export default class FillBatch {
    public vertexData: Array<VertexDataFill> = []
    public indices: Array<number> = []

    private indicesPos: number = 0


    constructor() {


    }

    addTriangle(p1: Vec2, p2: Vec2, p3: Vec2, color: Color) {

        this.vertexData.push(new VertexDataFill(p1, color), new VertexDataFill(p2, color), new VertexDataFill(p3, color));
        this.indices.push(this.indicesPos, this.indicesPos + 1, this.indicesPos + 2);
        this.indicesPos += 3;

    }

    addRect(rect: Rect, color: Color) {
        if(rect.size.x<0)return;
        rect.round()
        this.vertexData.push(new VertexDataFill(rect.getTopLeft(), color), new VertexDataFill(rect.getTopRight(), color), new VertexDataFill(rect.getBottomRight(), color), new VertexDataFill(rect.getBottomLeft(), color));
        this.indices.push(this.indicesPos, this.indicesPos + 1, this.indicesPos + 2);
        this.indices.push(this.indicesPos, this.indicesPos + 2, this.indicesPos + 3);
        this.indicesPos += 4;
    }


    clear() {
        this.vertexData = [];
        this.indices = [];
        this.indicesPos = 0;
    }
}
