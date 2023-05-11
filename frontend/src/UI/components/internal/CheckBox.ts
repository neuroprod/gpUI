import Component, {ComponentSettings} from "../Component";
import Color from "../../math/Color";
import Vec2 from "../../math/Vec2";
import UI_I from "../../UI_I";
import Rect from "../../math/Rect";
import Utils from "../../math/Utils";
import {ButtonBaseSettings} from "./ButtonBase";
import Font from "../../draw/Font";


export class CheckBoxSettings extends ComponentSettings
{
    constructor() {
        super();


    }
    public labelColor: Color = new Color().setHex("#bfbfbf", 1);
    public colorRect:Color =new Color().setHex("#5e5e5e",1);

}
export default class CheckBox extends Component
{

    private label: string;

    private value: boolean;

    private ref: any;
    private property: string;

    private checkPos:Vec2 =new Vec2();
    private checkRect:Rect =new Rect();
    private textPos:Vec2 =new Vec2();
    private maxTextSize: number;
    constructor(id: number,label:string, ref:any,property:string, settings: CheckBoxSettings) {

        super(id, settings);

        this.label =label;

        this.value = ref[property] as boolean
        this.ref =ref;
        this.property = property;




    }
    updateMouse()
    {

        if(this.isClicked)
        {
            this.value =!this.value;
            this.ref[this.property] =this.value;

        }
    }
    layoutRelative() {
        super.layoutRelative();

        if(this.ref[this.property]!=this.value)
        {
            this.value =this.ref[this.property];
        }

        let settings= this.settings as ButtonBaseSettings
        if(settings.box.size.x==-1) this.size.x = Utils.getMaxInnerWidth(this.parent) -settings.box.marginLeft-settings.box.marginRight;
        if(settings.box.size.y==-1) this.size.y = Utils.getMaxInnerHeight(this.parent) -settings.box.marginTop-settings.box.marginRight;
        let ts =Font.getTextSize(this.label).x+20+5;
        if(this.size.x>  ts){
            this.size.x =ts
        }
    }

    layoutAbsolute() {


      //  let settings =this.settings as CheckBoxSettings

        this.checkRect.copy( this.layoutRect);
        this.checkRect.size.x=20;
        this.checkPos.copy(this.layoutRect.pos);

         let s = Utils.getCenterPlace(Font.iconSize.y,20)
        this.checkPos.x+=s;
        this.checkPos.y+=s;
        this.textPos.x =this.layoutRect.pos.x + 20+5;
        this.textPos.y =  this.layoutRect.pos.y+Utils.getCenterPlace(Font.charSize.y,20)
        this.maxTextSize  =this.layoutRect.size.x -20-5;

    }

    prepDraw() {
       let settings =this.settings as CheckBoxSettings
        if(this.value)
        {
            UI_I.currentDrawBatch.textBatch.addIcon( this.checkPos,0,settings.labelColor)
        }

        UI_I.currentDrawBatch.fillBatch.addRect( this.checkRect,  settings.colorRect);
        UI_I.currentDrawBatch.textBatch.addLine(this.textPos,this.label,this.maxTextSize,settings.labelColor)

    }
    getReturnValue(): boolean{
        return this.value;
    }
}
