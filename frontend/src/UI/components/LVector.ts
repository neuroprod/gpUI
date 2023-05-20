import LComponent, {LComponentSettings} from "./LComponent";


import {UI_VEC2, UI_VEC3, UI_VEC4} from "../UI_Types";
import {NumberType, VectorType} from "../UI_Enums";
import UI_IC from "../UI_IC";
import UI_I from "../UI_I";
import DirtyButton from "./internal/DirtyButton";
import {DragBaseSettings} from "./internal/DragBase";
import {ComponentSettings} from "./Component";
import UI_Vars from "../UI_Vars";


export class LVectorSettings extends LComponentSettings {
    showDirty: boolean = true;
    showSettings: boolean = false;

    constructor() {
        super();
        this.canCopyToClipBoard = true;
    }
}

export default class LVector extends LComponent {
    private value: UI_VEC2 | UI_VEC3 | UI_VEC4;

    private type: VectorType


    private showDirty: boolean;
    private showSettings: boolean;
    private numBoxes: number;
    private x: number;
    private y: number;
    private z: number;
    private w: number;
    private posXSettings: DragBaseSettings;
    private posYSettings: DragBaseSettings;
    private posZSettings: DragBaseSettings;
    private posWSettings: DragBaseSettings;
    private holderSettings: ComponentSettings;
    private floatPrecision: number;

    constructor(id: number, label: string, value: UI_VEC2 | UI_VEC3 | UI_VEC4, settings: LVectorSettings) {


        super(id, label, settings);
        this.value = value;
        this.showDirty = settings.showDirty;
        this.showSettings = settings.showSettings
        this.floatPrecision = UI_Vars.floatPrecision;
        this.type = VectorType.VEC2;
        this.numBoxes = 2;

        this.x = value.x;
        this.y = value.y;


        if ((<UI_VEC3>this.value).z) {
            this.type = VectorType.VEC3;
            this.numBoxes = 3;
            this.z = (<UI_VEC3>this.value).z;
        }
        if ((<UI_VEC4>this.value).w) {
            this.type = VectorType.VEC4;
            this.numBoxes = 4;
            this.w = (<UI_VEC4>this.value).w;
        }

        let size = -1 / this.numBoxes
        let offsetSize = 1 / this.numBoxes

        this.holderSettings = new ComponentSettings()
        this.holderSettings.box.marginLeft = 4;

        this.posXSettings = new DragBaseSettings()
        this.posXSettings.box.size.x = size;
        this.posXSettings.box.marginRight = 1;
        this.posXSettings.posOffsetRelative.x = 0;

        this.posYSettings = new DragBaseSettings()
        this.posYSettings.box.size.x = size;
        this.posYSettings.box.marginRight = 1;
        if (this.type == VectorType.VEC2) this.posYSettings.box.marginRight = 0;
        this.posYSettings.box.marginLeft = 1;
        this.posYSettings.posOffsetRelative.x = offsetSize;

        this.posZSettings = new DragBaseSettings()
        this.posZSettings.box.size.x = size;
        this.posZSettings.box.marginRight = 1;
        if (this.type == VectorType.VEC3) this.posZSettings.box.marginRight = 0;
        this.posZSettings.box.marginLeft = 1;
        this.posZSettings.posOffsetRelative.x = offsetSize * 2;


        this.posWSettings = new DragBaseSettings()
        this.posWSettings.box.size.x = size;
        this.posWSettings.box.marginRight = 0;
        this.posWSettings.box.marginLeft = 1;
        this.posWSettings.posOffsetRelative.x = offsetSize * 3;

    }


    setSubComponents() {
        super.setSubComponents();

        UI_IC.pushComponent("holder", this.holderSettings)
        if (UI_IC.dragBase("x", this.value, "x", NumberType.FLOAT, this.posXSettings)) {

            if (this.x != this.value.x) {
                this.setValueDirty(true)
            } else {
                this.setValueDirty(false)
            }

        }

        if (UI_IC.dragBase("y", this.value, "y", NumberType.FLOAT, this.posYSettings)) {

            if (this.y != this.value.y) {
                this.setValueDirty(true)
            } else {
                this.setValueDirty(false)
            }

        }
        if (this.type > VectorType.VEC2) {
            if (UI_IC.dragBase("z", this.value, "z", NumberType.FLOAT, this.posZSettings)) {

                if (this.z != (this.value as UI_VEC3).z) {
                    this.setValueDirty(true)
                } else {
                    this.setValueDirty(false)
                }

            }

        }
        if (this.type > VectorType.VEC3) {
            if (UI_IC.dragBase("w", this.value, "w", NumberType.FLOAT, this.posWSettings)) {

                if (this.w != (this.value as UI_VEC4).w) {
                    this.setValueDirty(true)
                } else {
                    this.setValueDirty(false)
                }

            }

        }

        UI_I.popComponent()
        if (this.showDirty) {
            if (UI_IC.dirtyButton("LSdb")) {
                this.value.x = this.x;
                this.value.y = this.y;
                if (this.type > VectorType.VEC2) { // @ts-ignore
                    this.value.z = this.z;
                }
                if (this.type > VectorType.VEC3) { // @ts-ignore
                    this.value.w = this.w;
                }
                this.setDirty();
                this.setValueDirty(false);

            }
            let btn = UI_I.currentComponent as DirtyButton
            btn.setValueDirty(this.valueDirty);
            UI_I.popComponent();
        }
        /* if (this.showSettings) {
             if (UI_IC.settingsButton("LSset")) {
                 console.log("showSettings")
             }
         }*/
    }
   
    getReturnValue(): UI_VEC2 | UI_VEC3 | UI_VEC4 {
        return this.value;
    }

    getClipboardValue(): string {

        let ret = this.value.x.toFixed( this.floatPrecision ) + ",";
        ret += this.y.toFixed( this.floatPrecision );
        if (this.type > VectorType.VEC2) { // @ts-ignore
            ret += "," + this.z.toFixed( this.floatPrecision );
        }
        if (this.type > VectorType.VEC3) { // @ts-ignore
            ret += "," + this.w.toFixed( this.floatPrecision );
        }
        return ret;
    }

}
