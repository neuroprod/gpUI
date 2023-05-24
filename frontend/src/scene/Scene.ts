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
    constructor(glMain: GL, preLoader: PreLoader) {
        this.gl =glMain.gl;
        this.camera = new Camera(glMain)
        this.camera.eye[1] = 5;
        this.program = new Program(glMain)
        this.program.load('cube')
        this.box = new Box(glMain, 1, 1, 1)


        this.cubes.push(new SceneCube("Floor",new Vector3(0.00,-0.50,0.00),new Vector3(10.00,0.01,10.00),new Vector3(0.00,0.00,0.00),new Color(1.00,1.00,1.00,1)));
        this.cubes.push(new SceneCube("greyCube",new Vector3(0.00,0.00,0.00),new Vector3(1.00,1.00,1.00),new Vector3(0.00,0.00,0.00),new Color(0.48,0.48,0.48,1)));
        this.cubes.push(new SceneCube("whiteCube",new Vector3(-1.20,0.97,-0.49),new Vector3(1.00,2.97,1.00),new Vector3(0.00,-0.52,0.00),new Color(1.00,1.00,1.00,1)));
        this.cubes.push(new SceneCube("greyCube2",new Vector3(1.52,0.00,-1.99),new Vector3(1.00,1.00,2.20),new Vector3(0.00,-0.89,0.00),new Color(0.40,0.40,0.40,1)));
        this.cubes.push(new SceneCube("blackCube",new Vector3(0.08,0.46,2.41),new Vector3(1.93,1.81,1.92),new Vector3(0.00,-0.66,0.00),new Color(0.15,0.15,0.15,1)));

        this.currentCube = this.cubes[0];
    }

    update() {

        UI.pushWindow("Scene")
        UI.separator("Settings", true);
        UI.LColor("ClearColor",this.clearColor)
        this.gl.clearColor(this.clearColor.r,this.clearColor.g,this.clearColor.b,this.clearColor.a)
        if (UI.LBool("Animate Camera", true)) {
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


    }


}
