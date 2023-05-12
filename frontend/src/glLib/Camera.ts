import {mat4, vec3} from "gl-matrix";
import GL from "./GL";

export default class Camera{
    public perspectiveMatrix: mat4;
    public viewMatrix: mat4;
    public eye: vec3;
    public target: vec3;
    public up: vec3;
    private gl: WebGL2RenderingContext;
    constructor(glMain:GL) {

        this.gl =glMain.gl
        this.perspectiveMatrix = mat4.create();
        this.viewMatrix = mat4.create();

        this.eye = vec3.fromValues(0, 0, 5);
        this.target = vec3.fromValues(0, 0, 0);
        this.up = vec3.fromValues(0, 1, 0);

    }
    update()
    {
        let vp =this.gl.getParameter(this.gl.VIEWPORT);
        let ratio =vp[2]/vp[3];
        mat4.lookAt(this.viewMatrix, this.eye, this.target, this.up);
        mat4.perspective(this.perspectiveMatrix, 1, ratio, 0.1, 100);
    }
}
