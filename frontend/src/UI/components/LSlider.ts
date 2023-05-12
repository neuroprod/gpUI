import LComponent, {LComponentSettings} from "./LComponent";

import UI_IC from "../UI_IC";
import SliderBase, {SliderType} from "./internal/SliderBase";
import UI_I from "../UI_I";
import DirtyButton from "./internal/DirtyButton";

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

    private type: SliderType;
    private valueOld: number;
    constructor(id:number, label:string,value:number|null, ref:any,settings:LSliderSettings,min?: number, max?: number, type:SliderType =SliderType.FLOAT) {

        super(id,label,settings);
        this.value =value;
        this.stringRef=label;
        this.ref =ref;
        this.min =min;
        this.max =max;
        this.type =type

        if(this.ref)
        {
            this.value= this.ref[this.stringRef]
        }
        this.valueOld =this.value;


    }
    onAdded() {
        if(this.ref)
        {
            this.value= this.ref[this.stringRef]
        }
    }

    setSubComponents() {
        super.setSubComponents();
        if(UI_IC.sliderBase("LSsl",null,this, "value",this.min,this.max,this.type))
        {
            if(this.valueOld != this.value)
            {
                this.setValueDirty(true)
            }
            else
            {
                this.setValueDirty(false)
            }
            if(this.ref)
            {
                 this.ref[this.stringRef] =this.value
            }
        }
        if(UI_IC.dirtyButton("LSdb"))
        {
            this.value =this.valueOld;
            if(this.ref)
            {
                this.ref[this.stringRef] =this.value
            }
            this.setDirty()
            this.setValueDirty(false)
        }
        let btn =UI_I.currentComponent as DirtyButton
        btn.setValueDirty( this.valueDirty);
        UI_I.popComponent();
        if(UI_IC.settingsButton("LSset"))
        {
            console.log("showSettings")
        }
    }
    getReturnValue(): number {
        return this.value;
    }


}
