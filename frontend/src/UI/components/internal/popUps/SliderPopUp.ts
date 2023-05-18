
import UI_I from "../../../UI_I";
import UI_IC from "../../../UI_IC";
import LSlider from "../../LSlider";
import Vec2 from "../../../math/Vec2";
import {LNumberSettings} from "../../LNumber";
import {ComponentSettings} from "../../Component";
import {ButtonBaseSettings} from "../ButtonBase";
import {HAlign} from "../../../UI_Types";
import PopUpWindow, {PopUpWindowSettings} from "./PopUpWindow";

export class SliderPopUpSettings extends PopUpWindowSettings {
    constructor() {
        super();
        this.box.size.set(300, 200);

    }

}

export default class SliderPopUpPopUp extends PopUpWindow {
    private slider: LSlider;
    private lFloatSettings: LNumberSettings;
    private hCompSettings: ComponentSettings;
    private btnSettings: ButtonBaseSettings;
    private btnOkSettings: ButtonBaseSettings;
    private btnCancelSettings: ButtonBaseSettings;
    private min: number;
    private max: number;
    private value: number;
    private hCompBtnSettings: ComponentSettings;


    constructor(id: number, slider: LSlider, pos: Vec2, settings: SliderPopUpSettings) {
        super(id,"Slider Settings", settings);
        this.posOffset.copy(pos);
        this.slider = slider;


        this.hCompSettings = new ComponentSettings()
        this.hCompSettings.box.size.y = 23;
        this.hCompSettings.hasBackground =true;
        this.hCompSettings.backgroundColor.setHex("#403f3e",1)
        this.lFloatSettings = new LNumberSettings();
        this.lFloatSettings.box.paddingLeft = 7 * 7;
        this.lFloatSettings.box.size.x = 180;
        this.lFloatSettings.showSettings = false;
        this.lFloatSettings.showDirty = false;

        this.btnSettings = new ButtonBaseSettings()
        this.btnSettings.box.size.x = 90;
        this.btnSettings.box.marginLeft = 185;
        this.btnSettings.box.marginTop = 1.5;
        this.btnSettings.box.marginBottom = 1.5;

        this.hCompBtnSettings = new ComponentSettings()
        this.hCompBtnSettings.box.size.y = 23;
        this.hCompBtnSettings.box.marginTop =20
        this.btnOkSettings = new ButtonBaseSettings()
        this.btnOkSettings.box.size.x = 95;
        this.btnOkSettings.box.hAlign =HAlign.RIGHT
        this.btnOkSettings.box.marginTop = 1.5;
        this.btnOkSettings.box.marginBottom = 1.5;

        this.btnCancelSettings = new ButtonBaseSettings()
        this.btnCancelSettings.box.size.x = 95;
        this.btnCancelSettings.box.hAlign =HAlign.RIGHT
        this.btnCancelSettings.box.marginRight = 100;
        this.btnCancelSettings.box.marginTop = 1.5;
        this.btnCancelSettings.box.marginBottom = 1.5;


        this.min = this.slider.min;
        this.max = this.slider.max;
        this.value = this.slider.value;
        //this.box.paddingLeft = UI_I.globalStyle.getLabelSize()
        // this.box.marginLeft
    }

    setSubComponents() {
        super.setSubComponents();
        UI_IC.pushVerticalLayout("v");

        UI_IC.pushComponent("min", this.hCompSettings)
        UI_IC.LFloat(this, "min", this.lFloatSettings);
        if (UI_IC.buttonBase("set Current", this.btnSettings)) {
            this.min = this.value
        }
        UI_I.popComponent();

        UI_IC.pushComponent("max", this.hCompSettings)
        UI_IC.LFloat(this, "max", this.lFloatSettings);
        if (UI_IC.buttonBase("set Current", this.btnSettings)) {
            this.max = this.value
        }
        UI_I.popComponent();

        UI_IC.pushComponent("ok", this.hCompBtnSettings)
        if(UI_IC.buttonBase("Cancel", this.btnCancelSettings))
        {
           // this.keepAlive =false;
            UI_I.removePopup(this);
        }

        if(UI_IC.buttonBase("OK", this.btnOkSettings))
        {
            this.slider.setMinMax(this.min,this.max)
            UI_I.removePopup(this);
        }
        UI_I.popComponent();
        UI_I.popComponent();

    }
}
