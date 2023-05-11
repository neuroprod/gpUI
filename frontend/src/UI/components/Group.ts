import VerticalLayout, {VerticalLayoutSettings} from "./VerticalLayout";
import UI_I from "../UI_I";
import Rect from "../math/Rect";
import Component, {ComponentSettings} from "./Component";
import UI from "../UI";
import Utils from "../math/Utils";
import UI_IC from "../UI_IC";
import {IDirtyButtonComponent} from "./internal/DirtyButton";


export class GroupSettings extends ComponentSettings {
    constructor() {
        super();
        this.box.marginTop= 3;
        this.box.marginBottom = 0;
        this.box.marginLeft = UI_I.globalStyle.compIndent

    }

}

export default class Group extends Component implements IDirtyButtonComponent {

    private topBarRect = new Rect()
    private container: Component;
    private childrenDirty: boolean = false;
    private label: string;

    constructor(id: number, label: string, settings: GroupSettings) {
        super(id, settings);
        this.drawChildren = true;
        this.label = label;
    }


    updateCursor(comp) {
        if (comp instanceof Group || comp instanceof VerticalLayout) {
            this.placeCursor.y += +comp.settings.box.marginTop + comp.size.y + comp.settings.box.marginBottom;
        } else {
            this.placeCursor.y = 0;
        }
    }

    needsResize(): boolean {

        if (this.size.y < this.placeCursor.y) {
            this.size.y = this.placeCursor.y
        }
        if (this.size.y > this.placeCursor.y) {
            this.size.y = this.placeCursor.y;

        }

        return false;
    }

    layoutRelative() {
        super.layoutRelative();
        let settings = this.settings;
        if (settings.box.size.x == -1) this.size.x = Utils.getMaxInnerWidth(this.parent) - settings.box.marginLeft - settings.box.marginRight;
        if (settings.box.size.y == -1) this.size.y = Utils.getMaxInnerHeight(this.parent) - settings.box.marginTop - settings.box.marginRight;
    }


    setSubComponents() {
        super.setSubComponents();
        let open =UI_IC.groupTitle(this.label, true);


        UI_IC.dirtyButton("LSdb", this);
        let s = new VerticalLayoutSettings()
        s.needScrollBar = false;
        s.hasOwnDrawBatch = false;
        s.box.marginTop = 21;
        UI.pushVerticalLayout("l", s)
        this.container = UI_I.currentComponent
        if(open != this.container.drawChildren)
        {
            this.container.drawChildren =open;
            this.setDirty()
        }

    }

    onPopComponent() {
        UI_I.popComponent(false)
    }

    isValueDirty(): boolean {
        return this.childrenDirty;
    }

    setValueDirty(val: boolean) {

        this.childrenDirty = val;
    }

    reset(): void {

    }

}
