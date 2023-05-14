import ButtonBase, {ButtonBaseSettings} from "./ButtonBase";
import UI_I from "../../UI_I";
import Color from "../../math/Color";
import Vec2 from "../../math/Vec2";


export class SelectButtonSettings extends ButtonBaseSettings {

}

export default class SelectButton extends ButtonBase {
    private iconPos:Vec2=new Vec2()
    constructor(id: number, label: string, settings: SelectButtonSettings) {
        super(id, label, settings);
    }
    layoutAbsolute() {
        super.layoutAbsolute();
        this.iconPos=this.layoutRect.pos.clone();
        this.iconPos.x+=this.layoutRect.size.x-20
        this.iconPos.y+=2;
    }

    prepDraw() {

        super.prepDraw()
        UI_I.currentDrawBatch.textBatch.addIcon(this.iconPos, 8, Color.white)


    }
}
