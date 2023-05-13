
import Panel, {PanelSettings} from "./Panel";
import {VerticalLayoutSettings} from "./VerticalLayout";
import UI from "../UI";
import UI_I from "../UI_I";


export class WindowSettings extends PanelSettings {

}

export default class WindowComp extends Panel{
    private contentVLSetting: VerticalLayoutSettings;


    constructor(id: number, label: string, settings: WindowSettings) {
        super(id, label ,settings);
        this.contentVLSetting =new VerticalLayoutSettings()
        this.contentVLSetting.box.marginTop=24;
    }
    setSubComponents() {
        super.setSubComponents()
        UI.pushVerticalLayout( "panelVert", this.contentVLSetting);

          UI_I.currentComponent.drawChildren =!this.collapsed
    }

}
