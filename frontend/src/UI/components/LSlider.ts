import LComponent, {LComponentSettings} from "./LComponent";

import UI_IC from "../UI_IC";
import UI_I from "../UI_I";
import DirtyButton from "./internal/DirtyButton";
import {NumberType} from "../UI_Types";
import UI_Vars from "../UI_Vars";

export class LSliderSettings extends LComponentSettings {
    constructor() {
        super();
        this.canCopyToClipBoard = true;
    }
}

export default class LSlider extends LComponent {
    private value: number;
    private stringRef: string;
    private ref: any;
    min: number;
    max: number;

    private type: NumberType;
    private valueOld: number;
    private floatPrecision: number;

    constructor(id: number, label: string, value: number | null, ref: any, settings: LSliderSettings, min?: number, max?: number, type: NumberType= NumberType.FLOAT) {

        super(id, label, settings);
        this.value = value;
        this.stringRef = label;
        this.ref = ref;


        this.type = type
        if(this.type ==NumberType.FLOAT)
        {
            this.floatPrecision=UI_Vars.floatPrecision;
        }else{
            this.floatPrecision =0;
        }


        if (this.ref) {
            this.value = this.ref[this.stringRef]
        }
        this.min = min != undefined ? min : this.value - 1;
       this.max = max != undefined ? max : this.value + 1;
        this.valueOld = this.value;


    }

    onAdded() {
        if (this.ref) {
            this.value = this.ref[this.stringRef]
        }
    }

    setSubComponents() {
        super.setSubComponents();
        if (UI_IC.sliderBase("LSsl", null, this, "value", this.min, this.max, this.type)) {
            if (this.valueOld != this.value) {
                this.setValueDirty(true)
            } else {
                this.setValueDirty(false)
            }
            if (this.ref) {
                this.ref[this.stringRef] = this.value
            }
        }
        if (UI_IC.dirtyButton("LSdb")) {
            this.value = this.valueOld;
            if (this.ref) {
                this.ref[this.stringRef] = this.value
            }
            this.setDirty()
            this.setValueDirty(false)

        }
        let btn = UI_I.currentComponent as DirtyButton
        btn.setValueDirty(this.valueDirty);
        UI_I.popComponent();
        if (UI_IC.settingsButton("LSset")) {

            let popPos = this.layoutRect.pos.clone();
            popPos.x+=this.layoutRect.size.x
            popPos.x-=300;//popupsize
            UI_IC.sliderPopUp(this,popPos);

        }
    }

    getReturnValue(): number {
        return this.value;
    }

    getClipboardValue(): string {
        return this.value.toPrecision(this.floatPrecision) + "";
    }

}
