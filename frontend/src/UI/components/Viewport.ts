




import Panel, {PanelSettings} from "./Panel";
import UI_I from "../UI_I";


export class ViewportSettings extends PanelSettings {

}

export default class Viewport extends Panel{


    constructor(id: number, label: string, settings: ViewportSettings) {
        super(id, label ,settings);

    }


    startRender() {
        UI_I.renderer.gl.viewport(100,100,100,100)
    }
    stopRender() {

    }
}
