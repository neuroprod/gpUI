import Panel from "./components/Panel";


import UI_I from "./UI_I";
import LSlider, {LSliderSettings} from "./components/LSlider";
import {SliderType} from "./components/internal/SliderBase";
import LButton, {LButtonSettings} from "./components/LButton";
import LText, {LTextSettings} from "./components/LText";
import LColor, {LColorSettings} from "./components/LColor";

import Color from "./math/Color";
import LBoolean, {LBooleanSettings} from "./components/LBoolean";
import Group, {GroupSettings} from "./components/Group";

import UITexture from "./draw/UITexture";
import LTexture, {LTextureSettings} from "./components/LTexture";
import LTextInput, {LTextInputSettings} from "./components/LTextInput";
import Local from "./local/Local";
import Viewport, {ViewportSettings} from "./components/Viewport";
import WindowComp, {WindowSettings} from "./components/WindowComp";
import SelectItem from "./math/SelectItem";
import LSelect, {LSelectSettings} from "./components/LSelect";
import LNumber, {LNumberSettings} from "./components/LNumber";
import DockingPanel, {DockingPanelSettings} from "./components/internal/DockingPanel";


export default class UI {
    private static viewPort: Viewport | null;


    static setWebgl(gl: WebGL2RenderingContext | WebGLRenderingContext, canvas: HTMLCanvasElement) {
        let panel: Panel;
        UI_I.setWebgl(gl, canvas)
    }

    static draw() {
        UI_I.draw()
    }

    static pushWindow(label: string, settings?: WindowSettings) {
        UI_I.currentComponent = UI_I.panelLayer;

        if (!UI_I.setComponent(label)) {
            if (!settings) settings = new WindowSettings()
            let comp = new WindowComp(UI_I.getID(label), label, settings);


            UI_I.addComponent(comp);
        }


    }

    static popWindow() {
        UI_I.popComponent();
        UI_I.popComponent();
    }


    static pushViewport(label: string, settings?: ViewportSettings) {


        UI_I.currentComponent = UI_I.panelLayer;
        if (!UI_I.setComponent(label)) {
            if (!settings) settings = new ViewportSettings()
            let comp = new Viewport(UI_I.getID(label), label, settings);
            UI_I.addComponent(comp);
        }

        let vp = UI_I.currentComponent as Viewport
        UI_I.popComponent();


        if (vp.collapsed) {
            UI.viewPort = null
            return;
        }
        UI.viewPort = vp;

        vp.startRender()

    }

    static popViewport() {

        if (!UI.viewPort) return
        UI.viewPort.stopRender()

    }

    static pushGroup(label: string, settings?: GroupSettings) {
        if (!UI_I.setComponent(label)) {
            if (!settings) settings = new GroupSettings();
            let comp = new Group(UI_I.getID(label), label, settings);
            UI_I.addComponent(comp);
        }
    }

    static popGroup() {
        UI_I.popComponent();
    }

    static setIndent(value: number) {
        UI_I.globalStyle.compIndent = value;
    }

    static setLLabelSize(size?: number) {
        if (!size) size = UI_I.globalStyle.defaultLabelSize;
        UI_I.globalStyle.setLabelSize(size)
    }

    static LSelect(label: string, items: Array<SelectItem>, index = 0, settings?: LSelectSettings) {
        if (!UI_I.setComponent(label)) {
            if (!settings) settings = new LSelectSettings();
            let comp = new LSelect(UI_I.getID(label), label, items, index, settings);
            UI_I.addComponent(comp);
        }
        let result = UI_I.currentComponent.getReturnValue()
        UI_I.popComponent();
        return result;

    }

    static LButton(buttonText: string, label: string = "", settings?: LButtonSettings): boolean {
        let id = buttonText + label;

        if (!UI_I.setComponent(id)) {
            if (!settings) settings = new LButtonSettings();
            let comp = new LButton(UI_I.getID(id), label, buttonText, settings);
            UI_I.addComponent(comp);
        }
        let result = UI_I.currentComponent.getReturnValue()
        UI_I.popComponent();
        return result;
    }

    static LColor(label: string = "", color: Color, settings?: LColorSettings): Color {

        if (!UI_I.setComponent(label)) {
            if (!settings) settings = new LColorSettings();
            let comp = new LColor(UI_I.getID(label), label, color, settings);
            UI_I.addComponent(comp);
        }
        let result = UI_I.currentComponent.getReturnValue()
        UI_I.popComponent();
        return result;
    }

    static LText(text: string, label: string = "", multiLine: boolean = false, settings?: LTextSettings) {

        if (!UI_I.setComponent(text)) {
            if (!settings) settings = new LTextSettings()
            let comp = new LText(UI_I.getID(text), label, text, multiLine, settings);
            UI_I.addComponent(comp);
        }
        UI_I.popComponent();
    }

