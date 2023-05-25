import ShaderTextureGL from "./ShaderTextureGL";
import UI_I from "../UI_I";

export default class ColorPickerTextureGL extends ShaderTextureGL {
    private tl = [0, 0, 0, 0];
    private tr = [0, 0, 0, 0];
    private bl = [0, 0, 0, 0];
    private br = [0, 0, 0, 0];
    private gridsize: number;

    constructor(width: number, height: number,repeat:boolean,gridSize:number,tl: Array<number>= [0, 0, 0, 0], tr: Array<number>= [0, 0, 0, 0], bl: Array<number>= [0, 0, 0, 0], br: Array<number>= [0, 0, 0, 0]) {
        super(width, height,repeat);
        this.gridsize =gridSize;
        this.tl =tl;
        this.tr =tr;
        this.bl =bl;
        this.br =br;
        this.draw();
    }

    draw() {

        this.fbo.bind();
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT)
        this.program.bind();
        this.program.uniform4fv("tl",this.bl);
        this.program.uniform4fv("tr",this.br);
        this.program.uniform4fv("bl",this.tl);
        this.program.uniform4fv("br",this.tr);
        this.program.uniform1f("gridSize",this.gridsize);
        this.program.uniform2fv("size",this.size.getArray());
        this.quad.draw(this.program)
        this.program.unBind();
        this.fbo.unbind();

        UI_I.numDrawCalls++;
    }

    setColorsHSL(tl: Array<number>, tr: Array<number>, bl: Array<number>, br: Array<number>) {
        this.tl = tl;
        this.bl = bl;
        this.tr = tr;
        this.br = br;

        this.draw()
    }
    setHSL(h: number,s: number,l: number)
    {
        this.setIndexVal(0,h);
        this.setIndexVal(1,s);
        this.setIndexVal(2,l);
        this.draw()
    }
    setHue(h: number) {

        this.setIndexVal(0,h);
        this.draw()
    }
    setIndexVal(index:number,val:number)
    {
        this.tl[index]=this.bl[index] = this.tr[index]=this.br[index] = val;
    }
   getFragmentShader(): string {
        let fragment = "precision lowp float;\n" +
            "\n" +

            "uniform vec4 tl;\n" +
            "uniform vec4 tr;\n" +
            "uniform vec4 bl;\n" +
            "uniform vec4 br;\n" +
            "uniform vec2 size;\n" +
            "uniform float gridSize;\n" +
            "varying vec2 vUV;\n" +
            "vec3 hsv2rgb(vec3 c)\n" +
            "{\n" +
            "vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n" +
            "vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n" +
            "return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n" +
            "}\n" +
            "\n" +
            "void main() {\n" +
            "vec2 uv =vUV;\n" +

            "float grid= mod(dot(vec2(1.0), step(vec2(0.5), fract(uv * (size/vec2(gridSize,gridSize))))), 2.0);\n" +
            "grid =grid*0.2+0.8;\n" +
            "vec4 colorT = mix(br,bl,uv.x);\n" +
            "vec4 colorV = mix(tr,tl,uv.x);\n" +
            "vec4 color = mix(colorT,colorV,uv.y);\n" +
            "vec3 rgb =hsv2rgb(color.xyz);\n" +
            "vec3 result =mix(vec3 (grid),rgb,color.a);\n" +
            "gl_FragColor = vec4(result,1.0);\n" +
            "}\n";

        return fragment
    }

}
