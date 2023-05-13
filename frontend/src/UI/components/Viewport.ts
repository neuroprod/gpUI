




import Panel, {PanelSettings} from "./Panel";



export class ViewportSettings extends PanelSettings {

}

export default class Viewport extends Panel{


    constructor(id: number, label: string, settings: ViewportSettings) {
        super(id, label ,settings);

    }


    startRender() {
       // UI_I.renderer.gl.viewport(100,100,100,100)
    }
    stopRender() {

    }
}
