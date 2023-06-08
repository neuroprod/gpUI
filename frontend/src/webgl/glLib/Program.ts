import GL from "./GL";

export default class Program {
  private glMain: GL;
  private path: string;
  private gl: WebGL2RenderingContext;
  private vertex: string;
  private fragment: string;

  private defines: string;
  private map: Map<string, WebGLUniformLocation>;

  program: WebGLProgram;
  private vertexShader: WebGLShader;
  private fragmentShader: WebGLShader;

  vertexAttribute: GLint;
  normalAttribute: GLint;

  uvAttribute0: GLint;
  uvAttribute1: GLint;
  uvAttribute2: GLint;
  uvAttribute3: GLint;
  uvAttribute4: GLint;
  instPosAttribute: GLint;
  instDataAttribute: GLint;

  constructor(glMain: GL) {
    this.glMain = glMain;
    this.path = glMain.assetPath;
    this.gl = glMain.gl;
    this.vertex = "";
    this.fragment = "";
    this.program = null;
    this.defines = "";
    this.map = new Map();
  }

  uniformMatrix4fv(name, value) {
    if (this.program) {
      if (this.map.has(name)) {
        this.gl.uniformMatrix4fv(this.map.get(name), false, value);
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
        this.gl.uniform1i(this.map.get(name), value);
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
        this.gl.uniform1f(this.map.get(name), value);
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
        this.gl.uniform1fv(this.map.get(name), value);
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
        this.gl.uniform3fv(this.map.get(name), value);
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
        this.gl.uniform4fv(this.map.get(name), value);
      } else {
        var loc = this.gl.getUniformLocation(this.program, name);
        this.map.set(name, loc);
        this.gl.uniform4fv(loc, value);
      }
    }
  }
  uniform2f(name, valueX, valueY) {
    if (this.program) {
      if (this.map.has(name)) {
        this.gl.uniform2f(this.map.get(name), valueX, valueY);
      } else {
        var loc = this.gl.getUniformLocation(this.program, name);
        this.map.set(name, loc);
        this.gl.uniform2f(loc, valueX, valueY);
      }
    }
  }
  uniform2fv(name, value) {
    if (this.program) {
      if (this.map.has(name)) {
        this.gl.uniform2fv(this.map.get(name), value);
      } else {
        var loc = this.gl.getUniformLocation(this.program, name);
        this.map.set(name, loc);
        this.gl.uniform2fv(loc, value);
      }
    }
  }

  addDefine(defstring: string) {
    this.defines += "#define " + defstring + "/n";
  }

  load(shader: string) {
    this.loadShader(
      "vertex",
      this.path + "shaders/" + shader + "/" + shader + ".vs.glsl"
    );
    this.loadShader(
      "fragment",
      this.path + "shaders/" + shader + "/" + shader + ".fs.glsl"
    );
  }

  bind() {
    if (this.program) {
      const gl = this.gl;
      gl.useProgram(this.program);
      if (this.vertexAttribute != -1) {
        gl.enableVertexAttribArray(this.vertexAttribute);
      }

      if (this.normalAttribute != -1) {
        gl.enableVertexAttribArray(this.normalAttribute);
      }

      if (this.uvAttribute0 != -1) {
        gl.enableVertexAttribArray(this.uvAttribute0);
      }
      if (this.uvAttribute1 != -1) {
        gl.enableVertexAttribArray(this.uvAttribute1);
      }
      if (this.uvAttribute2 != -1) {
        gl.enableVertexAttribArray(this.uvAttribute2);
      }
      if (this.uvAttribute3 != -1) {
        gl.enableVertexAttribArray(this.uvAttribute3);
      }
      if (this.uvAttribute4 != -1) {
        gl.enableVertexAttribArray(this.uvAttribute4);
      }
      if (this.instPosAttribute != -1) {
        gl.enableVertexAttribArray(this.instPosAttribute);
      }
      if (this.instDataAttribute != -1) {
        gl.enableVertexAttribArray(this.instDataAttribute);
      }
    }
  }
  unBind() {
    const gl = this.gl;
    if (this.vertexAttribute != -1) {
      gl.disableVertexAttribArray(this.vertexAttribute);
    }

    if (this.normalAttribute != -1) {
      gl.disableVertexAttribArray(this.normalAttribute);
    }

    if (this.uvAttribute0 != -1) {
      gl.disableVertexAttribArray(this.uvAttribute0);
    }
    if (this.uvAttribute1 != -1) {
      gl.disableVertexAttribArray(this.uvAttribute1);
    }
    if (this.uvAttribute2 != -1) {
      gl.disableVertexAttribArray(this.uvAttribute2);
    }
    if (this.uvAttribute3 != -1) {
      gl.disableVertexAttribArray(this.uvAttribute3);
    }
    if (this.uvAttribute4 != -1) {
      gl.disableVertexAttribArray(this.uvAttribute4);
    }
    if (this.instPosAttribute != -1) {
      gl.disableVertexAttribArray(this.instPosAttribute);
    }
    if (this.instDataAttribute != -1) {
      gl.disableVertexAttribArray(this.instDataAttribute);
    }
  }
  loadShader(type, name) {
    this.glMain.preLoader.startLoad();
    var client = new XMLHttpRequest();
    client.open("GET", name);
    client.onreadystatechange = () => {
      if (client.readyState == 4) {
        if (type == "fragment") {
          this.fragment = client.responseText;
        }
        if (type == "vertex") {
          this.vertex = client.responseText;
        }
        this.glMain.preLoader.stopLoad();
        this.compileProgram();
      }
    };
    client.send();
  }
  setShaders(vert: string, frag: string, defines = "") {
    this.vertex = defines + vert;
    this.fragment = defines + frag;
    this.compileProgram();
  }
  compileProgram() {
    if (this.vertex == "" || this.fragment === "") return;

    const gl = this.gl;

    this.vertexShader = this.compileShader(this.vertex, gl.VERTEX_SHADER);
    this.fragmentShader = this.compileShader(this.fragment, gl.FRAGMENT_SHADER);

    this.program = gl.createProgram();
    gl.attachShader(this.program, this.vertexShader);
    gl.attachShader(this.program, this.fragmentShader);

    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.log("Could not initialise shaders ");
    }
    gl.useProgram(this.program);
    this.vertexAttribute = gl.getAttribLocation(this.program, "aVertex");
    this.normalAttribute = gl.getAttribLocation(this.program, "aNormal");

    this.uvAttribute0 = gl.getAttribLocation(this.program, "aUV0");
    this.uvAttribute1 = gl.getAttribLocation(this.program, "aUV1");
    this.uvAttribute2 = gl.getAttribLocation(this.program, "aUV2");
    this.uvAttribute3 = gl.getAttribLocation(this.program, "aUV3");
    this.uvAttribute4 = gl.getAttribLocation(this.program, "aUV4");
    this.instPosAttribute = gl.getAttribLocation(this.program, "aInstPosition");
    this.instDataAttribute = gl.getAttribLocation(this.program, "aInstData");
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
