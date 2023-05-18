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
import Vec2 from "./UI/math/Vec2";
import UIUtils from "./UI/UIUtils";

 export enum TestEnum {
    Up,
    Down,
    Left,
    Right,
}

export default class Main {


    private preloader: PreLoader;
    private glMain: GL;


    private color1: Color = new Color(0.88, 0.73, 0.038, 1.0);
    private color2: Color = new Color(0.43, 0.64, 0.22, 0.80);

    private myFloat = 0.5;
    private myFloat2 = 0.5;
    private myBool = false;
    private myText = "hello Tokyo"

    private parrotTextureGL: Texture;
    private parrotTexture: UITexture;
    private textTexture: UITexture;

    private scene: Scene;
    private viewPortSize: Vec2;


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

        this.viewPortSize =UI.pushViewport("viewport");
        this.draw();
        UI.popViewport();

        UI.draw();

    }

    update() {

        this.scene.update();

        UI.pushWindow("Examples");
        //text
        UI.LText("hello world " + this.myFloat, "label dit is een fucking long label")
        UI.LText("Een lange lap tekst of kort en bondig? De woorden zeggen het al: 'een lange lap' klinkt saai, terwijl 'kort en bondig' vlot overkomt. Maar betekent dat dat je lange teksten dan altijd moet vermijden?", "multiline", true)
        UI.LTextInput("input text", this, "myText")

        UI.separator("separator1 ",false)
        if (UI.LButton("Press Me!", "button")) {
            console.log("Thanks!")
        }
        if (UI.LButton("Press Me 2!")) {
            console.log("Thanks!")
        }



        UI.separator("Boolean" )
        if (UI.LBool(this, "myBool")) {
            UI.setIndent(20)
            if (UI.LBool("animate myFloat", false)) {
                this.myFloat = Math.cos(Date.now() / 1000);
            }
            UI.setIndent(0)
        }

        UI.separator("Selection" )
        //select
        let t:TestEnum =UI.LSelect("Enum",  UIUtils.EnumToSelectItem(TestEnum),0)

        let selectArray =[];
        for(let i=0;i<100;i++)
        {
            selectArray.push( new SelectItem("item"+i,i))
        }

        let selectedItem =UI.LSelect("select",selectArray,0)
        UI.LText("selected item: "+selectedItem );




        UI.pushGroup("Numbers")

        let a = UI.LFloatSlider("localVal", 2);
        UI.LFloatSlider(this, "myFloat", -1, 1);
        UI.LIntSlider("intSlider", 6, 0, 10);

        UI.separator("Drag/Input")
        UI.LFloat(this, "myFloat2");
        UI.floatPrecision =4;
        UI.LFloat("testP", 0.001);
        UI.floatPrecision =2;
        UI.separator("Input")
        UI.LTextInput("iFloat", "2")
        UI.LTextInput("iInt","2.5")
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

        UI.pushWindow("1TestWindow1");
        UI.LText( "1TestWindow1")
        UI.popWindow();

        UI.pushWindow("2TestWindow2");
        UI.LText( "2TestWindow2")
        UI.popWindow();
    }

    draw() {
        let gl = this.glMain.gl;
        gl.viewport(0,0,this.viewPortSize.x,this.viewPortSize.y)
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.scene.camera.update(this.viewPortSize.x/this.viewPortSize.y)

        this.scene.draw();


    }

}
