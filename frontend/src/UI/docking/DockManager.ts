import Panel from "../components/Panel";
import Layer from "../components/Layer";
import UI_I from "../UI_I";
import {DockIndicatorSettings} from "../components/internal/DockIndicator";
import DockNode from "./DockNode";
import {DockType} from "./DockType";
import Local from "../local/Local";
import UI_IC from "../UI_IC";
import DockTabData from "./DockTabData";


export default class DockManager {
    private dockLayer: Layer;
    private overlayLayer: Layer;
    private dragComponent: Panel | null = null;

   public mainDockNode: DockNode;
    private setPanelsFirst: boolean =false
    private tabItems: Array<DockTabData> =[];

    constructor(dockLayer: Layer, overlayLayer: Layer) {
        this.dockLayer = dockLayer;
        this.overlayLayer = overlayLayer;
        this.overlayLayer.hasOwnDrawBatch = true;

        this.mainDockNode = new DockNode()
        if( Local.dockData)
        {
           this.setPanelsFirst =true
            this.mainDockNode.setLocalData(Local.dockData)
        }
    }

    public startDragging(panel: Panel) {
        let node = this.mainDockNode.getNodeWithPanel(panel);
        if (node) {
            if (node.parent ) {


                let parent = node.parent;
                let keepNode: DockNode;

                if (parent.children[0].panel === panel) {
                    keepNode = parent.children[1];
                } else {
                    keepNode = parent.children[0];
                }

                parent.panel = keepNode.panel;

                parent.children = keepNode.children;
                if (parent.children.length) {
                    parent.children[0].parent = parent;
                    parent.children[1].parent = parent;
                }

            }else
            {
                node.children =[];
                node.panel =null;
            }
            this.mainDockNode.resize(UI_I.screenSize, true);
            this.mainDockNode.updateLayout()
            this.saveLocal()
        }
       // UI_I.panelDockingLayer
       // UI_I.panelLayer.

        this.tabItems =[]
        this.collectTabItems(UI_I.panelDockingLayer);
        this.collectTabItems(UI_I.panelLayer);
        this.dragComponent = panel;
    }

    public stopDragging(panel: Panel) {
        this.dragComponent = null


        this.mainDockNode.updateLayout()
        this.overlayLayer.setDirty(true)
        this.dockLayer.setDirty(true)
    }


    update() {
       if(this.setPanelsFirst)
        {

            this.mainDockNode.setPanels();
            this.setPanelsFirst =false;
            this.mainDockNode.resize(UI_I.screenSize,true)
            this.mainDockNode.updateLayout()
        }

        if (this.mainDockNode.resize(UI_I.screenSize)) this.mainDockNode.updateLayout()

        if (this.dragComponent) {

           for(let item  of this.tabItems)
           {
               UI_IC.dockTabIndicator(item);
           }

            let overNode = this.mainDockNode.getOverNode(UI_I.mouseListener.mousePos);
            if (overNode) {
                if (!overNode.panel)
                    UI_IC.dockIndicator("CenterDockIndicator" + overNode.id, new DockIndicatorSettings(DockType.Center, overNode));

                UI_IC.dockIndicator("rightCenterDockIndicator" + overNode.id, new DockIndicatorSettings(DockType.RightCenter, overNode));
                UI_IC.dockIndicator("leftCenterDockIndicator" + overNode.id, new DockIndicatorSettings(DockType.LeftCenter, overNode))
                UI_IC.dockIndicator("topCenterDockIndicator" + overNode.id, new DockIndicatorSettings(DockType.TopCenter, overNode))
                UI_IC.dockIndicator("bottomCenterDockIndicator" + overNode.id, new DockIndicatorSettings(DockType.BottomCenter, overNode))
            }
        }






        this.mainDockNode.setDividers()


    }


    split(type: DockType, doc: DockNode) {


        if (type == DockType.Left || type == DockType.Right || type == DockType.Top || type == DockType.Bottom) {

        } else if (type == DockType.Center) {
            doc.set(this.dragComponent);
            this.dragComponent.isDocked = true
        } else {
            doc.split(type, this.dragComponent)
            this.dragComponent.isDocked = true
        }

        this.mainDockNode.updateLayout();

        this.saveLocal();

        this.dragComponent =null;
    }

    private saveLocal() {
        let data = {}
        this.mainDockNode.getDocStructure(data )
        Local.setDockData(data);
    }

    private collectTabItems(layer: Layer) {
        for(let child  of layer.children)
        {
            let panel = child as Panel;
            if(panel.dockParent) continue;
            let tabData =new DockTabData()
            tabData.panel =child as Panel;
            tabData.rect.copy( tabData.panel.layoutRect)
            tabData.rect.size.y =20;
            this.tabItems.push(tabData)

        }
    }

    dockInPanel(panel: Panel) {
        console.log("dockInPanel",panel)
        this.dragComponent.setDockInPanel(panel);

    }
}
