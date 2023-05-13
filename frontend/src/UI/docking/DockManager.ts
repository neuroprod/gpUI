import Panel from "../components/Panel";
import Layer from "../components/Layer";
import UI_I from "../UI_I";
import {DockIndicatorSettings} from "../components/DockIndicator";
import DockNode from "./DockNode";
import {DockType} from "./DockType";
import Local from "../local/Local";


export default class DockManager {
    private dockLayer: Layer;
    private overlayLayer: Layer;
    private dragComponent: Panel | null = null;

    private mainDockNode: DockNode;
    private setPanelsFirst: boolean =false

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
            if (node.parent) {


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
           // UI.dockIndicator("rightDockIndicator", new DockIndicatorSettings(DockType.Right, this.mainDockNode));
            //UI.dockIndicator("leftDockIndicator", new DockIndicatorSettings(DockType.Left, this.mainDockNode));
            //UI.dockIndicator("topDockIndicator", new DockIndicatorSettings(DockType.Top, this.mainDockNode));
            //UI.dockIndicator("bottomDockIndicator", new DockIndicatorSettings(DockType.Bottom, this.mainDockNode));

            let overNode = this.mainDockNode.getOverNode(UI_I.mouseListener.mousePos);
            if (overNode) {
                if (!overNode.panel)
                    UI_I.dockIndicator("CenterDockIndicator" + overNode.id, new DockIndicatorSettings(DockType.Center, overNode));

                UI_I.dockIndicator("rightCenterDockIndicator" + overNode.id, new DockIndicatorSettings(DockType.RightCenter, overNode));
                UI_I.dockIndicator("leftCenterDockIndicator" + overNode.id, new DockIndicatorSettings(DockType.LeftCenter, overNode))
                UI_I.dockIndicator("topCenterDockIndicator" + overNode.id, new DockIndicatorSettings(DockType.TopCenter, overNode))
                UI_I.dockIndicator("bottomCenterDockIndicator" + overNode.id, new DockIndicatorSettings(DockType.BottomCenter, overNode))
            }
        }






        this.mainDockNode.setDividers()


    }


    split(type: DockType, doc: DockNode) {

        if (type == DockType.Left || type == DockType.Right || type == DockType.Top || type == DockType.Bottom) {
            console.log("sideSplit")
        } else if (type == DockType.Center) {
            doc.set(this.dragComponent);
            this.dragComponent.isDocked = true
        } else {
            doc.split(type, this.dragComponent)
            this.dragComponent.isDocked = true
        }
        UI_I.setPanelToBack(this.dragComponent)
        this.mainDockNode.updateLayout();

        this.saveLocal();


    }

    private saveLocal() {
        let data = {}
        this.mainDockNode.getDocStructure(data )
        Local.setDockData(data);
    }
}
