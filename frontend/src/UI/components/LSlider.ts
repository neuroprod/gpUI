import LComponent, {LComponentSettings} from "./LComponent";

import UI_IC from "../UI_IC";
import SliderBase, {SliderType} from "./internal/SliderBase";

export class LSliderSettings extends LComponentSettings
{

}
export default class LSlider extends LComponent
{
    private value: number;
    private stringRef: string;
    private ref: any;
    private min: number;
    private max: number;
    private baseSlider: SliderBase;
    private type: SliderType;
    constructor(id:number, label:string,value:number|null, ref:any,settings:LSliderSettings,min?: number, max?: number, type:SliderType =SliderType.FLOAT) {

        super(id,label,settings);
        this.value =value;
        this.stringRef=label;
        this.ref =ref;
        this.min =min;
        this.max =max;
        this.type =type

    }
    setSubComponents() {
        super.setSubComponents();
        this.baseSlider = UI_IC.sliderBase("LSsl",this.value,this.ref,this.stringRef,this.min,this.max,this.type)
        UI_IC.dirtyButton("LSdb",this.baseSlider);
        UI_IC.settingsButton("LSset",this.baseSlider);
    }
    getReturnValue(): number {
        return this.baseSlider.value;
    }
    destroy() {
        super.destroy();
        this.baseSlider=null;
    }


}
