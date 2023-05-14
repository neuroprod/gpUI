import Component, {ComponentSettings} from "./Component";
import UI_I from "../UI_I";
import Color from "../math/Color";
import Font from "../draw/Font";
import Vec2 from "../math/Vec2";
import Utils from "../math/Utils";


export class LComponentSettings extends ComponentSettings {

    public labelColor: Color = new Color().setHex("#bfbfbf", 1);
    public labelPaddingRight = 8;
    public labelPaddingLeft = 10;
    constructor() {
        super();
        this.box.marginTop = 1.5;
        this.box.marginBottom = 1.5;

        this.box.paddingLeft = UI_I.globalStyle.getLabelSize()
        this.box.marginLeft =UI_I.globalStyle.compIndent
        this.box.size.set(-1,20)
    }
}

export default class LComponent extends Component {
    protected label: string;

    private maxLabelWidth: number;
    private labelPos = new Vec2();
    valueDirty: boolean =false;



    constructor(id: number, label: string, settings: LComponentSettings) {
        super(id, settings);
        this.label = label;
        this.size.copy(settings.box.size)//size X is set later

    }

    layoutRelative() {
        super.layoutRelative()
        let settings= this.settings as LComponentSettings
        if(settings.box.size.x==-1) this.size.x = Utils.getMaxInnerWidth(this.parent) -settings.box.marginLeft-settings.box.marginRight;
        if(settings.box.size.y==-1) this.size.y = Utils.getMaxInnerHeight(this.parent) -settings.box.marginTop-settings.box.marginRight;

    }

    layoutAbsolute() {
        if(!this.label.length) return

        let settings = this.settings as LComponentSettings
        let textSize = Font.getTextSize(this.label);

        this.maxLabelWidth = settings.box.paddingLeft- settings.labelPaddingRight-settings.labelPaddingLeft;
        let labelLength = Math.min(textSize.x, this.maxLabelWidth)

        this.labelPos.copy(this.layoutRect.pos)
       this.labelPos.x += settings.box.paddingLeft - labelLength - settings.labelPaddingRight; //align right
        this.labelPos.y += Math.floor(Utils.getCenterPlace(textSize.y,settings.box.size.y))

    }

    prepDraw() {
        super.prepDraw()
        if(!this.label.length) return

        let settings = this. settings as LComponentSettings
        UI_I.currentDrawBatch.textBatch.addLine(this.labelPos, this.label, this.maxLabelWidth, settings.labelColor);

    }
    setValueDirty(val:boolean) {

        if (val == this.valueDirty) return
        this.valueDirty =val;
        //propagate
    }
}
