import UITexture from "../draw/UITexture";
import UI_I from "../UI_I";
import FBO from "./FBO";
import Quad from "./Quad";
import Program from "./Program";



export default class ShaderTextureGL extends UITexture {
    public fbo: FBO;
    public quad: Quad;
    public program: Program;
    public gl: WebGL2RenderingContext | WebGLRenderingContext;

    constructor(width: number, height: number,repeat:boolean =false) {
        super();
        this.width = width;
        this.height = height;
        this.size.set(this.width,this.height)
        this.gl = UI_I.renderer.gl;
        this.fbo = new FBO(UI_I.renderer.gl, width, height,repeat)
        this.quad = new Quad(UI_I.renderer.gl);
        this.program = new Program(UI_I.renderer.gl)
        this.program.setShaders(this.getVertexShader(), this.getFragmentShader())
       // this.draw()

    }

    draw() {
        this.fbo.bind();
        this.program.bind();
        this.quad.draw(this.program)
        this.fbo.unbind();
        this.program.unBind();
        UI_I.numDrawCalls++;
    }

    getVertexShader(): string {
        let vertex = "\n" +
            "attribute  vec3 aVertex;\n" +
            "attribute  vec2 aUV0;\n" +

            "varying vec2 vUV;\n" +

            "void main(void) {\n" +

            "vec3 inPos  = aVertex;\n" +
            "vUV =aUV0;\n" +
            "gl_Position  = vec4(inPos,1.0);\n" +
            " \n" +
            "}";


        return vertex;
    }

    getFragmentShader(): string {
        let fragment = "precision lowp float;\n" +
            " varying vec2 vUV;\n" +
            " void main(void){\n" +
            " gl_FragColor=vec4( vUV,0.0,1.0);\n" +
            " \n" +
            "}";
        return fragment
    }

    getTextureGL() {

        return this.fbo.texture;
    }


}
