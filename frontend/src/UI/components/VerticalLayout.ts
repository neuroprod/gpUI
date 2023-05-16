import Component, {ComponentSettings} from "./Component";
import UI_I from "../UI_I";
import Rect from "../math/Rect";
import Color from "../math/Color";
import Utils from "../math/Utils";


export class VerticalLayoutSettings extends ComponentSettings {
    scrollBarWidth = 8;
    scrollbarMargin = 2;
    scrollBarColor = new Color().setHex("#6f6f6f", 1);
    hasOwnDrawBatch =true;
    needScrollBar =true;
    constructor() {
        super();

    }
}

export default class VerticalLayout extends Component {
    private hasScrollBar: boolean = false;
    private childrenHeight: number = 0
    private scrollBarRect: Rect = new Rect();
    private isDraggingScroll: boolean;
    private downPosY: number;
    private scrollBarOffset =0;
    private scrollBarStartY =0;
    private scrollBarY =0;
    public needScrollBar =true;

    constructor(id: number, settings: VerticalLayoutSettings) {
        super(id, settings);
        this.needsChildrenSortingByRenderOrder = true;
        this.hasOwnDrawBatch = settings.hasOwnDrawBatch;
        this.needScrollBar = settings.needScrollBar;
    }

    updateCursor(comp) {
        this.placeCursor.y += +comp.settings.box.marginTop + comp.size.y + comp.settings.box.marginBottom;
    }

    needsResize(): boolean {


        if (this.size.y < this.placeCursor.y) {

            if(this.needScrollBar) {
                this.hasScrollBar = true;
                this.childrenHeight = this.placeCursor.y
                let settings = this.settings as VerticalLayoutSettings;
                this.settings.box.paddingRight = settings.scrollBarWidth + settings.scrollbarMargin
            }else{
                this.size.y =this.placeCursor.y
            }

            return true;

        }
        if (this.size.y > this.placeCursor.y) {
            this.size.y =this.placeCursor.y;

        }

        this.scrollOffset.y =0;
        this.hasScrollBar = false;

        return false;
    }
    updateMouse()
    {
      /* if(!this.hasScrollBar)return;


        if (this.isDown) {
            if (this.isDownThisFrame) {
                if (this.scrollBarRect.contains(UI_I.mouseListener.mousePos)) {
                    this.isDraggingScroll = true;
                    this.downPosY =UI_I.mouseListener.mousePos.y
                }
            }
        } else if(  this.isDraggingScroll) {
            this.isDraggingScroll = false;
            this.scrollBarStartY+=this.scrollBarOffset;
            this.scrollBarOffset =0

        }*/
    }
    onMouseDown() {

        if(!this.hasScrollBar)return;
        if (this.scrollBarRect.contains(UI_I.mouseListener.mousePos)) {
            this.isDraggingScroll = true;
            this.downPosY =UI_I.mouseListener.mousePos.y
        }
    }
    onMouseUp() {

        this.isDraggingScroll = false;
        this.scrollBarStartY+=this.scrollBarOffset;
        this.scrollBarOffset =0
        console.log("onUp")
    }
    updateOnMouseDown()
    {
        if (this.isDraggingScroll) {


            this.scrollBarOffset = UI_I.mouseListener.mousePos.y-this.downPosY;
            this.scrollBarY =this.scrollBarStartY+this.scrollBarOffset
            this.scrollBarY =Math.max(0,this.scrollBarY)

            let scrollRange =this.layoutRect.size.y-this.scrollBarRect.size.y;
            this.scrollBarY =Math.min(scrollRange,this.scrollBarY)
            let scrollRel =this.scrollBarY/scrollRange;


            this.scrollOffset.y =-scrollRel*( this.childrenHeight-this.layoutRect.size.y);

            this.setDirty(true);
        }
    }
    layoutRelative() {
        this.settings.box.paddingRight = 0//reset box padding
        let maxWidth =Utils.getMaxInnerWidth(this.parent) -this.settings.box.marginLeft-this.settings.box.marginRight;
        let maxHeight = Utils.getMaxInnerHeight(this.parent)-this.settings.box.marginTop-this.settings.box.marginBottom;

        this.size.x = maxWidth;
        this.size.y = maxHeight;


    }

    layoutAbsolute() {
        super.layoutAbsolute();
        if (!this.hasScrollBar) return;

        let settings = this.settings as VerticalLayoutSettings;
        this.scrollBarRect.copyPos(this.layoutRect.pos);

        this.scrollBarRect.pos.y+=this.scrollBarY;
        this.scrollBarRect.pos.x += this.layoutRect.size.x - settings.scrollBarWidth

        let sbh = (this.layoutRect.size.y / this.childrenHeight) * this.layoutRect.size.y

        this.scrollBarRect.setSize(settings.scrollBarWidth, sbh)
    }

    prepDraw() {
        super.prepDraw()

        if (!this.hasScrollBar) return
        UI_I.currentDrawBatch.needsClipping =true;
        let settings = this.settings as VerticalLayoutSettings;
        UI_I.currentDrawBatch.fillBatch.addRect(this.scrollBarRect, settings.scrollBarColor);

    }


}
