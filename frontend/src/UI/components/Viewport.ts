import Panel, {PanelSettings} from "./Panel";
import UI_IC from "../UI_IC";

import UIRenderTexture from "../draw/UIRenderTexture";
import {TextureSettings} from "./internal/Texture";
import UI_I from "../UI_I";
import Vec2 from "../math/Vec2";


export class ViewportSettings extends PanelSettings {
    constructor() {
        super();
        this.box.paddingLeft = 0
        this.box.paddingRight = 0
        this.box.paddingBottom = 0
    }
}

export default class Viewport extends Panel {

    public renderSize: Vec2 = new Vec2(1, 1)
    private texture: UIRenderTexture;
    private textureSettings: TextureSettings;
    private fill: boolean =true;

    constructor(id: number, label: string, settings: ViewportSettings) {
        super(id, label, settings);
        this.texture = new UIRenderTexture()
        this.textureSettings = new TextureSettings()
        this.textureSettings.box.marginTop = 0;
        this.textureSettings.setSizeToHeight =false;
        this.renderSize = this.size.clone()

        //start collapsed...
       /* this._collapsed = true;
        this.prevSize.copy(this.size)
        if(this.prevSize.y<100)this.prevSize.y=300;
        this.size.y = 22;*/
    }

    setSubComponents() {
        if (!this.isDockedInPanel) super.setSubComponents();

        if (this.collapsed) return;
        if (UI_IC.settingsButton("LSset")) {

            let pos =this.layoutRect.pos.clone()
            pos.x+=this.layoutRect.size.x/2-150;
            pos.y+=this.layoutRect.size.y/2-100;
            UI_IC.viewportPopUp(this,pos)
        }
        UI_IC.texture("t", this.texture, this.textureSettings)

    }

    setIsDockedInPanel(value: boolean) {

        super.setIsDockedInPanel(value)
      /*  if (value) {
            this.textureSettings.box.marginTop = 0
        } else {
            this.textureSettings.box.marginTop = 20
        }*/
    }

    startRender() {
        let sX = this.layoutRect.size.x;
        let sY =this.layoutRect.size.y;
        if(!this.fill){

            let ratio =1.5
            let sX = this.layoutRect.size.x
            let sY =this.layoutRect.size.x*ratio
        }

        this.renderSize.set(sX, sY)
        if (this.texture.setSize(sX,sY)) this.setDirty();
        this.texture.bind()
    }

    stopRender() {
        this.texture.unBind()
        let gl = UI_I.renderer.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    }
}
