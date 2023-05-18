import Component, {ComponentSettings} from "../Component";
import Color from "../../math/Color";
import UI_I from "../../UI_I";
import Utils from "../../math/Utils";
import Vec2 from "../../math/Vec2";
import Font from "../../draw/Font";
import UITexture from "../../draw/UITexture";
import Rect from "../../math/Rect";



export class TextureSettings extends ComponentSettings {

    constructor() {
        super();
        this.backgroundColor.gray(0.16);
        this.hasBackground =true;
    }


}

export default class Texture extends Component
{
    private texture: UITexture;


    private textureRect =new Rect()

    constructor(id: number,texture:UITexture, settings: TextureSettings) {
        super(id, settings);
        this.texture =texture
        this.size.copy(settings.box.size);
        this.alwaysPassMouse =true;
    }

    layoutRelative() {
        super.layoutRelative();
        let settings= this.settings as TextureSettings
        if(settings.box.size.x==-1) this.size.x = Utils.getMaxInnerWidth(this.parent) -settings.box.marginLeft-settings.box.marginRight;
        if(settings.box.size.y==-1) this.size.y = Utils.getMaxInnerHeight(this.parent) -settings.box.marginTop-settings.box.marginRight;

        let textureWidth =Math.min(this.texture.width, this.size.x);
        let textureHeight = Math.max(textureWidth*this.texture.getRatio(),20)

        this.size.y =textureHeight;

        this.textureRect.size.set(textureWidth,textureHeight)

    }

    layoutAbsolute() {
        super.layoutAbsolute();

        this.textureRect.pos.copy(this.layoutRect.pos)
        this.textureRect.pos.x+=(this.layoutRect.size.x -this.textureRect.size.x)/2;
    }

    prepDraw() {
        super.prepDraw()
       UI_I.currentDrawBatch.textureBatch.addTexture(this.textureRect,this.texture)


    }
    getReturnValue() {
        return this.isClicked
    }


}
