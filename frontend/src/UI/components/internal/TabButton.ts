import Component, {ComponentSettings} from "../Component";
import Color from "../../math/Color";
import UI_I from "../../UI_I";
import Utils from "../../math/Utils";
import Vec2 from "../../math/Vec2";
import Font from "../../draw/Font";



export class TabButtonSettings extends ComponentSettings {

    constructor() {
        super();
        this.box.marginTop =2;
        this.box.marginLeft =20;
        this.box.marginRight=50;
        this.box.size.set(-1,22-2)
        this.box.paddingRight =0
        this.box.paddingLeft =0
        this.box.paddingBottom =0
    }
    public selectedColor:Color =new Color().setHex("#383838", 1);
    public backColor:Color =new Color().setHex("#0a0a0a",1);
    public overColor:Color =new Color().setHex("#242424", 1);
    public downColor:Color =new Color().setHex("#363636",1);
    public labelColor:Color =new Color().setHex("#999999",1);
    public labelSelectedColor:Color =new Color().setHex("#ffffff",1);
}

export default class TabButton extends Component
{
    private label: string;
    private textPos: Vec2;
    private textMaxSize: number;
    index: number =0;
    private numItems: number=1;
    private selected: boolean;
    private tryDrag: boolean =false;
    release: boolean =false;
    private marginLeft: number;

    constructor(id: number,label:string, settings: TabButtonSettings) {
        super(id, settings);

        this.size.copy(settings.box.size);
        this.label=label;
    }
    onMouseDown() {


        this.tryDrag = true;

    }
    updateOnMouseDown() {
        super.updateOnMouseDown();

        if(UI_I.mouseListener.mousePosDown.distance(UI_I.mouseListener.mousePos)>15)
        {
            this.release =true;
        }

    }
    onMouseUp() {
         this.tryDrag = false;
    }

    setTabData(index:number,numItems:number,selected:boolean,marginLeft:number =20)
    {
        if(this.index == index && this.numItems==numItems && selected==this.selected && marginLeft==this.marginLeft)return;
        this.selected=selected;
        this.index =index;
        this.numItems =numItems;
        this.marginLeft =marginLeft;
        this.settings.box.marginLeft =this.marginLeft
        this.setDirty();

    }
    layoutRelative() {
        super.layoutRelative();
        let settings= this.settings as TabButtonSettings
        if(settings.box.size.y==-1) this.size.y = Utils.getMaxInnerHeight(this.parent) -settings.box.marginTop-settings.box.marginBottom;
        if(settings.box.size.x==-1){
            let totalSize = Utils.getMaxInnerWidth(this.parent) -settings.box.marginLeft-settings.box.marginRight;
            let width = totalSize/this.numItems;
            this.size.x =width - 2;

          this.posOffset.x =width*this.index;
        }
    }

    layoutAbsolute() {
        super.layoutAbsolute();

        this.textPos = this.layoutRect.pos.clone();
        this.textPos.copy(this.layoutRect.pos)
        this.textPos.x += 10;
        this.textPos.y += Utils.getCenterPlace(Font.charSize.y, this.layoutRect.size.y)
        this.textMaxSize=this.layoutRect.size.x -15;
    }

    prepDraw() {
        if(this.layoutRect.size.x<0)return;
        super.prepDraw()

        let settings= this.settings as TabButtonSettings

        let color;

       if( this.selected){
           color = settings.selectedColor;
       }else{
           if (this.isDown) {
               color =settings.downColor;
           } else if (this.isOver) {
               color = settings.overColor;
           } else {
               color = settings.backColor;

           }
       }



        UI_I.currentDrawBatch.fillBatch.addRect(this.layoutRect, color);

        UI_I.currentDrawBatch.textBatch.addLine(this.textPos,this.label ,this.textMaxSize,this.selected?settings.labelSelectedColor:settings.labelColor)


    }
    getReturnValue() {
        return this
    }


}
