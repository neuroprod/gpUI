



import Component, {ComponentSettings} from "./Component";


export class ViewportSettings extends ComponentSettings {

}

export default class Viewport extends Component {


    constructor(id: number, label: string, settings: ViewportSettings) {
        super(id,  settings);

    }


}
