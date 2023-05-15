import RendererGL from "./GL/RendererGL";
import Layer from "./components/Layer";
import Component from "./components/Component";
import Panel from "./components/Panel";
import DrawBatch from "./draw/DrawBatch";
import Font from "./draw/Font";
import MouseListener from "./input/MouseListener";
import DockManager from "./docking/DockManager";
import Vec2 from "./math/Vec2";


import Local from "./local/Local";



import TexturePool from "./draw/TexturePool";
import GlobalStyle from "./GlobalStyle";
import KeyboardListener from "./input/KeyboardListener";



export default class UI_I {
    public static currentComponent: Component;
    public static components = new Map<number, Component>();
    static currentDrawBatch: DrawBatch;
    static mouseListener: MouseListener;
    public static  dockManager: DockManager;
    static screenSize: Vec2 = new Vec2();
    static renderer: RendererGL;

    static pixelRatio: number;
    static hasPopup: boolean = false
    static renderType: string;
    static numDrawCalls: number = 0
    public static globalStyle: GlobalStyle;



   public static drawBatches = new Map<number, DrawBatch>();
    private static mainDrawBatch: DrawBatch;
    private static mouseOverComponent: Component | null = null;
    private static mouseDownComponent: Component | null = null;
    private static focusComponent: Component | null = null;
    private static canvas: HTMLCanvasElement;
    private static keyboardListener: KeyboardListener;

    static mainComp: Layer;
    static panelDockingLayer: Layer;
    static panelLayer: Layer;
    static panelDragLayer: Layer;
    static popupLayer: Layer;
    static overlayLayer: Component;
    static panelDockingDividingLayer: Layer;

    constructor() {
    }

    static init(canvas: HTMLCanvasElement) {

        this.canvas = canvas;
        this.pixelRatio = window.devicePixelRatio
        this.globalStyle = new GlobalStyle()

        Local.init()
        Font.init()

        this.mouseListener = new MouseListener(canvas);
        this.keyboardListener = new KeyboardListener();

        UI_I.mainComp = new Layer(UI_I.getHash("mainLayer"));

        UI_I.currentComponent = UI_I.mainComp;

        UI_I.panelDockingLayer = new Layer(UI_I.getID("dockingLayer"));
        UI_I.addComponent(UI_I.panelDockingLayer);
        this.popComponent();

        UI_I.panelDockingDividingLayer = new Layer(UI_I.getID("panelDockingDividingLayer"));
        UI_I.addComponent(UI_I.panelDockingDividingLayer);
        this.popComponent();

        UI_I.panelLayer = new Layer(UI_I.getID("panelLayer"));
        UI_I.addComponent(UI_I.panelLayer);
        this.popComponent();

        UI_I.panelDragLayer = new Layer(UI_I.getID("panelDragLayer"));
        UI_I.addComponent(UI_I.panelDragLayer);
        this.popComponent();


        UI_I.popupLayer = new Layer(UI_I.getID("popupLayer"));
        UI_I.addComponent(UI_I.popupLayer);
        this.popComponent();


        UI_I.overlayLayer = new Layer(UI_I.getID("dockingOverLayer"));
        UI_I.addComponent(UI_I.overlayLayer);
        this.popComponent();

        UI_I.dockManager = new DockManager( UI_I.panelDockingLayer, UI_I.overlayLayer)


        UI_I.mainDrawBatch = new DrawBatch(UI_I.mainComp.id)
        UI_I.currentDrawBatch = UI_I.mainDrawBatch;
    }









    static setComponent(localID) {
        const id = this.getID(localID);
        if (this.hasComponent(id)) {
            this.currentComponent = this.components.get(id);
            //   console.log(this.currentComponent.renderOrder)
            this.currentComponent.renderOrder = this.currentComponent.parent.renderOrderCount
            this.currentComponent.useThisFrame = true;
            this.currentComponent.parent.renderOrderCount++
            this.currentComponent.setSubComponents();
            this.currentComponent.onAdded()
            return true;
        }
        return false;
    }

    static addComponent(component: Component) {
        this.components.set(component.id, component);

        component.renderOrder = this.currentComponent.renderOrderCount;

        this.currentComponent.renderOrderCount++;
        this.currentComponent.addChild(component);
        if (this.currentComponent.needsChildrenSortingByRenderOrder && component.renderOrder != this.currentComponent.children.length - 1) {
            this.currentComponent.sortIsDirty = true
        }

        this.currentComponent = component;
        this.currentComponent.useThisFrame = true;
        this.currentComponent.setDirty(true);
        this.currentComponent.setSubComponents();
        this.currentComponent.onAdded()

    }

