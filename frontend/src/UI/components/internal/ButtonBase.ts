import Component, {ComponentSettings} from "../Component";
import Color from "../../math/Color";
import UI_I from "../../UI_I";
import Utils from "../../math/Utils";
import Vec2 from "../../math/Vec2";
import Font from "../../draw/Font";



export class ButtonBaseSettings extends ComponentSettings {

    constructor() {
        super();

    }
    public backColor:Color =new Color().setHex("#5e5e5e",1);
    public overColor:Color =new Color().setHex("#999999",1);
    public downColor:Color =new Color().setHex("#8b826d",1);
    public labelColor:Color =new Color().setHex("#ffffff",1);

}

export default class ButtonBase extends Component
{
    private label: string;
    private textPos: Vec2;
    private textMaxSize: number;

    constructor(id: number,label:string, settings: ButtonBaseSettings) {
        super(id, settings);

        this.size.copy(settings.box.size);
        this.label=label;
    }

    layoutRelative() {
        super.layoutRelative();
        let settings= this.settings as ButtonBaseSettings
        if(settings.box.size.x==-1) this.size.x = Utils.getMaxInnerWidth(this.parent) -settings.box.marginLeft-settings.box.marginRight;
        if(settings.box.size.y==-1) this.size.y = Utils.getMaxInnerHeight(this.parent) -settings.box.marginTop-settings.box.marginBottom;
    }

    layoutAbsolute() {
        super.layoutAbsolute();

        this.textPos = this.layoutRect.pos.clone();
        this.textPos.copy(this.layoutRect.pos)
        this.textPos.x += 5;
        this.textPos.y += Utils.getCenterPlace(Font.charSize.y, this.layoutRect.size.y)
        this.textMaxSize=this.layoutRect.size.x -10;
    }

    prepDraw() {
        if(this.layoutRect.size.x<0)return;
        super.prepDraw()

        let settings= this.settings as ButtonBaseSettings

        let color;
        if (this.isDown) {
            color =settings.downColor;
        } else if (this.isOver) {
            color = settings.overColor;
        } else {
            color = settings.backColor;

        }

        UI_I.currentDrawBatch.fillBatch.addRect(this.layoutRect, color);
        UI_I.currentDrawBatch.textBatch.addLine(this.textPos,this.label ,this.textMaxSize,settings.labelColor)


    }
    getReturnValue() {
        return this.isClicked
    }


}
