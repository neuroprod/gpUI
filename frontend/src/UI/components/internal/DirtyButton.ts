import Component, {ComponentSettings} from "../Component";
import Color from "../../math/Color";
import UI_I from "../../UI_I";


export interface IDirtyButtonComponent {

    reset: () => void
    isValueDirty:()=> boolean;
    setValueDirty:(val:boolean)=> void;
    parent:Component
}
export class DirtyButtonSettings extends ComponentSettings {
    public disabledColor:Color =new Color().setHex("#757474",1);
    public enabledColor:Color =new Color().setHex("#ff5f70",1);
    public overColor:Color =new Color().setHex("#d24755",1);

}

export default class DirtyButton extends Component
{
    private comp: IDirtyButtonComponent;

    private valueDirty: boolean;
    constructor(id: number, comp:IDirtyButtonComponent, settings: DirtyButtonSettings) {
        super(id, settings);
        this.size.set(4,20);
        this.comp =comp;

    }
    updateMouse()
    {

        if(this.isClicked)
        {
            this.comp.reset()
        }
    }
    layoutAbsolute() {
        super.layoutAbsolute();
        let valDirty  =this.comp.isValueDirty()

        if(valDirty != this.valueDirty){
            this.valueDirty = valDirty;
            this.comp.parent.setParentValueDirty(this.valueDirty )
        }
    }

    prepDraw() {

        let settings= this.settings as DirtyButtonSettings
        let color =settings.disabledColor;

        if(this.valueDirty)
        {

            if(this.isOver)
            {

                color =settings.overColor;
            }else
            {
                color =settings.enabledColor;
            }

        }

        UI_I.currentDrawBatch.fillBatch.addRect(this.layoutRect,color);


    }
    destroy() {
        super.destroy();
        this.comp=null;
    }



}