    static LTexture(label: string, texture: UITexture, settings?: LTextureSettings) {

        if (!UI_I.setComponent(label)) {
            if (!settings) settings = new LTextureSettings()
            let comp = new LTexture(UI_I.getID(label), label, texture, settings);
            UI_I.addComponent(comp);
        }
        UI_I.popComponent();
    }

    static LTextInput(label: string, value: string, empty?: string, settings?: LTextInputSettings)
    static LTextInput(label: string, ref: any, property: string, settings?: LTextInputSettings)
    static LTextInput(label: string, ref_or_value: any, property: string, settings?: LTextInputSettings) {

        if (!UI_I.setComponent(label)) {
            if (!settings) settings = new LTextInputSettings()
            if (!property) property = "";
            let comp = new LTextInput(UI_I.getID(label), label, ref_or_value, property, settings);
            UI_I.addComponent(comp);
        }

        let result = UI_I.currentComponent.getReturnValue()
        UI_I.popComponent();
        return result;

    }

    static LBool(label: string, value: boolean, settings?: LBooleanSettings)
    static LBool(ref: any, property: string, settings?: LBooleanSettings)
    static LBool(ref_or_label: any, property_or_value: any, settings?: LBooleanSettings) {
        let label;
        let ref = null;
        let value = null;

        if (typeof property_or_value === 'string') {
            label = property_or_value;
            ref = ref_or_label;
        } else {
            label = ref_or_label;
            value = property_or_value;
        }

        if (!UI_I.setComponent(label)) {
            if (!settings) settings = new LBooleanSettings()
            let comp = new LBoolean(UI_I.getID(label), label, value, ref, settings);
            UI_I.addComponent(comp);
        }

        let result = UI_I.currentComponent.getReturnValue()
        UI_I.popComponent();
        return result;
    }


    static LFloatSlider(label: string, value: number, min?: number, max?: number, settings?: LSliderSettings)
    static LFloatSlider(ref: any, property: string, min?: number, max?: number, settings?: LSliderSettings)
    static LFloatSlider(ref_or_label: any, property_or_value: any, min?: number, max?: number, settings?: LSliderSettings) {
        let label;
        let ref = null;
        let value = null;
        if (typeof property_or_value === 'string') {
            label = property_or_value;
            ref = ref_or_label;
        } else {
            label = ref_or_label;
            value = property_or_value;
        }


        if (!UI_I.setComponent(label)) {
            if (!settings) settings = new LSliderSettings()
            let comp = new LSlider(UI_I.getID(label), label, value, ref, settings, min, max, SliderType.FLOAT);
            UI_I.addComponent(comp);
        }
        let result = UI_I.currentComponent.getReturnValue()
        UI_I.popComponent();
        return result
    }

    static LFloat(label: string, value: number, settings?: LNumberSettings)
    static LFloat(ref: any, property: string, settings?: LNumberSettings)
    static LFloat(ref_or_label: any, property_or_value: any, settings?: LNumberSettings) {
        let label;
        let ref = null;
        let value = null;
        if (typeof property_or_value === 'string') {
            label = property_or_value;
            ref = ref_or_label;
        } else {
            label = ref_or_label;
            value = property_or_value;
        }


        if (!UI_I.setComponent(label)) {
            if (!settings) settings = new LNumberSettings()

            let comp = new LNumber(UI_I.getID(label), label, value, ref, settings, SliderType.FLOAT);
            UI_I.addComponent(comp);
        }
        let result = UI_I.currentComponent.getReturnValue()
        UI_I.popComponent();
        return result
    }


    static LIntSlider(label: string, value: number, min?: number, max?: number, settings?: LSliderSettings)
    static LIntSlider(ref: any, property: string, min?: number, max?: number, settings?: LSliderSettings)
    static LIntSlider(ref_or_label: any, property_or_value: any, min?: number, max?: number, settings?: LSliderSettings) {
        let label;
        let ref = null;
        let value = null;
        if (typeof property_or_value === 'string') {
            label = property_or_value;
            ref = ref_or_label;
        } else {
            label = ref_or_label;
            value = property_or_value;
        }


        if (!UI_I.setComponent(label)) {
            if (!settings) settings = new LSliderSettings()
            let comp = new LSlider(UI_I.getID(label), label, value, ref, settings, min, max, SliderType.INT);
            UI_I.addComponent(comp);
        }
        let result = UI_I.currentComponent.getReturnValue()
        UI_I.popComponent();
        return result;
    }

    static dockingPanel(panelMain: Panel, panelChild: Panel): DockingPanel {
        UI_I.currentComponent = panelMain.parent;
        let id = panelMain.id + Date.now() + " "

        if (!UI_I.setComponent(id)) {
            let settings = new DockingPanelSettings()
            let comp = new DockingPanel(UI_I.getID(id), panelMain, panelChild, settings);

            UI_I.addComponent(comp);
        }
        let comp = UI_I.currentComponent as DockingPanel
        UI_I.popComponent();
        return comp;
    }

    static clearLocalData() {
        Local.clearLocalData();
    }
}
