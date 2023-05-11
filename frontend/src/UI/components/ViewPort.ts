import {ComponentSettings} from "./Component";
import Vec2 from "../math/Vec2";
import UI_I from "../UI_I";
import Rect from "../math/Rect";
import Color from "../math/Color";
import VerticalLayout from "./VerticalLayout";
import Font from "../draw/Font";
import Panel, {PanelSettings} from "./Panel";

import UITexture from "../draw/UITexture";
import PanelSize from "../return/PanelSize";

export class ViewPortSettings extends PanelSettings {


    constructor() {
        super();

    }
}

export default class ViewPort extends Panel {

    private viewPortRect:Rect =new Rect;
    private panelSize:PanelSize =new PanelSize()
    private texture: UITexture;
    constructor(id: number, label: string,texture:UITexture, settings: ViewPortSettings) {
        super(id,label, settings);
        this.texture =texture;


    }





    layoutAbsolute() {
            super.layoutAbsolute()


        this.panelSize.width =this.layoutRect.size.x;
        this.panelSize.height =this.layoutRect.size.y-this.topBarRect.size.y;

        this.viewPortRect.size.set( this.panelSize.width, this.panelSize.height)
        this.viewPortRect.pos.set(this.layoutRect.pos.x,this.layoutRect.pos.y+this.topBarRect.size.y)

    }

    prepDraw() {

        UI_I.currentDrawBatch.fillBatch.addRect(this.topBarRect, this.localSettings.topBarColor);
        UI_I.currentDrawBatch.textBatch.addLine(this.labelPos, this.label,this.maxLabelSize, this.localSettings.labelColor);
        UI_I.currentDrawBatch.textureBatch.addTexture(this.viewPortRect,this.texture)
    }
    getReturnValue()
    {
        return this.panelSize;
    }
}
