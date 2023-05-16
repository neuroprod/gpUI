




import Panel, {PanelSettings} from "./Panel";
import UI_IC from "../UI_IC";

import UIRenderTexture from "../draw/UIRenderTexture";
import {TextureSettings} from "./internal/Texture";
import UI_I from "../UI_I";
import Vec2 from "../math/Vec2";



export class ViewportSettings extends PanelSettings {
constructor() {
    super();
    this.box.paddingLeft=0
    this.box.paddingRight=0
    this.box.paddingBottom=0
}
}

export default class Viewport extends Panel{

    private texture:UIRenderTexture;
    private textureSettings: TextureSettings;
    public renderSize:Vec2 =new Vec2()

    constructor(id: number, label: string, settings: ViewportSettings) {
        super(id, label ,settings);
        this.texture =new UIRenderTexture()
        this.textureSettings =new TextureSettings()
        this.textureSettings.box.marginTop=20;

    }
    setSubComponents() {
        if(!this.isDockedInPanel) super.setSubComponents();

        if(this.collapsed)return;
        if(UI_IC.settingsButton("LSset"))
        {
            console.log("showSettings")
        }
        UI_IC.texture("t",this.texture,this.textureSettings)

    }
    setIsDockedInPanel(value: boolean) {

        super.setIsDockedInPanel(value)
        if (value) {
            this.textureSettings.box.marginTop = 0
        } else {
            this.textureSettings.box.marginTop= 20
        }
    }
    startRender() {
       // UI_I.renderer.gl.viewport(100,100,100,100)
        this.renderSize.set(this.layoutRect.size.x,this.layoutRect.size.y-20)
        if(this.texture.setSize(this.renderSize.x,this.renderSize.y))this.setDirty();
       this.texture.bind()
    }
    stopRender() {
      this.texture.unBind()
        let gl = UI_I.renderer.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    }
}
