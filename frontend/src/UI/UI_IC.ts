//internal components
import SliderBase, {SliderBaseSettings, SliderType} from "./components/internal/SliderBase";
import DirtyButton, {DirtyButtonSettings} from "./components/internal/DirtyButton";
import SettingsButton, { SettingsButtonSettings} from "./components/internal/SettingsButton";
import UI_I from "./UI_I";
import ButtonBase, {ButtonBaseSettings} from "./components/internal/ButtonBase";
import ColorButton, {ColorButtonSettings} from "./components/internal/ColorButton";
import ColorPickerPopUp, {ColorPickerPopupSettings} from "./components/internal/popUps/ColorPickerPopUp";
import LColor from "./components/LColor";
import Color from "./math/Color";
import ColorPicker, {ColorPickerSettings} from "./components/internal/ColorPicker";
import CheckBox, {CheckBoxSettings} from "./components/internal/CheckBox";
import GroupTitle, {GroupTitleSettings} from "./components/internal/GroupTitle";
import UITexture from "./draw/UITexture";
import Texture, {TextureSettings} from "./components/internal/Texture";
import InputBase, {InputBaseSettings} from "./components/internal/InputBase";
import ToggleIcon, {ToggleIconSettings} from "./components/internal/ToggleIcon";
import SelectPopUp, {SelectPopUpSettings} from "./components/internal/popUps/SelectPopUp";
import SelectItem from "./math/SelectItem";
import Vec2 from "./math/Vec2";
import VerticalLayout, {VerticalLayoutSettings} from "./components/VerticalLayout";
import SelectButton, {SelectButtonSettings} from "./components/internal/SelectButton";

export default class UI_IC
{
    static pushVerticalLayout(label: string, settings?: VerticalLayoutSettings) {

        if (!UI_I.setComponent(label)) {
            if (!settings) settings = new VerticalLayoutSettings();
            let comp = new VerticalLayout(UI_I.getID(label), settings);
            UI_I.addComponent(comp);
        }
    }
    static sliderBase(name: string, value: number, ref: any, objName: string, min: number, max: number,type:SliderType,settings?: SliderBaseSettings ):SliderBase {
        if (!UI_I.setComponent(name)) {
            if(!settings)settings  =new SliderBaseSettings()
            let comp = new SliderBase(UI_I.getID(name),value, ref, objName, min, max,type, settings);
            UI_I.addComponent(comp);
        }
        let v =UI_I.currentComponent.getReturnValue()
        UI_I.popComponent();
        return v
    }
    static colorButton(name,color , settings?: ColorButtonSettings ) {
        if (!UI_I.setComponent(name)) {
            if(!settings)settings =new ColorButtonSettings()
            let comp = new ColorButton(UI_I.getID(name),color, settings);
            UI_I.addComponent(comp);
        }
        let comp =UI_I.currentComponent
        UI_I.popComponent();
        return comp.getReturnValue();
    }

    //doesn't call pop!!!
    static dirtyButton(name , settings?: DirtyButtonSettings ) {
        if (!UI_I.setComponent(name)) {
            if(!settings)settings =new DirtyButtonSettings()
            let comp = new DirtyButton(UI_I.getID(name), settings);
            UI_I.addComponent(comp);
        }
        let comp =UI_I.currentComponent;
        return comp.getReturnValue();
    }

    static texture(name ,texture:UITexture, settings?: TextureSettings ) {
        if (!UI_I.setComponent(name)) {
            if(!settings)settings =new TextureSettings()
            let comp = new Texture(UI_I.getID(name),texture, settings);
            UI_I.addComponent(comp);
        }
        UI_I.popComponent();
    }
    static selectButton ( buttonText: string,settings?: SelectButtonSettings) {
        if (!UI_I.setComponent(buttonText)) {
            if(!settings)settings = new SelectButtonSettings()
            let comp = new SelectButton(UI_I.getID(buttonText),buttonText, settings);
            UI_I.addComponent(comp);
        }
        let retValue =UI_I.currentComponent.getReturnValue();
        UI_I.popComponent();
        return retValue;

    }

