import UI_I from "./UI/UI_I";

import Color from "./UI/math/Color";
import GL from "./glLib/GL";
import PreLoader from "./glLib/PreLoader";

import UITexture from "./UI/draw/UITexture";
import Texture from "./glLib/Texture";
import Font from "./UI/draw/Font";

import Scene from "./scene/Scene";
import SelectItem from "./UI/math/SelectItem";

import UIUtils from "./UI/UIUtils";
import Vec2 from "./UI/math/Vec2";
import {Vector2, Vector3, Vector4} from "math.gl";


import UI from "./UI/UI";
import {getUI_VEC2} from "./UI/UI_Types";
import uiSettings from "./uiSettings.json"
import ExampleUI from "../public/ExampleUI";
export enum TestEnum {
    Up,
    Down,
    Left,
    Right,
}

export default class Main {


    private preloader: PreLoader;
    private glMain: GL;


private example:ExampleUI

    private scene: Scene;
    private viewPortSize: Vec2;
    private textTexture: UITexture;

    constructor(canvas: HTMLCanvasElement) {

        this.preloader = new PreLoader(this.loadProgress.bind(this), this.init.bind(this))
        this.glMain = new GL(canvas, this.preloader, "")

       UI.setWebgl(this.glMain.gl, canvas,uiSettings);
       //UI.setWebgl(this.glMain.gl, canvas);
        this.example =new ExampleUI(this.glMain)
        this.textTexture = new UITexture();
        this.scene = new Scene(this.glMain, this.preloader)
        this.glMain.gl.clearColor(0.22, 0.25, 0.29, 1);

    }

    public loadProgress(n: number) {

    }


    init() {
        this.example.init()
        this.textTexture.setTextureGL(UI_I.renderer.textRenderer.texture.texture, Font.textureSize.x, Font.textureSize.y);
        this.step();
    }

    step() {
        window.requestAnimationFrame(() => {
            this.step();
        });
        this.update();

        this.viewPortSize = UI.pushViewport("viewport");
        this.draw();
        UI.popViewport();
        UI.draw();

    }

    update() {

        this.scene.update();
        this.example.update()

        UI.pushWindow("UI");
        UI.setLLabelSize(120)
        if (UI.LButton("Clear Local Data")) {
            UI.clearLocalData()
        }
        if (UI.LButton("Save Layout")) {

            UI.saveLocalData()
        }
        UI.LText(UI_I.numDrawCalls + "", "DrawCalls")
        UI.LTexture("atlas", this.textTexture)
        UI.setLLabelSize()
        UI.popWindow();

        UI.pushWindow("Window 1");
        UI.LText( "hello 1","Test Window")
        UI.popWindow();

        UI.pushWindow("Window 2");
        UI.LText( "hello 2","Test Window")
        UI.popWindow();
    }

    draw() {
        let gl = this.glMain.gl;
        gl.viewport(0, 0, this.viewPortSize.x, this.viewPortSize.y)
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.scene.camera.update(this.viewPortSize.x / this.viewPortSize.y)

        this.scene.draw();


    }

}
