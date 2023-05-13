import Component, {ComponentSettings} from "./Component";
import Vec2 from "../math/Vec2";
import UI_I from "../UI_I";
import Rect from "../math/Rect";
import Color from "../math/Color";

import Font from "../draw/Font";
import Local from "../local/Local";
import Utils from "../math/Utils";
import UI_IC from "../UI_IC";
import UI from "../UI";
import {VerticalLayoutSettings} from "./VerticalLayout";

export class PanelSettings extends ComponentSettings {
    static positionOffset= new Vec2(10, 10)

    public position: Vec2 = PanelSettings.positionOffset.clone();
    public size: Vec2 = new Vec2(320, 300);
    public backgroundColor: Color = new Color().setHex("#383838", 1)

    public labelColor: Color = new Color().setHex("#d8d8d8", 1)
    public topBarColor: Color = new Color().setHex("#2d2d2d", 1)
    public resizeColor: Color = new Color().setHex("#1c1c1c", 1)
    public outlineColor: Color = new Color().setHex("#FFFFFF", 0.1)
    public topBarHeight = 22;
    public minSize = new Vec2(156, 100);

    constructor() {
        super();
        PanelSettings.positionOffset.add(new Vec2(30,30))
        this.box.setPadding(3);
        this.box.paddingTop = 0;
    }
}

export default class Panel extends Component {


    public localSettings: PanelSettings
    public label: string;


    public isDragging = false;
    public isResizing = false;
    public startDragPos = new Vec2();
    public startResizeSize = new Vec2();

    public topBarRect: Rect = new Rect()
    public labelPos: Vec2 = new Vec2()
    public resizeRect: Rect;
    public maxLabelSize: number;
    private dockSize: Vec2 = new Vec2();

    private _isDocked: boolean = false;
    private collapsed =false;
    private prevSize:Vec2 =new Vec2()
    private contentVLSetting: VerticalLayoutSettings;

    constructor(id: number, label: string, settings: PanelSettings) {
        super(id, settings);
        this.localSettings = settings;
        this.posOffset =settings.position.clone()
        this.size.copy( settings.size)

        this.hasOwnDrawBatch = true;
        this.label = label;

        this.resizeRect = new Rect();
        this.resizeRect.setSize(12, 12);


        this.contentVLSetting =new VerticalLayoutSettings()
        this.contentVLSetting.box.marginTop=24;


        this.setFromLocal()

    }
    setSubComponents() {


        if(UI_IC.toggleIcon("ib",this,"collapsed",2,1))
        {
            if(this.collapsed)
            {
                this.prevSize.copy(this.size)
                this.size.y =22;
            }else
            {
                this.size.y =this.prevSize.y
            }
            this.setDirty();
        }


        UI.pushVerticalLayout( "panelVert", this.contentVLSetting);

        UI_I.currentComponent.drawChildren =!this.collapsed

    }
    onPopComponent()
    {
       // UI_I.popComponent(false)
    }
    get isDocked(): boolean {
        return this._isDocked;
    }

    set isDocked(value: boolean) {

        if (this._isDocked && !value) {

            this.posOffset.copy(UI_I.mouseListener.mousePos);
            this.posOffset.x -= this.dockSize.x / 2
            this.posOffset.y -= 10;
            this.size.copy(this.localSettings.size)

        }

        this._isDocked = value;
    }

    setFromLocal() {
        let data = Local.getItem(this.id);
        if (data) {
            this.size.set(data.size.x, data.size.y);

            this.posOffset.set(data.posOffset.x, data.posOffset.y);
            this.collapsed=data.collapsed;
        }
        if(this.collapsed) this.prevSize.y =200;
    }

    saveToLocal() {

        let a = {
            posOffset: this.posOffset,
            size: this.size,
            collapsed: this.collapsed,
        };

        Local.setItem(this.id, a)
    }

    updateMouse() {

        if (this.isDown) {
            //dragg
            if (this.isDownThisFrame) {
                if (this.topBarRect.contains(UI_I.mouseListener.mousePos)) {
                    this.isDragging = true;
                    this.isDocked = false;
                    this.startDragPos = this.posOffset.clone();
                    UI_I.dockManager.startDragging(this);
                } else if (!this.isDocked && this.resizeRect.contains(UI_I.mouseListener.mousePos)) {
                    this.isResizing = true;
                    this.startResizeSize = this.size.clone();
                }
            }
            if (this.isDragging) {

                let dir = UI_I.mouseListener.mousePosDown.clone();
                dir.sub(UI_I.mouseListener.mousePos);
                let newPos = this.startDragPos.clone();
                newPos.sub(dir);
                this.posOffset.copy(newPos);

                this.setDirty(true);

            }

            if (this.isResizing) {
                let dir = UI_I.mouseListener.mousePosDown.clone();
                dir.sub(UI_I.mouseListener.mousePos);
                let newSize = this.startResizeSize.clone();
                newSize.sub(dir);
                newSize.max(this.localSettings.minSize);

                this.size.copy(newSize);
                this.setDirty(true);
            }
        } else {

            if (this.isDragging || this.isResizing) {
                this.saveToLocal();
            }
            if (this.isDragging) {
                UI_I.dockManager.stopDragging(this)
            }
            this.isDragging = false;
            this.isResizing = false;
        }


    }

    updateOnMouseDown() {
        if (this.isDragging || this.isResizing) {
            this.setDirty();
        }
    }

    layoutAbsolute() {

        super.layoutAbsolute();
        this.topBarRect.copyPos(this.layoutRect.pos);
        this.topBarRect.setSize(this.layoutRect.size.x, this.localSettings.topBarHeight);
        this.labelPos.set(this.posAbsolute.x + this.localSettings.box.paddingLeft + 5+20, this.posAbsolute.y + this.localSettings.topBarHeight / 2 - Font.charSize.y / 2 - 1)
        this.resizeRect.setPos(this.layoutRect.pos.x + this.layoutRect.size.x - this.resizeRect.size.x, this.layoutRect.pos.y + this.layoutRect.size.y - this.resizeRect.size.y);
        this.maxLabelSize = this.layoutRect.size.x - this.localSettings.box.paddingLeft - this.localSettings.box.paddingRight

        // this.clippingRect.setPosV(this.layoutRect.pos);
        //this.clippingRect.setSizeV(this.layoutRect.size);*/
    }

    prepDraw() {
        // UI.currentDrawBatch.shadowBatch.addRect(this.layoutRect);
        Utils.drawOutlineRect(this.layoutRect, this.localSettings.outlineColor)

        UI_I.currentDrawBatch.fillBatch.addRect(this.layoutRect, this.localSettings.backgroundColor);

        UI_I.currentDrawBatch.fillBatch.addRect(this.layoutRect, this.localSettings.backgroundColor);
        UI_I.currentDrawBatch.fillBatch.addRect(this.topBarRect, this.localSettings.topBarColor);

       if (!this.isDocked && !this.collapsed)
            UI_I.currentDrawBatch.fillBatch.addTriangle(this.resizeRect.getTopRight(), this.resizeRect.getBottomRight(), this.resizeRect.getBottomLeft(), this.localSettings.resizeColor)


        UI_I.currentDrawBatch.textBatch.addLine(this.labelPos, this.label, this.maxLabelSize, this.localSettings.labelColor);
        //  UI.currentDrawBatch.fillBatch.addRect(new Rect(this.r,new Vec2(20,20)), new Color().setHex("#f1c30e",1));
    }
}
