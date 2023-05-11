import LComponent, {LComponentSettings} from "./LComponent";
import UI_IC from "../UI_IC";
import {IDirtyButtonComponent} from "./internal/DirtyButton";
import {CheckBoxSettings} from "./internal/CheckBox";


export class LBooleanSettings extends LComponentSettings
{

}
export default class LBoolean extends LComponent implements IDirtyButtonComponent
{
    private ref:any;
    private value:boolean;
    private checkBoxSettings: CheckBoxSettings;
    private valueOld: boolean;
    private labelCheck: string;
    constructor(id:number, label:string,value:boolean|null, ref:any,settings:LBooleanSettings) {

        super(id,"",settings);
        this.labelCheck =label;
        if(ref==null)
        {
            this.value =value;
        }
        else {
            this.value =ref[label]
        }
        this.valueOld =this.value;
        this.ref =ref;
        this.checkBoxSettings=new CheckBoxSettings();
        this.checkBoxSettings.box.marginLeft =4;
    }
    setSubComponents() {
        super.setSubComponents();



       UI_IC.checkBox(  this.labelCheck,this,"value",this.checkBoxSettings)


        UI_IC.dirtyButton("LSdb",this);
    }

    getReturnValue(): boolean {
        return this.value
    }

    isValueDirty(): boolean {
        let dirt = this.value !=this.valueOld;
        if( this.ref)
        {
          this.ref[ this.labelCheck]= this.value ;
        }

        return dirt;
    }

    reset(): void {

        this.value =this.valueOld;
        if(this.ref){
            this.ref[ this.labelCheck]=this.value;
        }
        this.setDirty()
    }

    setValueDirty(val:boolean)
    {

    }


}
