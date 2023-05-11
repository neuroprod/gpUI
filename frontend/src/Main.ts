import UI_I from "./UI/UI_I";

import Color from "./UI/math/Color";
import GL from "./GL/GL";
import PreLoader from "./GL/PreLoader";
import Quad from "./GL/Quad";
import Program from "./GL/Program";
import FBO from "./GL/FBO";
import UITexture from "./UI/draw/UITexture";
import Texture from "./GL/Texture";
import Font from "./UI/draw/Font";
import UI from "./UI/UI";


export default class Main {




    private preloader: PreLoader;
    private glMain: GL;
    private quad: Quad;
    private program: Program;
    private fbo: FBO;

    private color1: Color =new Color(0.88,0.73,0.038,1.0);
    private color2: Color =new Color(0.43,0.64,0.22,0.80);
    private clearColor: Color =new Color(0.22,0.25,0.29,1);
    private myFloat =0.5;
    private myBool =false;
    private parrotTextureGL: Texture;
    private parrotTexture: UITexture;

    private textTexture: UITexture;
    private viewportTexture: UITexture;

    private canvas: HTMLCanvasElement;


    constructor(canvas: HTMLCanvasElement) {

        this.preloader = new PreLoader(this.loadProgress.bind(this), this.init.bind(this))
        this.glMain = new GL(canvas, this.preloader, "")

        this.canvas =canvas;
        UI.setWebgl(this.glMain.gl, canvas);
        this.quad = new Quad(this.glMain)
        this.program = new Program(this.glMain);
        this.program.load("test")

        this.fbo = new FBO(this.glMain, 100, 100);


        this.textTexture = new UITexture();


        this.parrotTextureGL = new Texture(this.glMain);
        this.parrotTextureGL.load("test.png");
        this.parrotTexture = new UITexture();



        UI.setWebgl(this.glMain.gl, canvas);
    }

    public loadProgress(n: number) {

    }


    init() {
        this.parrotTexture.setTextureGL(this.parrotTextureGL.texture,this.parrotTextureGL.width,this.parrotTextureGL.height);
        this.textTexture.setTextureGL(UI_I.renderer.textRenderer.texture.texture,Font.textureSize.x,Font.textureSize.y);
        this.step();
    }

    step() {
        window.requestAnimationFrame(() => {
            this.step();
        });
        this.update();
        this.draw();
        UI.draw();
    }

    update() {

        UI.pushWindow("Examples");

        //button
        if( UI.LButton("Press Me!","button")){console.log("Thanks!")}
        if( UI.LButton("Press Me 2!")){console.log("Thanks!")}

        //text
        UI.LText( "hello world "+this.myFloat ,"text")
        UI.LText("Een lange lap tekst of kort en bondig? De woorden zeggen het al: 'een lange lap' klinkt saai, terwijl 'kort en bondig' vlot overkomt. Maar betekent dat dat je lange teksten dan altijd moet vermijden?","multiline",true)

        //booleans
        if(UI.LBool(this,"myBool")){
            UI.setIndent(20)
            if (UI.LBool("animate myFloat", false)) {
                this.myFloat = Math.cos(Date.now() / 1000);
            }
        }


        UI.pushGroup("Sliders")

        //sliders
        let a = UI.LFloatSlider("localVal",2);
        UI.LFloatSlider(this,"myFloat",-1,1);
        UI.LIntSlider("intSlider",5.5,0,10);
        UI.popGroup()

        UI.pushGroup("Colors")
        //color
        UI.LColor("color1",this.color1);
        UI.LColor("color2",this.color2)
        UI.LColor("clearColor",this.clearColor)
        UI.LTexture("mijnTexture",this.parrotTexture)
        UI.popGroup()


        UI.popWindow();

        UI.pushWindow("UI");
        UI.LText( this.glMain.viewportWidth + "px - " + this.glMain.viewportHeight+"px" ,"viewport")
        UI.LText( UI_I.numDrawCalls+"" ,"UI DrawCalls")
        UI.LText( UI_I.processingTime+"ms" ,"UI time")
        UI.LTexture("atlas",this.textTexture)
        if( UI.LButton("test","test")){console.log("Thanks!")}
        if( UI.LButton("test","test2")){console.log("Thanks!")}
        if( UI.LButton("test","test3")){console.log("Thanks!")}
        if( UI.LButton("test","test4")){console.log("Thanks!")}
        if( UI.LButton("test","test5")){console.log("Thanks!")}

        UI.popWindow();



    }

    draw() {
        let gl = this.glMain.gl;
        gl.clearColor(this.clearColor.r, this.clearColor.g, this.clearColor.b, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);


        /* this.program.bind()
         this.quad.draw(this.program);
         this.program.unBind()*/
//console.log("draw",this.canvas)


    }

}
