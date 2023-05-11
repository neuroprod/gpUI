import UITexture from "../draw/UITexture";
import UI_I from "../UI_I";

class FBO {
    public texture: WebGLTexture;

    private gl: WebGL2RenderingContext | WebGLRenderingContext;

    private width: number;
    private height: number;

    private fbo: WebGLFramebuffer;
    private renderbuffer: WebGLRenderbuffer;
    private _resizeTimeOut: NodeJS.Timeout;


    constructor(gl: WebGL2RenderingContext | WebGLRenderingContext, width = 1, height = 1,) {

        this.gl = gl;
        this.width = width;

        this.height = height;


        this.makeBuffers();

    }

    makeBuffers() {
        let gl = this.gl;
        this.fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);

        this.texture = this.gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.bindTexture(gl.TEXTURE_2D, null);

        this.renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);


        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);


    }

    resize(width, height) {
        if (this.width == width && this.height == height) return;
        this.width = width;
        this.height = height;

        this.destroy();
        this.makeBuffers();
    }

    delayedResize(width, height) {
        if (this.width == width && this.height == height) return;
        this.width = width;
        this.height = height;
        clearTimeout(this._resizeTimeOut);
        this._resizeTimeOut = setTimeout(() => {
            this.destroy();
            this.makeBuffers()
        }, 100);

    }

    bind() {
        let gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
        gl.viewport(0, 0, this.width, this.height);

    }

    unbind() {
        let gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    }

    destroy() {
        let gl = this.gl;
        gl.deleteRenderbuffer(this.renderbuffer)
        gl.deleteTexture(this.texture)
        gl.deleteFramebuffer(this.fbo);

    }

}

class Quad {
    private gl: WebGL2RenderingContext | WebGLRenderingContext;
    private planeVertexBuffer: WebGLBuffer;
    private PlaneUVBuffer: WebGLBuffer;


    constructor(gl: WebGL2RenderingContext | WebGLRenderingContext) {
        this.gl = gl;
        this.planeVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.planeVertexBuffer);
        const vertices = [-1.0, -1.0, 0.0, -1.0, 1.0, 0.0,
            1.0, -1.0, 0.0,
            1.0, 1.0, 0.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        this.PlaneUVBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.PlaneUVBuffer);
        const textureCoords = [

            0.0, 0.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0,

        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);

    }


    draw(program) {
        if (program.program) {
            let gl = this.gl;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.planeVertexBuffer);
            gl.vertexAttribPointer(program.vertexAttribute, 3, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.PlaneUVBuffer);
            gl.vertexAttribPointer(program.uvAttribute0, 2, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);


        }

    }

}

class Program {
    private gl: WebGL2RenderingContext | WebGLRenderingContext;


    private vertex: string;
    private fragment: string;

    private defines: string;
    private map: Map<string, WebGLUniformLocation>;

    private program: WebGLProgram;
    private vertexShader: WebGLShader;
    private fragmentShader: WebGLShader;

    private vertexAttribute: GLint;
    private uvAttribute0: GLint;


    constructor(gl: WebGL2RenderingContext | WebGLRenderingContext) {
        this.gl = gl;

        this.vertex = "";
        this.fragment = "";
        this.program = null;
        this.defines = "";
        this.map = new Map();

    }

    uniformMatrix4fv(name, value) {
        if (this.program) {
            if (this.map.has(name)) {
                this.gl.uniformMatrix4fv(this.map.get(name), false, value)
            } else {
                let loc = this.gl.getUniformLocation(this.program, name);
                this.map.set(name, loc);
                this.gl.uniformMatrix4fv(loc, false, value);

            }

        }
    }

    uniform1i(name, value) {
        if (this.program) {
            if (this.map.has(name)) {

                this.gl.uniform1i(this.map.get(name), value)
            } else {
                var loc = this.gl.getUniformLocation(this.program, name);
                this.map.set(name, loc);
                this.gl.uniform1i(loc, value);

            }

        }
    }

    uniform1f(name, value) {
        if (this.program) {
            if (this.map.has(name)) {

                this.gl.uniform1f(this.map.get(name), value)
            } else {
                var loc = this.gl.getUniformLocation(this.program, name);
                this.map.set(name, loc);
                this.gl.uniform1f(loc, value);

            }

        }
    }

    uniform1fv(name, value) {
        if (this.program) {
            if (this.map.has(name)) {

                this.gl.uniform1fv(this.map.get(name), value)
            } else {
                var loc = this.gl.getUniformLocation(this.program, name);
                this.map.set(name, loc);
                this.gl.uniform1fv(loc, value);

            }

        }
    }

    uniform3fv(name, value) {

        if (this.program) {
            if (this.map.has(name)) {

                this.gl.uniform3fv(this.map.get(name), value)
            } else {
                var loc = this.gl.getUniformLocation(this.program, name);
                this.map.set(name, loc);
                this.gl.uniform3fv(loc, value);

            }

        }
    }
    uniform4fv(name, value) {

        if (this.program) {
            if (this.map.has(name)) {

                this.gl.uniform4fv(this.map.get(name), value)
            } else {
                var loc = this.gl.getUniformLocation(this.program, name);
                this.map.set(name, loc);
                this.gl.uniform4fv(loc, value);

            }

        }
    }
    uniform2fv(name, value) {
        if (this.program) {
            if (this.map.has(name)) {

                this.gl.uniform2fv(this.map.get(name), value)
            } else {
                var loc = this.gl.getUniformLocation(this.program, name);
                this.map.set(name, loc);
                this.gl.uniform2fv(loc, value);

            }

        }
    }


    bind() {
        if (this.program) {
            const gl = this.gl;
            gl.useProgram(this.program);
            if (this.vertexAttribute != -1) {
                gl.enableVertexAttribArray(this.vertexAttribute);
            }


            if (this.uvAttribute0 != -1) {
                gl.enableVertexAttribArray(this.uvAttribute0);

            }

        }
    }

    unBind() {
        const gl = this.gl;
        if (this.vertexAttribute != -1) {
            gl.disableVertexAttribArray(this.vertexAttribute);
        }


        if (this.uvAttribute0 != -1) {
            gl.disableVertexAttribArray(this.uvAttribute0);

        }

    }

    setShaders(vert: string, frag: string) {
        this.vertex = vert;
        this.fragment = frag;
        this.compileProgram();
    }

    compileProgram() {


        const gl = this.gl;

        this.vertexShader = this.compileShader(this.vertex, gl.VERTEX_SHADER);
        this.fragmentShader = this.compileShader(this.fragment, gl.FRAGMENT_SHADER);


        this.program = gl.createProgram();

        gl.attachShader(this.program, this.vertexShader);
        gl.attachShader(this.program, this.fragmentShader);

        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.log("Could not initialise shaders ");
            console.log(this.vertex)
            console.log(this.fragment)
        }
        gl.useProgram(this.program);


        this.vertexAttribute = gl.getAttribLocation(this.program, "aVertex");
        this.uvAttribute0 = gl.getAttribLocation(this.program, "aUV0");


    }

    compileShader(text, type): WebGLShader {
        const gl = this.gl;


        let shader = gl.createShader(type);

        gl.shaderSource(shader, text);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log("shader error " + type + " " + gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

}

export default class ShaderTextureGL extends UITexture {
    public fbo: FBO;
    public quad: Quad;
    public program: Program;

    constructor(width: number, height: number) {
        super();
        this.width = width;
        this.height = height;
        this.size.set(this.width,this.height)
        this.fbo = new FBO(UI_I.renderer.gl, width, height)
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
