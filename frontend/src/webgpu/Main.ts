import Mesh from "./gpuLib/Mesh";

import Material from "./gpuLib/Material";

import PreLoader from "../shared/PreLoader";
import RenderPass from "./gpuLib/RenderPass";
import {Model} from "./gpuLib/Model";
import TestMesh1 from "./test/TestMesh1";
import TestMesh2 from "./test/TestMesh2";
import Camera from "./gpuLib/Camera";
import {Vector3,Vector4} from "math.gl";
import MyShader from "./shaders/MyShader";

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


    }
    init()
    {
        this.camera =new Camera(this.device);


        let myShader =new MyShader(this.device);

        this.mesh1 =new TestMesh1(this.device);
        this.material1=new Material(this.device,"material1",myShader,this.presentationFormat);
        this.model1 =new Model(this.device,"Model1",this.mesh1,this.material1,this.camera);//model adds transform data
        this.material1.makePipeLine();

        this.mesh2 =new TestMesh2(this.device);

        this.material2=new Material(this.device,"material2",myShader,this.presentationFormat);
        this.model2 =new Model(this.device,"Model2",this.mesh2,this.material2,this.camera);
        this.material2.makePipeLine();
        this.material2.setUniform("color",new Vector4(1,0,0,1))
        this.mainRenderPass =new RenderPass(this.context.getCurrentTexture())

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
        this.model1.transform.setPosition(new Vector3(Math.sin(angle),0,Math.cos(angle)));
        this.camera.update();
    }
    prepDraw()
    {
        this.mainRenderPass.updateTexture(this.context.getCurrentTexture())
    }
    draw()
    {

        const commandEncoder = this.device.createCommandEncoder();

        this.mainRenderPass.draw(commandEncoder);

        this.device.queue.submit([commandEncoder.finish()]);

    }
}
