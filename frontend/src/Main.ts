import UI_I from "./UI/UI_I";

import Color from "./UI/math/Color";
import GL from "./glLib/GL";
import PreLoader from "./glLib/PreLoader";

import UITexture from "./UI/draw/UITexture";
import Texture from "./glLib/Texture";
import Font from "./UI/draw/Font";
import UI from "./UI/UI";
import Scene from "./scene/Scene";
import SelectItem from "./UI/math/SelectItem";


export default class Main {


    private preloader: PreLoader;
    private glMain: GL;


    private color1: Color = new Color(0.88, 0.73, 0.038, 1.0);
    private color2: Color = new Color(0.43, 0.64, 0.22, 0.80);

    private myFloat = 0.5;
    private myBool = false;
    private myText = "hello Tokyo"

    private parrotTextureGL: Texture;
    private parrotTexture: UITexture;
    private textTexture: UITexture;

    private scene: Scene;


    constructor(canvas: HTMLCanvasElement) {

        this.preloader = new PreLoader(this.loadProgress.bind(this), this.init.bind(this))
        this.glMain = new GL(canvas, this.preloader, "")


        UI.setWebgl(this.glMain.gl, canvas);


        this.textTexture = new UITexture();


        this.parrotTextureGL = new Texture(this.glMain);
        this.parrotTextureGL.load("test.png");
        this.parrotTexture = new UITexture();


        this.scene = new Scene(this.glMain, this.preloader)
        this.glMain.gl.clearColor(0.22, 0.25, 0.29,1);
    }

    public loadProgress(n: number) {

    }


    init() {
        this.parrotTexture.setTextureGL(this.parrotTextureGL.texture, this.parrotTextureGL.width, this.parrotTextureGL.height);
        this.textTexture.setTextureGL(UI_I.renderer.textRenderer.texture.texture, Font.textureSize.x, Font.textureSize.y);
        this.step();
    }

    step() {
        window.requestAnimationFrame(() => {
            this.step();
        });
        this.update();


        UI.pushViewport("viewport")
      this.draw();
        UI.popViewport();


        UI.draw();

    }

    update() {

        this.scene.update();

        UI.pushWindow("Examples");

        //button
        if (UI.LButton("Press Me!", "button")) {
            console.log("Thanks!")
        }
        if (UI.LButton("Press Me 2!")) {
            console.log("Thanks!")
        }

        //text
        UI.LText("hello world " + this.myFloat, "text")
        UI.LText("Een lange lap tekst of kort en bondig? De woorden zeggen het al: 'een lange lap' klinkt saai, terwijl 'kort en bondig' vlot overkomt. Maar betekent dat dat je lange teksten dan altijd moet vermijden?", "multiline", true)
        UI.LTextInput("input text", this, "myText")
        //booleans
        if (UI.LBool(this, "myBool")) {
            UI.setIndent(20)
            if (UI.LBool("animate myFloat", false)) {
                this.myFloat = Math.cos(Date.now() / 1000);
            }
        }
        let selectArray =[new SelectItem("item1",1),new SelectItem("item2",2),new SelectItem("item3",3),new SelectItem("item4",4)];
        UI.LSelect("select",selectArray,0)




        UI.pushGroup("Sliders")

        //sliders
        let a = UI.LFloatSlider("localVal", 2);
        UI.LFloatSlider(this, "myFloat", -1, 1);
        UI.LIntSlider("intSlider", 5.5, 0, 10);
        UI.popGroup()

        UI.pushGroup("Colors")
        //color
        UI.LColor("color1", this.color1);
        UI.LColor("color2", this.color2)

        UI.LTexture("mijnTexture", this.parrotTexture)
        UI.popGroup()


        UI.popWindow();

        UI.pushWindow("UI");
        UI.setLLabelSize(130)
        if (UI.LButton("Clear", "Local Data")) {
            UI.clearLocalData()
        }
        UI.LText(UI_I.numDrawCalls + "", "UI DrawCalls")
        UI.LTexture("atlas", this.textTexture)
        UI.setLLabelSize()

        UI.popWindow();


    }

    draw() {
        let gl = this.glMain.gl;
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.scene.draw();


    }

}
