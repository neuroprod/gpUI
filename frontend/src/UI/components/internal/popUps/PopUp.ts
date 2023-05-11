import VerticalLayout from "../../VerticalLayout";
import Component, {ComponentSettings} from "../../Component";
import UI_I from "../../../UI_I";
import Color from "../../../math/Color";
import Vec2 from "../../../math/Vec2";
import Utils from "../../../math/Utils";

export class PopUpSettings extends ComponentSettings {
    popUpBackground = new Color().setHex("#262626", 1)
    outlineColor: Color = new Color().setHex("#FFFFFF", 0.05)


}

export default class PopUp extends Component {




    constructor(id:number,settings:PopUpSettings) {

        super(id,settings);
       this.size.copy(this.settings.box.size)
        this.hasOwnDrawBatch = true;
        this.keepAlive =true;

    }



    prepDraw() {
        let settings =this.settings as PopUpSettings
        Utils.drawOutlineRect(this.layoutRect,settings.outlineColor)
        UI_I.currentDrawBatch.fillBatch.addRect(this.layoutRect, settings.popUpBackground);


    }

}
