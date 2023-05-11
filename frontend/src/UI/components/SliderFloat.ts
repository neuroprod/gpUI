import LabeledComponent, {LabeledComponentSettings} from "./labeledComponent";
import UI_I from "../UI_I";
import Color from "../math/Color";
import Vec2 from "../math/Vec2";
import Rect from "../math/Rect";


export class SliderFloatSettings extends LabeledComponentSettings{

    barColor =new Color().setHex("#2d2d2d",1)

    btnColor =new Color().setHex("#555555",1)
    constructor() {
        super();
        this.canBeDirty =true
    }
}

export default class SliderFloat extends LabeledComponent {
    private ref: any;
    private property: string;
    private min: number;
    private max: number;
    private value:number=0;
    private valueUI:number=0;
    private isDragging= false;
    private localSettings: SliderFloatSettings;
    private valueNorm:number;
    private btnRect =new Rect()
    private downPosX: number;
    private textPos =new Vec2()
    constructor(id:number,ref:any,property:string,min:number,max:number,settings:SliderFloatSettings) {

        super(id,property,settings);
        this.localSettings =settings;
        this.ref = ref;
        this.property =property;
        this.min =min;
        this.max =max;




        this.updateValue();
    }
    resetDirty()
    {
        this.valueUI =this.value
        this.ref[this.property] =  this.valueUI;
    }
    isThisDirty()
    {
        return    this.valueUI !=this.value
    }
    updateValue()
    {
        this.value = this.ref[this.property];
        if(this.value<this.min) this.min =this.value;
        if(this.value>this.max) this.max =this.value;
        this.valueUI =this.value;
        this.valueNorm = (this.value-this.min)/(this.max-this.min)
        this.setDirty();
    }
    updateMouse()
    {
        if( this.valueUI != this.ref[this.property]){
            this.updateValue()
        }


        if (this.isDown) {
            if (this.isDownThisFrame) {
                if (this.contentRect.contains(UI_I.mouseListener.mousePos)) {
                    this.isDragging = true;
                   this.downPosX =UI_I.mouseListener.mousePos.x
                }
            }
        } else {
            this.isDragging = false;
        }
    }
    updateOnMouseDown()
    {
        if (this.isDragging) {
            this.valueNorm =(UI_I.mouseListener.mousePos.x-this.contentRect.pos.x)/this.contentRect.size.x
            this.valueNorm =Math.max(Math.min( this.valueNorm,1),0);
            this.valueUI  = (this.valueNorm*(this.max-this.min)) +this.min;
            this.ref[this.property] =  this.valueUI;

            this.setDirty(true);
        }
    }


    layoutAbsolute()
    {
        super.layoutAbsolute()




        this.btnRect.copy(this.contentRect);
        this.btnRect.size.x*= this.valueNorm

        this.textPos.copy(this.contentRect.pos)
        this.textPos.add(new Vec2(4,4))
    }
    prepDraw() {
        super.prepDraw()


            UI_I.currentDrawBatch.fillBatch.addRect( this.contentRect, this.localSettings.barColor);



        UI_I.currentDrawBatch.fillBatch.addRect( this.btnRect, this.localSettings.btnColor);

        let v = Number.parseFloat(String(this.valueUI)).toFixed(4)

        UI_I.currentDrawBatch.textBatch.addLine(  this.textPos,   v+"",this.layoutRect.size.x, this.localSettings.labelColor);

        //value


        //label*/

    }
    getReturnValue() {
        return this.valueUI;
    }

}
