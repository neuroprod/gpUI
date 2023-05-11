import FillBatch from "./FillBatch";
import Rect from "../math/Rect";
import TextBatch from "./TextBatch";
import TextureBatch from "./TextureBatch";

export default class DrawBatch
{
    public isDirty: boolean=false
    public fillBatch =new FillBatch()
    public textBatch =new TextBatch();
    public textureBatch =new TextureBatch();
    public parent =null;
    public children =[];
    public id: number;
    public clipRect!: Rect|null;
    needsClipping: boolean=false ;

    constructor(id:number,clipRect:Rect|null=null) {
        this.id = id;
        this.clipRect = clipRect;
    }



    addChild(drawBatch)
    {
        drawBatch.parent =this;
        this.children.push(drawBatch);
    }
    clear()
    {
        if(this.isDirty) {
            this.fillBatch.clear();
            this.textBatch.clear();
            this.textureBatch.clear()
        }
    }
    collectBatches(array:Array<DrawBatch>)
    {

        if(this.clipRect){

            array.push(this);
        }

        for(let child of this.children)
        {
            child.collectBatches(array);
        }

    }

}
