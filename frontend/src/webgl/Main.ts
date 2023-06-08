import UI_I from "../UI/UI_I";
import GL from "./glLib/GL";
import PreLoader from "../shared/PreLoader";
import UITexture from "../UI/draw/UITexture";
import Font from "../UI/draw/Font";
import Scene from "./scene/Scene";
import UI from "../UI/UI";
import uiSettings from "./uiSettings.json";
import ExampleUI from "./ExampleUI";
import { Vector4 } from "math.gl";

export enum TestEnum {
  Up,
  Down,
  Left,
  Right,
}

export default class Main {
  private preloader: PreLoader;
  private glMain: GL;

  private example: ExampleUI;

  private scene: Scene;
  private viewPort: Vector4 = new Vector4();
  private textTexture: UITexture;

  constructor(canvas: HTMLCanvasElement) {
    this.preloader = new PreLoader(
      this.loadProgress.bind(this),
      this.init.bind(this)
    );
    this.glMain = new GL(canvas, this.preloader, "");

    UI.setWebgl(this.glMain.gl, canvas, uiSettings);
    //UI.setWebgl(this.glMain.gl, canvas);
    this.example = new ExampleUI(this.glMain);
    this.textTexture = new UITexture();
    this.scene = new Scene(this.glMain, this.preloader);
    this.glMain.gl.clearColor(0.22, 0.25, 0.29, 1);
  }

  public loadProgress(n: number) {}

  init() {
    this.example.init();
    if (UI.initialized)
      this.textTexture.setTextureGL(
        UI_I.rendererGL.textRenderer.texture.texture,
        Font.textureSize.x,
        Font.textureSize.y
      );
    this.step();
  }

  step() {
    window.requestAnimationFrame(() => {
      this.step();
    });
    this.update();
    this.viewPort.set(
      0,
      0,
      this.glMain.viewportWidth,
      this.glMain.viewportHeight
    );
    UI.pushViewport("viewport", this.viewPort);
    this.draw();
    UI.popViewport();
    UI.draw();
  }

  update() {
    UI.pushWindow("UI");
    UI.setLLabelSize(120);
    if (UI.LButton("Clear Local Data")) {
      UI.clearLocalData();
    }
    if (UI.LButton("Save Layout")) {
      UI.saveLocalData();
    }
    UI.LText(UI_I.numDrawCalls + "", "DrawCalls");
    UI.LTexture("atlas", this.textTexture);
    UI.setLLabelSize();
    UI.popWindow();

    UI.pushWindow("Window 1");
    UI.LText("hello 1", "Test Window");
    UI.popWindow();

    UI.pushWindow("Window 2");
    UI.LText("hello 2", "Test Window");
    UI.popWindow();

    this.scene.update(this.viewPort);
    this.example.update();
  }

  draw() {
    let gl = this.glMain.gl;

    gl.viewport(
      this.viewPort.x,
      this.viewPort.y,
      this.viewPort.z,
      this.viewPort.w
    );
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.scene.draw();
  }
}
