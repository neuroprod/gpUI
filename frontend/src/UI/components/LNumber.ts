import LComponent, {LComponentSettings} from "./LComponent";

import UI_IC from "../UI_IC";
import  {SliderType} from "./internal/SliderBase";
import UI_I from "../UI_I";
import DirtyButton from "./internal/DirtyButton";
import {DragBaseSettings} from "./internal/DragBase";

export class LNumberSettings extends LComponentSettings
{

}
export default class LNumber extends LComponent
{
    private value: number;
    private stringRef: string;
    private ref: any;


    private type: SliderType;
    private valueOld: number;
    private dragSettings: DragBaseSettings;
    constructor(id:number, label:string,value:number|null, ref:any,settings:LNumberSettings, type:SliderType =SliderType.FLOAT) {


        super(id,label,settings);
        this.value =value;
        this.stringRef=label;
        this.ref =ref;

        this.type =type

        if(this.ref)
        {
            this.value= this.ref[this.stringRef]
        }
        this.valueOld =this.value;
        this.dragSettings =new DragBaseSettings()
        this.dragSettings.box.marginLeft =4;
        this.dragSettings.box.marginRight =20;

    }
    onAdded() {
        if(this.ref)
        {
            this.value= this.ref[this.stringRef]
        }
    }

    setSubComponents() {
        super.setSubComponents();
       if(UI_IC.dragBase("LSsl",this, "value",this.type,this.dragSettings))
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
