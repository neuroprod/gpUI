import ButtonBase, {ButtonBaseSettings} from "./internal/ButtonBase";


export class LListItemSettings extends ButtonBaseSettings {
    constructor() {
        super();
        this.box.size.y = 20;
    }
}

export default class LListItem extends ButtonBase {

    constructor(id: number, label: string, settings: LListItemSettings) {
        super(id, label, settings);

    }
}
