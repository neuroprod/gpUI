import VerticalLayout, {VerticalLayoutSettings} from "./VerticalLayout";
import UI_I from "../UI_I";
import Component, {ComponentSettings} from "./Component";
import UI from "../UI";
import Utils from "../math/Utils";
import UI_IC from "../UI_IC";



export class GroupSettings extends ComponentSettings {
    constructor() {
        super();
        this.box.marginTop= 3;
        this.box.marginBottom = 0;
        this.box.marginLeft = UI_I.globalStyle.compIndent

    }

}

export default class Group extends Component {


    private container: Component;

    private label: string;
    private verticalLSettings: VerticalLayoutSettings;

    constructor(id: number, label: string, settings: GroupSettings) {
        super(id, settings);
        this.drawChildren = true;
        this.label = label;

        this.size.set(20,20)
        this.verticalLSettings = new VerticalLayoutSettings()
        this.verticalLSettings.needScrollBar = false;
        this.verticalLSettings.hasOwnDrawBatch = false;
        this.verticalLSettings.box.marginTop = 21;
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


        UI_IC.dirtyButton("LSdb");
        UI_I.popComponent()


        UI.pushVerticalLayout("l",  this.verticalLSettings)
        this.container = UI_I.currentComponent

        this.container.drawChildren =open;



    }

    onPopComponent() {
        UI_I.popComponent(false)
    }



}
