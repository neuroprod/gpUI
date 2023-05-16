import Component, {ComponentSettings} from "../Component";
import Color from "../../math/Color";
import Utils from "../../math/Utils";
import UI_I from "../../UI_I";
import Vec2 from "../../math/Vec2";
import Rect from "../../math/Rect";
import Font from "../../draw/Font";



export enum SliderType {
    FLOAT,
    INT
}


export class SliderBaseSettings extends ComponentSettings {


    barColor = new Color().setHex("#65625e", 1);
    labelColor = Color.white.clone();

    constructor() {
        super();
        this.hasBackground = true
        this.backgroundColor.setHex("#2d2d2d", 1)
    }

}

export default class SliderBase extends Component  {
    value: number;
    private startValue: number;
    private textMaxWidth: number;
    private textPos: Vec2 = new Vec2();
    private barRect: Rect = new Rect();
    private min: number;
    private max: number;
    private valueNorm: number;
    private isDragging: boolean = false;
    private isRef: boolean = false;
    private ref: any;
    private objName: string;
    private type: SliderType;
    private changed: boolean =false;

    constructor(id: number, value: number, ref: any, objName: string, min: number, max: number, type: SliderType, settings: SliderBaseSettings) {
        super(id, settings);
        this.size.set(20, 20);
        this.ref = ref;
        this.objName = objName;
        if (value) {
            this.value = value;
            this.startValue = value;
        } else {
            this.value = ref[objName];
            this.startValue = this.value;
            this.isRef = true;
        }
        this.type = type;


        this.min = min != undefined ? min : value - 1;
        this.max = max != undefined ? max : value + 1;

        this.updateValue();

    }


    updateValue() {

        if (this.type == SliderType.INT) {
            this.value = Math.round(this.value)
            this.startValue = Math.round(this.value)
        }

        if (this.value < this.min) this.min = this.value;
        if (this.value > this.max) this.max = this.value;

        if (this.type == SliderType.INT) {
            this.min = Math.round(this.min)
            this.max = Math.round(this.max)
        }


        this.valueNorm = (this.value - this.min) / (this.max - this.min)
        this.setDirty();
    }

    updateMouse() {
        if (this.isRef) {

            if (this.value != this.ref [this.objName]) {
                this.value = this.ref [this.objName]
                this.startValue = this.value;
                this.updateValue()
            }
        }


        if (this.isDown) {
            if (this.isDownThisFrame) {
                this.isDragging = true;
            }
        } else {
            this.isDragging = false;
        }
    }

    updateOnMouseDown() {
        if (this.isDragging) {

            this.valueNorm = (UI_I.mouseListener.mousePos.x - this.layoutRect.pos.x) / this.layoutRect.size.x
            this.valueNorm = Math.max(Math.min(this.valueNorm, 1), 0);
            this.value = (this.valueNorm * (this.max - this.min)) + this.min;
            if (this.type == SliderType.INT) {
                this.value = Math.round(this.value);
                this.valueNorm = (this.value - this.min) / (this.max - this.min);
            }

            if (this.isRef) {
                this.ref [this.objName] = this.value;
            }
            this.changed =true;
            this.setDirty(true);
        }
    }


    layoutRelative() {
        super.layoutRelative()
        let maxWidth = Utils.getMaxInnerWidth(this.parent);
        this.size.x = maxWidth - 4 - 20;
        this.posOffset.x = 4
    }

    layoutAbsolute() {
        super.layoutAbsolute();
        this.barRect.copy(this.layoutRect);
        this.barRect.size.x = this.valueNorm * this.layoutRect.size.x;
        this.textMaxWidth = this.layoutRect.size.x
        this.textPos.copy(this.layoutRect.pos)
        this.textPos.x += 5;
        this.textPos.y += Utils.getCenterPlace(Font.charSize.y, this.layoutRect.size.y)
    }

    prepDraw() {
        super.prepDraw()
        let settings = this.settings as SliderBaseSettings

        UI_I.currentDrawBatch.fillBatch.addRect(this.barRect, settings.barColor);

        let label = ""
        if (this.type == SliderType.INT) {
            label += this.value;
        } else {
            label += Number.parseFloat(String(this.value)).toFixed(4)
        }


        UI_I.currentDrawBatch.textBatch.addLine(this.textPos, label, this.textMaxWidth, settings.labelColor);

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
