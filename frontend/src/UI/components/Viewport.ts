




import Panel, {PanelSettings} from "./Panel";
import UI_IC from "../UI_IC";
import UI from "../UI";
import UIRenderTexture from "../draw/UIRenderTexture";
import {TextureSettings} from "./internal/Texture";
import UI_I from "../UI_I";



export class ViewportSettings extends PanelSettings {
constructor() {
    super();
    this.box.paddingLeft=0
    this.box.paddingRight=0
    this.box.paddingBottom=20
}
}

export default class Viewport extends Panel{

    private texture
    private textureSettings: TextureSettings;
    constructor(id: number, label: string, settings: ViewportSettings) {
        super(id, label ,settings);
        this.texture =new UIRenderTexture()
        this.textureSettings =new TextureSettings()
        this.textureSettings.box.marginTop=20;

    }
    setSubComponents() {
        super.setSubComponents();
        if(this.collapsed)return;
        if(UI_IC.settingsButton("LSset"))
        {
            console.log("showSettings")
        }
        UI_IC.texture("t",this.texture,this.textureSettings)

    }

    startRender() {
       // UI_I.renderer.gl.viewport(100,100,100,100)
        if(this.texture.setSize(this.layoutRect.size.x,this.layoutRect.size.y-20))this.setDirty();
       this.texture.bind()
    }
    stopRender() {
      this.texture.unBind()
        let gl = UI_I.renderer.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    }
}
