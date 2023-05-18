import PopUp, {PopUpSettings} from "./PopUp";

import UI_I from "../../../UI_I";
import UI_IC from "../../../UI_IC";


import LSlider from "../../LSlider";
import Vec2 from "../../../math/Vec2";
import {LNumberSettings} from "../../LNumber";
import {ComponentSettings} from "../../Component";

export class SliderPopUpSettings extends PopUpSettings {
constructor() {
    super();
    this.box.size.set(300,200);
    this.box.setPadding(10)
}

}

export default class SliderPopUpPopUp extends PopUp {
    private slider: LSlider;
    private lFloatSettings: LNumberSettings;
    private hCompSettings: ComponentSettings;



    constructor(id:number,slider:LSlider,pos:Vec2,settings:SliderPopUpSettings) {
        super(id, settings);
        this.posOffset.copy(pos);
        this.slider =slider;
       // this.size.set(targetWidth,Math.min(itemSize*items.length,maxSize));

        this.hCompSettings =new ComponentSettings()
        this.hCompSettings.box.size.y =20;

        this.lFloatSettings =new LNumberSettings();
        this.lFloatSettings.box.paddingLeft=52;
        this.lFloatSettings.box.size.x=100;
        this.lFloatSettings.showSettings =false;
        this.lFloatSettings.showDirty =false;


        //this.box.paddingLeft = UI_I.globalStyle.getLabelSize()
       // this.box.marginLeft
    }
    setSubComponents() {
        super.setSubComponents();
        UI_IC.pushVerticalLayout("v");

            UI_IC.pushComponent("min",this.hCompSettings)
                let min = UI_IC.LFloat("min",this.slider.min,this.lFloatSettings);
            UI_I.popComponent();

        let max = UI_IC.LFloat("max",this.slider.max,this.lFloatSettings);

        UI_I.popComponent();
    }
}