    static popComponent(callPop=true) {
        if(callPop){
            this.currentComponent.onPopComponent()
        }

        this.currentComponent = this.currentComponent.parent;
        this.currentComponent.useThisFrame = true;
    }



    static hasComponent(id: number) {
        return this.components.has(id);
    }

    static getID(seed: string) {

        return this.getHash(seed + UI_I.currentComponent.id + "");
    }

    static getHash(str: string) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            let char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }


    public static setWebgl(gl: WebGL2RenderingContext | WebGLRenderingContext, canvas: HTMLCanvasElement) {
        UI_I.renderType = "gl";
        UI_I.renderer = new RendererGL();
        UI_I.renderer.init(gl, canvas);
        TexturePool.init();
        UI_I.init(canvas);

    }

    static delete(comp: Component) {

        this.components.delete(comp.id);
        comp.setDirty();
        for (let child of comp.children) {
            //child.lockedToParent =false;
            child.useThisFrame = false;
        }
        let index = comp.parent.children.indexOf(comp);
        comp.parent.children.splice(index, 1);
        comp.parent = null;
        comp.destroy()
        if (comp.hasOwnDrawBatch) {

            let batch = this.drawBatches.get(comp.id);
            let index = batch.parent.children.indexOf(batch);
            batch.parent.children.splice(index, 1);
            batch.parent = null;

            this.drawBatches.delete(comp.id);
            this.renderer.delete(comp.id);
        }

    }

    public static draw() {

        this.screenSize.set(this.canvas.offsetWidth, this.canvas.offsetHeight)
        this.dockManager.update()

        if (this.hasPopup) {
            this.currentComponent = this.popupLayer.children[0]
            this.currentComponent.setSubComponents()

        }

        this.components.forEach((comp) => {
            if (comp.useThisFrame == false) {
                this.delete(comp);
            }
            if (comp.isDirty && comp.needsChildrenSortingByRenderOrder) {
                comp.sortChildrenByRenderOrder()
            }
        })

        this.checkMouse();
        let buffer = this.keyboardListener.getBuffer()
        let actionKey =this.keyboardListener.getActionKey()
        if(this.focusComponent)
        {
            this.focusComponent.setKeys(buffer,actionKey);
        }
        if (this.mainComp.isDirty) {

            this.mainDrawBatch.isDirty = true;

            this.mainComp.updateMouseInt();
            this.mainComp.layoutRelativeInt();
            this.mainComp.layoutAbsoluteInt();

            this.mainComp.prepDrawInt();
            let drawBatches: Array<DrawBatch> = []
            this.mainDrawBatch.collectBatches(drawBatches);
            UI_I.renderer.setDrawBatches(drawBatches);

            this.mainComp.isDirty = false;
        }


        UI_I.renderer.draw();

        this.components.forEach((comp) => {
            comp.renderOrderCount = 0;
            if (!comp.keepAlive) {
                comp.useThisFrame = false
            }
        });
        Local.saveDockData();

    }
    static removePopup(p:Component)
    {
        p.keepAlive = false;
        this.hasPopup = false;
    }
    ////input
    static checkMouse() {
        if (this.mouseListener.isDirty < 0) return
        let mousePos = this.mouseListener.mousePos;

        if (this.hasPopup && this.mouseListener.isDownThisFrame) {
            if (!this.popupLayer.children[0].checkMouseOverLayout(mousePos)) {
                this.popupLayer.children[0].keepAlive = false;

                this.hasPopup = false;
            }
        }


        if (!this.mainComp.checkMouse(mousePos)) {
            this.setMouseOverComponent(null);
        }
        if (this.mouseDownComponent) {

            this.mouseDownComponent.isDownThisFrame = false;
        }
        if (this.mouseListener.isDownThisFrame) {

            this.setMouseDownComponent();
            this.setFocusComponent()
        }
        if (this.mouseListener.isUpThisFrame) {

            if (this.mouseDownComponent === this.mouseOverComponent && this.mouseOverComponent) {

                if (this.mouseOverComponent === this.mouseDownComponent) {

                    this.mouseDownComponent.isClicked = true;
                    this.mouseDownComponent.onMouseClicked()
                }
                this.mouseDownComponent.onMouseUp()
                this.mouseDownComponent.isDown = false;
                this.mouseDownComponent = null;

            } else if (this.mouseDownComponent) {

                this.mouseDownComponent.isDown = false;

                this.mouseDownComponent = null;
            }
            //this.setFocusComponent();


        }
        this.mouseListener.reset();
        if (this.focusComponent) this.focusComponent.updateOnFocus();
        if (this.mouseDownComponent) this.mouseDownComponent.updateOnMouseDown();

    }

    static setMouseDownComponent() {

        this.mouseDownComponent = this.mouseOverComponent;

        if (this.mouseDownComponent) {
            this.mouseDownComponent.isDown = true;
            this.mouseDownComponent.isDownThisFrame = true;
            this.mouseDownComponent.onMouseDown()
            this.mouseDownComponent.setDirty();
            this.setPanelFocus(this.mouseDownComponent);

        }


    }

    static setMouseOverComponent(comp) {


        if (comp === this.mouseOverComponent) {
            return;
        }
        if (this.mouseOverComponent) {

            this.mouseOverComponent.isOver = false;
            this.mouseOverComponent.setDirty();
        }
        this.mouseOverComponent = comp;
        if (this.mouseOverComponent) {
            if (this.mouseDownComponent && this.mouseDownComponent != this.mouseOverComponent) return

            this.mouseOverComponent.isOver = true;
            this.mouseOverComponent.setDirty();
        }

    }

    static setPanelToBack(panel: Panel) {
        if (this.panelLayer.children[0] === panel) {
            //already bottom panel
            return;
        }
        //set panel to the front(=draw on top);
        let index = this.panelLayer.children.indexOf(panel);
        this.panelLayer.children.splice(index, 1);
        this.panelLayer.children.unshift(panel);

        //also update drawBatches
        if (!this.drawBatches.has(panel.id)) {
            return;
        }
        let batch = this.drawBatches.get(panel.id);
        let batchParent = batch.parent;
        index = batchParent.children.indexOf(batch);
        batchParent.children.splice(index, 1);
        batchParent.children.unshift(batch);


    }

    static setPanelFocus(comp: Component) {

        let numPanels = this.panelLayer.children.length;
        if (numPanels < 2) {
            //1 or 0 panel, no need to change
            return;
        }
        while (comp.parent && !(comp instanceof Panel)) {
            comp = comp.parent;
        }

        if (!comp.parent) {
            //not a child of panel or panel
            return;
        }
        //comp is the panel now;
        let panelLayer = comp.parent;

        if (panelLayer.children[numPanels - 1] === comp) {
            //already top panel
            return;
        }
        //set panel to the back (=draw on top);
        let index = panelLayer.children.indexOf(comp);
        panelLayer.children.splice(index, 1);
        panelLayer.children.push(comp);

        //also update drawBatches
        if (!this.drawBatches.has(comp.id)) {
            return;
        }
        let batch = this.drawBatches.get(comp.id);
        let batchParent = batch.parent;
        index = batchParent.children.indexOf(batch);
        batchParent.children.splice(index, 1);
        batchParent.children.push(batch);
    }

    static setFocusComponent() {

        if (this.focusComponent) {
            this.focusComponent.isFocus = false;
            this.focusComponent.setDirty();
        }
        this.focusComponent = this.mouseOverComponent;

        if (this.focusComponent) {
            this.focusComponent.isFocus = true;
            this.focusComponent.setDirty();
        }
    }


    //draw batches
    static pushDrawBatch(id, clipRect, isDirty) {

        let batch;
        if (this.drawBatches.has(id)) {
            batch = this.drawBatches.get(id);
            batch.isDirty = isDirty;
            batch.clear()
        } else {
            batch = new DrawBatch(id, clipRect);
            this.drawBatches.set(id, batch);
            this.currentDrawBatch.addChild(batch);
            batch.isDirty = true;

        }

        this.currentDrawBatch = batch;
    }

    static popDrawBatch() {
        this.currentDrawBatch = this.currentDrawBatch.parent;

    }


    static deleteDrawBatch(id: number) {
        if (this.drawBatches.has(id)) {
            let batch = this.drawBatches.get(id);
            batch.removeFromParent()
            this.drawBatches.delete(id);

        }
    }
}
