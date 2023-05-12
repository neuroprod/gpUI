import GL from "../glLib/GL";
import PreLoader from "../glLib/PreLoader";
import Camera from "../glLib/Camera";
import Program from "../glLib/Program";
import Box from "../glLib/Box";
import {mat4} from "gl-matrix";

export default class Scene
{
    private camera: Camera;
    private program: Program;
    private box: Box;
    private model: mat4;


    constructor(glMain:GL,preLoader:PreLoader) {
        this.camera =new Camera(glMain)
        this.program =new Program(glMain)
        this.program.load('cube')
        this.box =new Box(glMain,1,1,1)
        this.model = mat4.create()

    }
    update()
    {
        mat4.rotateX(this.model,this.model,0.01)
        mat4.rotateY(this.model,this.model,0.0133)
        mat4.rotateZ(this.model,this.model,0.02)
    }
    draw()
    {
        this.camera.update()

        this.program.bind()
        this.program.uniformMatrix4fv("projection",this.camera.perspectiveMatrix)
        this.program.uniformMatrix4fv("view",this.camera.viewMatrix)
        this.program.uniformMatrix4fv("model",this.model)
        this.box.draw(this.program)
        this.program.unBind()


    }






}
