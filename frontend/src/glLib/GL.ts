
import {vec2} from "gl-matrix";
import PreLoader from "./PreLoader";

export default class GL {
    assetPath: string;
    preLoader: PreLoader;
    private canvas: HTMLCanvasElement;
    gl: WebGL2RenderingContext;
    private resizeFunctions: any[];
   public viewportSize: vec2;
    public  viewportWidth: number;
    public  viewportHeight: number;
    private ratio: number;
    private _resizeTimeOut: NodeJS.Timeout;
    private pixelRatio: number;
    constructor(canvas:HTMLCanvasElement,preLoader:PreLoader,assetsPath:string) {

        this.assetPath  = assetsPath;
        this.preLoader =preLoader;
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl2",{antialias: true}) as WebGL2RenderingContext;

        this.pixelRatio =window.devicePixelRatio
        this.resizeFunctions=[];
        window.onresize =this.delayedResize.bind(this);
        //this.extDerivatives = this.gl.getExtension('OES_standard_derivatives');
        //this.extInstancing = this.gl.getExtension('ANGLE_instanced_arrays');

        this.viewportSize  =vec2.create();

        this.resize();
    }
    resize()
    {
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height =window.innerHeight+ 'px';
        this.canvas.width = window.innerWidth*this.pixelRatio;
        this.canvas.height = window.innerHeight*this.pixelRatio;
        this.viewportWidth = this.canvas.width;
        this.viewportHeight = this.canvas.height;
        this.viewportSize[0] = this.viewportWidth;
        this.viewportSize[1] = this.viewportHeight;

        this.ratio = this.viewportWidth / this.viewportHeight;
        for(let i=0;i<    this.resizeFunctions.length;i++)
        {
            this.resizeFunctions[i]();

        }

    }
    delayedResize()
    {
        clearTimeout(this._resizeTimeOut);
        this._resizeTimeOut = setTimeout (this.resize.bind(this), 100);

    }

    regResize(funct)
    {
        this.resizeFunctions.push(funct);

    }
    setDefaultBlending()
    {
        let gl =this.gl;
        gl.disable(gl.BLEND);

    }
    setAlphaBlending()
    {

        let gl =this.gl;
        gl.enable(gl.BLEND);

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    }
    setPreMultAlphaBlending()
    {

        let gl =this.gl;
        gl.enable(gl.BLEND);

        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    }
    setAdditiveBlending()
    {
        let gl =this.gl;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE,gl.ONE);

    }
    setMultiplyBlending()
    {
        let gl =this.gl;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.DST_COLOR, gl.ZERO);

    }
}
