import GL from "../glLib/GL";
import PreLoader from "../glLib/PreLoader";
import Camera from "../glLib/Camera";
import Program from "../glLib/Program";
import Box from "../glLib/Box";
import UI from "../UI/UI";
import {Vector3} from "math.gl";
import SceneCube from "./SceneCube";
import Color from "../UI/math/Color";
import UI_IC from "../UI/UI_IC";
import FBO from "../glLib/FBO";
import Quad from "../glLib/Quad";

export default class Scene {
    public camera: Camera;
    private program: Program;
    private box: Box;


    private lightDir = new Vector3(0.637652, 0.701245, 0.318834)
    private angle = 0;
    private cubes: Array<SceneCube> = [];
    private currentCube: SceneCube | null;
    private gl: WebGL2RenderingContext;

    private clearColor:Color =new Color(0.38,0.35,0.32,1.00)
    private testFBO: FBO;
    private glMain: GL;

    private programBlack:Program;
    private programEdge: Program;
    private quad:Quad;
    constructor(glMain: GL, preLoader: PreLoader) {
        this.gl =glMain.gl;
        this.glMain =glMain;
        this.camera = new Camera(glMain)
        this.camera.eye[1] = 5;
        this.program = new Program(glMain)
        this.program.load('cube')

        this.programBlack =new Program(glMain)
        this.programBlack.load('black')

        this.programEdge =new Program(glMain)
        this.programEdge.load('edge')

        this.quad =new Quad(this.glMain)

        this.box = new Box(glMain, 1, 1, 1)


        this.cubes.push(new SceneCube("Floor",new Vector3(0.00,-0.50,0.00),new Vector3(10.00,0.01,10.00),new Vector3(0.00,0.00,0.00),new Color(1.00,1.00,1.00,1)));
        this.cubes.push(new SceneCube("greyCube",new Vector3(-2.26,0.44,1.04),new Vector3(1.00,2.02,2.00),new Vector3(0.00,-0.76,0.00),new Color(0.48,0.48,0.48,1)));
        this.cubes.push(new SceneCube("whiteCube",new Vector3(-0.60,1.84,1.59),new Vector3(1.00,2.97,1.00),new Vector3(0.93,-0.30,2.31),new Color(1.00,1.00,1.00,1)));
        this.cubes.push(new SceneCube("greyCube2",new Vector3(1.75,1.57,0.63),new Vector3(1.00,5.78,2.20),new Vector3(0.00,-0.89,0.00),new Color(0.42,0.36,0.36,1)));
        this.cubes.push(new SceneCube("blackCube",new Vector3(0.92,0.56,2.41),new Vector3(1.98,2.87,1.92),new Vector3(0.00,-0.66,0.00),new Color(0.15,0.15,0.15,1)));

        this.currentCube = this.cubes[0];

        this.testFBO =new FBO(glMain,1,1);
        this.camera.eye[0] = Math.sin(this.angle) * 10;
        this.camera.eye[2] = Math.cos(this.angle) * 10;

    }

    update() {



        UI.pushWindow("Scene")
        UI.separator("Settings", true);
        UI.LColor("ClearColor",this.clearColor)

        if (UI.LBool("Animate Camera", false)) {
            this.angle += 0.01
            this.camera.eye[0] = Math.sin(this.angle) * 10;
            this.camera.eye[2] = Math.cos(this.angle) * 10;
        }
        UI.LVector("light Dir", this.lightDir, true)
        UI.separator("myCubes", true);
        UI.pushLList("Cubes", 100);
        let count = 0;
        for (let cube of this.cubes) {
            if (UI.LListItem(count + ':' + cube.name, cube == this.currentCube)) {
                this.currentCube = cube;
            }
            count++
        }
        UI.popList()
        if (UI.LButton("+ Add Cube")) {
            this.currentCube = new SceneCube("new Cube");
            this.cubes.push(this.currentCube);
        }
        if (UI.LButton("Generate Code")) {
            let code = ""
            for (let cube of this.cubes) {
                code += cube.generateCode();
            }
            navigator.clipboard.writeText(code).then(() => {
                UI_IC.logEvent('Copy', "Code to clipboard")

            }, function (err) {
                UI_IC.logEvent('Copy', "Async: Could not copy to clipboard:" + err, true)

            });

        }
        UI.separator("currentCube", true);
        this.currentCube.drawUI();
        UI.popWindow()


        this.testFBO.resize(this.glMain.viewportWidth,this.glMain.viewportHeight)
        this.testFBO.bind()
        this.programBlack.bind()
        this.glMain.gl.clearColor(1,1,1,1);
        this.glMain.gl.clear( this.glMain.gl.COLOR_BUFFER_BIT)
        this.programBlack.uniformMatrix4fv("projection", this.camera.perspectiveMatrix)
        this.programBlack.uniformMatrix4fv("view", this.camera.viewMatrix)
        this.programBlack.uniformMatrix4fv("model", this.currentCube.model)
        this.box.draw(this.programBlack)
        this.programBlack.unBind()
        this.testFBO.unbind()
        this.gl.clearColor(this.clearColor.r,this.clearColor.g,this.clearColor.b,this.clearColor.a)
    }

    draw() {

        UI.pushWindow("Scene")
        UI.separator("Draw", true);
        UI.LText("this is in the draw methode","test")
        UI.popWindow()





        this.program.bind()
        this.program.uniform3fv("lightDir", this.lightDir)
        this.program.uniformMatrix4fv("projection", this.camera.perspectiveMatrix)
        this.program.uniformMatrix4fv("view", this.camera.viewMatrix)
        for (let cube of this.cubes) {
            this.program.uniformMatrix4fv("model", cube.model)
            this.program.uniform4fv("color", cube.color.getArray())
            this.box.draw(this.program)
        }
        this.program.unBind()

      this.programEdge.bind()
        this.testFBO.bindtexture(this.gl.TEXTURE0);
        this.programEdge.uniform2fv("screen",[this.glMain.viewportWidth*0.5,this.glMain.viewportHeight*0.5]);

        this.programEdge.uniform3fv("kernel",[1.0,1.0,0.5,-1.0,-1.0,0.5, -1.0,1.0,0.5,1.0,-1.0,0.5,1.0,0.0,1.0,-1.0,0.0,1.0,0.0,1.0,1.0,0.0,-1.0,1.0]);
        this.programEdge.uniform1i("texture",0);
        this.quad.draw(this.programEdge);
        this.programEdge.unBind()
    }


}
