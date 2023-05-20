import LComponent, {LComponentSettings} from "./LComponent";

import UI_IC from "../UI_IC";
import UI_I from "../UI_I";
import DirtyButton from "./internal/DirtyButton";
import {NumberType} from "../UI_Enums";
import UI_Vars from "../UI_Vars";
import SliderBase, {SliderBaseSettings} from "./internal/SliderBase";
import Local from "../local/Local";

export class LSliderSettings extends LComponentSettings {
    constructor() {
        super();
        this.canCopyToClipBoard = true;
    }
}

export default class LSlider extends LComponent {
    value: number;
    private stringRef: string;
    private ref: any;
    min: number;
    max: number;

    private type: NumberType;
    private valueOld: number;
    private floatPrecision: number;
    private sliderBaseSettings: SliderBaseSettings;

    constructor(id: number, label: string, value: number | null, ref: any, settings: LSliderSettings, min?: number, max?: number, type: NumberType= NumberType.FLOAT) {

        super(id, label, settings);
        this.value = value;
        this.stringRef = label;
        this.ref = ref;


        this.type = type
        if (this.type == NumberType.FLOAT) {
            this.floatPrecision = UI_Vars.floatPrecision;
        } else {
            this.floatPrecision = 0;
        }


        if (this.ref) {
            this.value = this.ref[this.stringRef]
        }
        this.min = min != undefined ? min : this.value - 1;
        this.max = max != undefined ? max : this.value + 1;
        this.setFromLocal() ;

        if(this.max<this.value)this.max =this.value;
        if(this.min>this.value)this.min =this.value;

        this.valueOld = this.value;
        this.sliderBaseSettings = new SliderBaseSettings();
        this.sliderBaseSettings.min = this.min;
        this.sliderBaseSettings.max = this.max;
        this.sliderBaseSettings.type =this.type;
        this.sliderBaseSettings.floatPrecision= this.floatPrecision;
    }

    setFromLocal() {
        let data = Local.getItem(this.id);
        if (data) {
            this.min =data.min;
            this.max =data.max;
        }

    }

    saveToLocal() {

        let a = {
            min: this.min,
            max:this.max,
        };

        Local.setItem(this.id, a)
    }


    onAdded() {
        if (this.ref) {
            this.value = this.ref[this.stringRef]
        }
    }

    setSubComponents() {
        super.setSubComponents();
        if (UI_IC.sliderBase( this, "value",  this.sliderBaseSettings)) {
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
        return this.value.toFixed(this.floatPrecision) ;
    }

    setMinMax(min: number, max: number) {
        this.min=min;
        this.max =max;
        this.sliderBaseSettings.min =this.min;
        this.sliderBaseSettings.max=this.max;
        this.sliderBaseSettings.isDirty =true;
        this.saveToLocal();
        this.setDirty(true)
    }
}
