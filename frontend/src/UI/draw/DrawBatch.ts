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
    public parent:DrawBatch|null =null;
    public children =[];
    public id: number;
    public clipRect!: Rect|null;
    public needsClipping: boolean=false ;

    private _isVisible: boolean =true;
    useThisFrame: boolean=true;

    constructor(id:number,clipRect:Rect|null=null) {
        this.id = id;
        this.clipRect = clipRect;
    }
    get isVisible(): boolean {
        return this._isVisible;
    }

    set isVisible(value: boolean) {
        this._isVisible = value;
    }
    removeFromParent()
    {
        this.parent.removeChild(this)

    }
    removeChild(drawBatch:DrawBatch)
    {
       for( let i=0;i<this.children.length;i++)
       {
           if(this.children[i]==drawBatch)
           {
               this.children.splice(i,1);
               break;
           }
       }
        drawBatch.fillBatch.clear();
        drawBatch.textBatch.clear();
        drawBatch.textureBatch.clear()
        drawBatch.parent =null;
    }
    addChild(drawBatch)
    {
        if(drawBatch.parent)
        {
            drawBatch.removeFromParent()
        }
        drawBatch.parent =this;
        this.children.push(drawBatch);
        this.isDirty =true
    }
    addChildAt(drawBatch: DrawBatch,index) {
        if(drawBatch.parent)
        {
            drawBatch.removeFromParent()
        }
        drawBatch.parent =this;
        this.isDirty =true
        this.children.splice(index, 0, drawBatch);
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
        if(!this.isVisible){
            return;
        };
       /* if(!this.useThisFrame){
            return;
        };
        this.useThisFrame =false*/
        if(this.clipRect){

            array.push(this);
        }

        for(let child of this.children)
        {
            child.collectBatches(array);
        }

    }



}
