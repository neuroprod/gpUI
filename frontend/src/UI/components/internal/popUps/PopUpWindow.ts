import PopUp, {PopUpSettings} from "./PopUp";
import Color from "../../../math/Color";
import UI_I from "../../../UI_I";
import Font from "../../../draw/Font";
import Rect from "../../../math/Rect";
import Vec2 from "../../../math/Vec2";

export class PopUpWindowSettings extends PopUpSettings {

    public labelColor: Color = new Color().setHex("#d8d8d8", 1)
    public topBarColor: Color = new Color().setHex("#2b2927", 1)
    public topBarHeight = 22;

    constructor() {
        super();
        this.box.setPadding(10)
        this.box.paddingTop = 10 + 22;
        this.popUpBackground.setHex("#403f3e", 1)
    }
}

export default class PopUpWindow extends PopUp {

    private topBarRect: Rect=new Rect();
    private labelPos: Vec2 =new Vec2();
    private label: string;


    constructor(id: number,label:string, settings: PopUpWindowSettings) {
        super(id, settings);
        this.label =label;
    }

    layoutAbsolute() {

        super.layoutAbsolute();
        let settings = this.settings as PopUpWindowSettings
        this.topBarRect.copyPos(this.layoutRect.pos);
        this.topBarRect.setSize(this.layoutRect.size.x, settings.topBarHeight);

        this.labelPos.set(this.posAbsolute.x + settings.box.paddingLeft + 5 , this.posAbsolute.y + settings.topBarHeight / 2 - Font.charSize.y / 2 )





    }
    prepDraw() {
        super.prepDraw()
        let settings = this.settings as PopUpWindowSettings
        UI_I.currentDrawBatch.fillBatch.addRect(this.topBarRect, settings.topBarColor);
        UI_I.currentDrawBatch.textBatch.addLine(this.labelPos, this.label,1000, settings.labelColor);
    }
}
