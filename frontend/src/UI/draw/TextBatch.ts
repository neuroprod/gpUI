import Vec2 from "../math/Vec2";
import Color from "../math/Color";
import Rect from "../math/Rect";
import Font, {Char} from "./Font";


export class VertexDataText
{
    public  vert:Vec2;
    public  color:Color;
    public uv: Vec2;
    constructor(vert:Vec2,uv:Vec2,color:Color)
    {
        this.vert =vert;
        this.uv =uv;
        this.color =color;
    }

}
export default class TextBatch
{
    public vertexData: Array<VertexDataText> = []
    public indices: Array<number> = []

    private indicesPos: number = 0
    constructor() {

    }
    addIcon(pos: Vec2, id:number, color: Color) {
        pos.round()
        let rect:Rect=new Rect(pos, Font.iconSize);
        let  char =Font.icons[id];
        this.addChar(rect, char, color)


    }

    addLine(pos: Vec2, text: string,maxSize:number, color: Color) {

        let startPos = pos.clone();
        startPos.round()
        let maxChars = Math.floor(maxSize/Font.charSize.x);
       if(maxChars<1) return;
        let cutText =false;
        if(text.length>maxChars )
        {
            cutText =true;
            let clipLength = maxChars-1;
            if(text.at(clipLength-1)==" ")
            {
                clipLength--;
            }
            text =text.slice(0,clipLength)
        }

        let rect = new Rect(startPos, Font.charSize);
        for (let i = 0; i < text.length; i++) {
            let c = text.charCodeAt(i);
            if (c > 127) continue;
            c-=32;
            let char = Font.chars[c];
            this.addChar(rect, char, color);
            startPos.x += Font.charSize.x;
            rect.pos = startPos.clone();
        }
        if( cutText ){
            let char = Font.chars[127-32];
            this.addChar(rect, char, color);
        }
    }

    addChar(rect:Rect, char:Char, color) {

        let vertData1 = new VertexDataText( rect.getTopLeft(),char.uv0,color)
        let vertData2 =  new VertexDataText( rect.getTopRight(),char.uv1,color)
        let vertData3 =  new VertexDataText(  rect.getBottomRight(),char.uv2,color)
        let vertData4 =  new VertexDataText( rect.getBottomLeft(),char.uv3,color)

        this.vertexData.push(vertData1, vertData2, vertData3, vertData4);
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
