export default class Program {
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
