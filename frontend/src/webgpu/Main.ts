import Mesh from "./gpuLib/Mesh";

import Material from "./gpuLib/Material";

import PreLoader from "../shared/PreLoader";
import RenderPass from "./gpuLib/RenderPass";
import {Model} from "./gpuLib/Model";

import Camera from "./gpuLib/Camera";
import {Vector3,Vector4} from "math.gl";
import ColorShader3D from "./shaders/ColorShader3D";
import Box from "./meshes/Box";
import UniformGroup from "./gpuLib/UniformGroup";
import NormalShader3D from "./shaders/NormalShader3D";

export default class Main{
    private canvas: HTMLCanvasElement;
    private context: GPUCanvasContext;
    private device:GPUDevice;
    private mesh1: Mesh;
    private mesh2: Mesh;
    private material2: Material;
    private material1: Material;
    private presentationFormat:  GPUTextureFormat;

    private preloader: PreLoader;

    private model1: Model;
    private model2: Model;
    private mainRenderPass: RenderPass;
    private camera: Camera;
    private _resizeTimeOut: number;
    constructor(canvas:HTMLCanvasElement) {
        this.canvas =canvas;

        this.setup();
    }
    async setup()
    {

        const adapter = await navigator.gpu.requestAdapter();
        this.device =await adapter.requestDevice();

        this.canvas.width=window.innerWidth;
        this.canvas.height=window.innerHeight;


        this.context = this.canvas.getContext('webgpu') as GPUCanvasContext;
        this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();
        this.context.configure({device:this.device, format: this.presentationFormat,
            alphaMode: 'premultiplied',
        });


    //    this.preloader =new PreLoader(()=>{},this.init.bind(this));
        this.init()
        window.onresize =this.delayedResize.bind(this);

    }
    resize()
    {
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height =window.innerHeight+ 'px';
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;


    }
    delayedResize()
    {
        clearTimeout(this._resizeTimeOut);

       this._resizeTimeOut = setTimeout (this.resize.bind(this), 100);

    }
    init()
    {
        this.camera =new Camera(this.device);


        let colorShader =new ColorShader3D(this.device);
        let normalShader =new NormalShader3D(this.device);

        this.mesh1 =new Box(this.device);
        this.material1=new Material(this.device,"material1",normalShader,this.presentationFormat);
        this.model1 =new Model(this.device,"Model1",this.mesh1,this.material1,this.camera);//model adds transform data
        this.model1.transform.position =new Vector3(2,0,0);

        this.mesh2 =new Box(this.device);
        this.material2=new Material(this.device,"material2",colorShader,this.presentationFormat);
        this.model2 =new Model(this.device,"Model2",this.mesh2,this.material2,this.camera);
        this.model2.transform.scale =new Vector3(0.3,1,0.3)
        this.material2.setUniform("color",new Vector4(0,1,0,1))

        this.mainRenderPass =new RenderPass(this.device,this.presentationFormat)
        this.mainRenderPass.add(this.model1);
        this.mainRenderPass.add(this.model2);

        requestAnimationFrame(this.step.bind(this))
    }
    step()
    {
        this.update();
        this.prepDraw();
        this.draw()
        requestAnimationFrame(this.step.bind(this))
    }
    update()
    {
        let angle =(Date.now()/1000)
       // this.model1.transform.position =new Vector3(Math.sin(angle),0,Math.cos(angle));
       this.model1.transform.rotation=new Vector3(0,-angle,0);
        this.camera.ratio =this.canvas.width/this.canvas.height;
    }
    prepDraw()
    {
        UniformGroup.updateGroups();
        this.mainRenderPass.updateTexture(this.canvas.width,this.canvas.height,this.context)
    }
    draw()
    {

        const commandEncoder = this.device.createCommandEncoder();

        this.mainRenderPass.draw(commandEncoder);

        this.device.queue.submit([commandEncoder.finish()]);

    }
}
