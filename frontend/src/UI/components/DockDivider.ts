import Component, {ComponentSettings} from "./Component";
import UI_I from "../UI_I";
import Color from "../math/Color";
import Vec2 from "../math/Vec2";
import DockNode from "../docking/DockNode";
import {DockSplit} from "../docking/DockType";


export class DockDividerSettings extends ComponentSettings{
    public splitType: DockSplit;
    public color: Color = new Color().setHex("#ffffff", 1);
    public wideSize =36
    public smallSize =3

    constructor(type: DockSplit) {
        super();
        this.splitType =type

    }


}

export default class DockDivider extends Component
{
    private localSettings: DockDividerSettings;
    private isDragging: boolean;
    private startDragPos: Vec2;


    private posMin: Vec2 =new Vec2();
    private posMax: Vec2 =new Vec2();
    private docNode!: DockNode;
    private center: Vec2 =new Vec2();
    constructor(id: number, settings: DockDividerSettings) {
        super(id, settings);
        this.localSettings = settings
        if(this.localSettings.splitType ==DockSplit.Horizontal)
        {
            this.size.set(this.localSettings.wideSize,this.localSettings.smallSize);
        }else{
            this.size.set(this.localSettings.smallSize,this.localSettings.wideSize);
        }

        this.posOffset.set(0,0)

    }

    updateMouse() {

        if (this.isDown) {
            //dragg
            if (this.isDownThisFrame) {
                if (this.layoutRect.contains(UI_I.mouseListener.mousePos)) {
                    this.isDragging = true;

                    this.startDragPos = this.center.clone() ;

                }

            }
            if (this.isDragging) {

                let dir = UI_I.mouseListener.mousePosDown.clone();
                dir.sub(UI_I.mouseListener.mousePos);
                let newPos = this.startDragPos.clone();
                newPos.sub(dir);
                newPos.clamp(this.posMin,this.posMax)
                this.docNode.setDividerPos(newPos)

               this.center.copy(newPos);


                this.setDirty(true);

            }


        } else {

            if (this.isDragging ) {

            }

            this.isDragging = false;

        }


    }

    updateOnMouseDown() {
       /* if (this.isDragging ) {
            this.setDirty();
        }*/
    }


    place(node:DockNode,dividerPos: Vec2, min: Vec2, max: Vec2) {

        if(dividerPos.equal(this.posOffset) && min.equal(this.posMin) && max.equal(this.posMax))return;
        this.docNode =node;
        this.center.copy(dividerPos);
        this.posMin.copy(min);
        this.posMax.copy(max);
        this.setDirty();
    }
    layoutRelative(){
        this.posOffset.copy(this.center)
        this.posOffset.sub(this.size.clone().scale(0.5))

    }
    prepDrawInt() {


        UI_I.currentDrawBatch.fillBatch.addRect(this.layoutRect, this.localSettings.color);



    }


}
