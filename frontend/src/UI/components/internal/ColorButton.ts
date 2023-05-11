import Color from "../../math/Color";
import UI_I from "../../UI_I";
import Utils from "../../math/Utils";
import Vec2 from "../../math/Vec2";

import Component, {ComponentSettings} from "../Component";
import Rect from "../../math/Rect";
import UITexture from "../../draw/UITexture";
import TexturePool from "../../draw/TexturePool";


export class ColorButtonSettings extends ComponentSettings {



    constructor() {
        super();

    }
}

export default class ColorButton extends Component {
    public colorNoAlpha: Color = new Color();
    private color: Color;
    private alphaRect = new Rect();
    private alphaGridTexture: UITexture;

    constructor(id: number, color: Color, settings: ColorButtonSettings) {
        super(id, settings);

        this.size.copy(settings.box.size);
        this.color = color;
        this.alphaGridTexture =TexturePool.getStatic("alphaGrid");
    }

    layoutRelative() {
        super.layoutRelative();
        let settings = this.settings as ColorButtonSettings
        if (settings.box.size.x < 0){
            this.size.x = Utils.getMaxInnerWidth(this.parent) *settings.box.size.x*-1- settings.box.marginLeft - settings.box.marginRight;

        }
        if (settings.box.size.y < 0){
            this.size.y = Utils.getMaxInnerHeight(this.parent) *settings.box.size.y*-1- settings.box.marginTop - settings.box.marginBottom;
        }
    }

    layoutAbsolute() {
        super.layoutAbsolute();

        this.alphaRect.copy(this.layoutRect)
        this.alphaRect.size.x /= 2;
        this.alphaRect.pos.x += this.alphaRect.size.x;
    }

    prepDraw() {
        if (this.layoutRect.size.x < 0) return;
        super.prepDraw()


        if (this.color.a != 1) {
            this.colorNoAlpha.copy(this.color)
            this.colorNoAlpha.a = 1.0;
            UI_I.currentDrawBatch.fillBatch.addRect(this.layoutRect, this.colorNoAlpha);
            UI_I.currentDrawBatch.textureBatch.addTexture(this.alphaRect, this.alphaGridTexture, 1 - this.color.a, this.alphaRect.size.clone().scale(1 / 20));
        } else {
            UI_I.currentDrawBatch.fillBatch.addRect(this.layoutRect, this.color);
        }


    }

    getReturnValue() {
        return this.isClicked
    }


}
