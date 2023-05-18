import LComponent, {LComponentSettings} from "./LComponent";
import UI_IC from "../UI_IC";
import Color from "../math/Color";

import {ColorButtonSettings} from "./internal/ColorButton";
import {ColorPickerPopupSettings} from "./internal/popUps/ColorPickerPopUp";
import UI_I from "../UI_I";
import DirtyButton from "./internal/DirtyButton";


export class LColorSettings extends LComponentSettings {
    constructor() {
        super();
        this.canCopyToClipBoard = true;
    }
}

export default class LColor extends LComponent {
    public color: Color
    public colorStart: Color = new Color()
    private colorButtonSettings: ColorButtonSettings;
    private popUpSettings: ColorPickerPopupSettings;

    constructor(id: number, label: string, color: Color, settings: LColorSettings) {

        super(id, label, settings);
        this.color = color;
        this.colorStart.copy(this.color);
        this.colorButtonSettings = new ColorButtonSettings();
        this.colorButtonSettings.box.marginLeft = 4;

        this.popUpSettings = new ColorPickerPopupSettings()

    }

    setSubComponents() {
        super.setSubComponents();


        if (UI_IC.colorButton("cb", this.color, this.colorButtonSettings)) {
            let x = this.layoutRect.pos.x + this.settings.box.paddingLeft
            let y = this.layoutRect.pos.y;
            if (UI_I.screenSize.y / 2 < this.layoutRect.pos.y) {
                this.popUpSettings.box.marginTop = this.layoutRect.pos.y - this.popUpSettings.box.size.y;
            } else {
                this.popUpSettings.box.marginTop = this.layoutRect.pos.y + 20;
            }
            this.popUpSettings.box.marginLeft = this.layoutRect.pos.x + this.settings.box.paddingLeft;
            let offset = this.popUpSettings.box.marginLeft + this.popUpSettings.box.size.x - UI_I.screenSize.x;
            if (offset > 0) {
                this.popUpSettings.box.marginLeft -= offset
            }


            UI_IC.colorPickerPopUp(this, this.popUpSettings);
        }

        if (UI_IC.dirtyButton("LSdb")) {
            this.color.copy(this.colorStart)
            this.setDirty()
            this.setValueDirty(false)
        }
        let btn = UI_I.currentComponent as DirtyButton
        btn.setValueDirty(this.valueDirty);
        UI_I.popComponent();
    }

    getReturnValue(): Color {
        return this.color;
    }

    getClipboardValue(): string {
        return this.color.r + "," + this.color.g + "," + this.color.b + "," + this.color.a;
    }

}
