import Component, {ComponentSettings} from "../../Component";
import UI_I from "../../../UI_I";
import Color from "../../../math/Color";

import Utils from "../../../math/Utils";
import Rect from "../../../math/Rect";

export class PopUpSettings extends ComponentSettings {
    popUpBackground = new Color().setHex("#2d2d2d", 1)
    outlineColor: Color = new Color().setHex("#575757", 1)

}

export default class PopUp extends Component {


    constructor(id: number, settings: PopUpSettings) {

        super(id, settings);
        this.size.copy(this.settings.box.size)
        this.hasOwnDrawBatch = true;
        this.keepAlive = true;

    }


    prepDraw() {
        let settings = this.settings as PopUpSettings
        let r =new Rect()
        r.copy(this.layoutRect)
        r.pos.x+=5
        r.pos.y+=5
        UI_I.currentDrawBatch.fillBatch.addRect(r, new Color(0,0,0,0.1));
        Utils.drawOutlineRect(this.layoutRect, settings.outlineColor)
        UI_I.currentDrawBatch.fillBatch.addRect(this.layoutRect, settings.popUpBackground);


    }

}
