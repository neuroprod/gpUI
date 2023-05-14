import Component, {ComponentSettings} from "../Component";
import Color from "../../math/Color";
import Utils from "../../math/Utils";
import UI_I from "../../UI_I";
import Vec2 from "../../math/Vec2";
import Rect from "../../math/Rect";
import Font from "../../draw/Font";
import {SliderType} from "./SliderBase";




export class DragBaseSettings extends ComponentSettings {


    colorBack = new Color().setHex("#4c4c4c", 1);
    labelColor =new  Color().gray(0.8)

    constructor() {
        super();
        this.hasBackground = true
        this.backgroundColor.setHex("#2d2d2d", 1)
    }

}

export default class DragBase extends Component  {
    value: number;

    private textMaxWidth: number;
    private textPos: Vec2 = new Vec2();



    private isDragging: boolean = false;

    private ref: any;
    private objName: string;
    private type: SliderType;
    private changed: boolean =false;
    private label: string;
    private startMouseX: number;

    constructor(id: number,  ref: any, objName: string, type: SliderType, settings: DragBaseSettings) {
        super(id, settings);

        this.ref = ref;
        this.objName = objName;

        this.value = ref[objName];

        this.type = type;




    }


    onAdded() {
        super.onAdded();
        if (this.value != this.ref [this.objName]) {
            console.log("reset",this.value,this.ref [this.objName])
            this.value = this.ref [this.objName];
            this.setDirty()
        }
    }

    updateMouse() {






        if (this.isDown) {
            if (this.isDownThisFrame) {


                this.startMouseX = UI_I.mouseListener.mousePos.x
                this.isDragging = true;
            }
        } else {
            this.isDragging = false;
        }
    }

    updateOnMouseDown() {
        if (this.isDragging) {

            let valueChange = (UI_I.mouseListener.mousePos.x - this.startMouseX)
            if(valueChange==0) return;
            this.startMouseX = UI_I.mouseListener.mousePos.x;


            this.value+=Math.pow(valueChange,1)*0.01;//*Math.sign(valueChange);
            this.ref [this.objName] = this.value;

            this.changed =true;
            this.setDirty(true);
        }
    }


    layoutRelative() {
        super.layoutRelative()
        let settings =this.settings
        if(settings.box.size.x==-1) this.size.x = Utils.getMaxInnerWidth(this.parent) -settings.box.marginLeft-settings.box.marginRight;
        if(settings.box.size.y==-1) this.size.y = Utils.getMaxInnerHeight(this.parent) -settings.box.marginTop-settings.box.marginBottom;

    }

    layoutAbsolute() {
        super.layoutAbsolute();

        this.textMaxWidth = this.layoutRect.size.x
        this.textPos.copy(this.layoutRect.pos)



        if (this.type == SliderType.INT) {
            this.label = this.value+"";
        } else {
            this.label = Number.parseFloat(String(this.value)).toFixed(2)+""
        }



        this.textPos.x += Utils.getCenterPlace(Font.charSize.x*this.label.length, this.layoutRect.size.x);
        this.textPos.y += Utils.getCenterPlace(Font.charSize.y, this.layoutRect.size.y)
    }

    prepDraw() {
        super.prepDraw()
        let settings = this.settings as DragBaseSettings


        if(this.isOver || this.isDown){
            UI_I.currentDrawBatch.fillBatch.addRect(this.layoutRect,settings.colorBack)
        }



        UI_I.currentDrawBatch.textBatch.addLine(this.textPos, this.label, this.textMaxWidth, settings.labelColor);

    }


    showSettings(): void {
        console.log("implement settings popup")
    }
    getReturnValue(): boolean {
        let change =this.changed
        this.changed =false
        return change

    }

}