    static settingsButton(name , settings?: SettingsButtonSettings ) {
        if (!UI_I.setComponent(name)) {
            if(!settings)settings = new SettingsButtonSettings()
            let comp = new SettingsButton(UI_I.getID(name), settings);
            UI_I.addComponent(comp);
        }
        let retValue =UI_I.currentComponent.getReturnValue();
        UI_I.popComponent();
        return retValue;
    }

    static groupTitle( label: string,isOpen:boolean,settings?: GroupTitleSettings) {
        if (!UI_I.setComponent(label)) {
            if(!settings)settings = new GroupTitleSettings()
            let comp = new GroupTitle(UI_I.getID(label),label,isOpen, settings);
            UI_I.addComponent(comp);
        }
        let retValue =UI_I.currentComponent.getReturnValue();
        UI_I.popComponent();
        return retValue;

    }
    static toggleIcon(name:string,ref:any,prop:string,iconTrue:number,iconFalse:number,settings?: ToggleIconSettings):boolean {
        if (!UI_I.setComponent(name)) {
            if(!settings)settings = new ToggleIconSettings()
            let comp = new ToggleIcon(UI_I.getID(name),ref,prop,iconTrue,iconFalse, settings);
            UI_I.addComponent(comp);
        }
        let retValue =UI_I.currentComponent.getReturnValue();
        UI_I.popComponent();
        return retValue;

    }
    static inputBase(name:string,ref:any,prop:string,settings?: InputBaseSettings):boolean {
        if (!UI_I.setComponent(name)) {
            if(!settings)settings = new InputBaseSettings()
            let comp = new InputBase(UI_I.getID(name),ref,prop, settings);
            UI_I.addComponent(comp);
        }
        let retValue =UI_I.currentComponent.getReturnValue();
        UI_I.popComponent();
        return retValue;

    }
    static buttonBase( buttonText: string,settings?: ButtonBaseSettings) {
        if (!UI_I.setComponent(buttonText)) {
            if(!settings)settings = new ButtonBaseSettings()
            let comp = new ButtonBase(UI_I.getID(buttonText),buttonText, settings);
            UI_I.addComponent(comp);
        }
        let retValue =UI_I.currentComponent.getReturnValue();
        UI_I.popComponent();
        return retValue;

    }
    static checkBox( label: string,ref:any,obj:string,settings?: CheckBoxSettings) {
        if (!UI_I.setComponent(label)) {
            if(!settings)settings = new CheckBoxSettings();
            let comp = new CheckBox(UI_I.getID(label),label,ref,obj, settings);
            UI_I.addComponent(comp);
        }
        let retValue =UI_I.currentComponent.getReturnValue();
        UI_I.popComponent();
        return retValue;

    }
    static colorPicker(name: string, color: Color,settings?:ColorPickerSettings) {
        if (!UI_I.setComponent(name)) {
            if(!settings)settings = new ColorPickerSettings()
            let comp = new ColorPicker(UI_I.getID(name),color, settings);
            UI_I.addComponent(comp);
        }
        let retValue =UI_I.currentComponent.getReturnValue();
        UI_I.popComponent();
        return retValue;
    }

    // Popups

    static colorPickerPopUp(comp: LColor, settings: ColorPickerPopupSettings = new ColorPickerPopupSettings()) {

        let old =UI_I.currentComponent ;

        UI_I.currentComponent =  UI_I.popupComp;
        let compPopup = new ColorPickerPopUp( UI_I.getID(comp.id + ""), comp, settings);
        UI_I.addComponent(compPopup);
        UI_I.hasPopup = true;

        UI_I.currentComponent =old;
    }

    static selectPopUp(callBack:(item:SelectItem)=>void,pos:Vec2,targetWidth=-1,items:Array<SelectItem> ,index=0, settings: SelectPopUpSettings = new SelectPopUpSettings()) {

        let old =UI_I.currentComponent ;

        UI_I.currentComponent =  UI_I.popupComp;
        let compPopup = new SelectPopUp( UI_I.getID( "select"),callBack,pos,targetWidth,items,index, settings);
        UI_I.addComponent(compPopup);
        UI_I.hasPopup = true;

        UI_I.currentComponent =old;
    }

}

