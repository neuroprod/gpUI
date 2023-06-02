import Mesh from "./gpuLib/Mesh";

import Material from "./gpuLib/Material";

import PreLoader from "../shared/PreLoader";
import RenderPass from "./gpuLib/RenderPass";
import {Model} from "./gpuLib/Model";

import Camera from "./gpuLib/Camera";
import {Vector3,Vector4} from "math.gl";
import ColorShader3D from "./shaders/ColorShader3D";
import Box from "./meshes/Box";

import NormalShader3D from "./shaders/NormalShader3D";
import UVShader3D from "./shaders/UVShader3D";
import TextureShader3D from "./shaders/TextureShader3D";
import {BindGroup} from "./gpuLib/BindGroup";
import UI from "../UI/UI";
import ColorV from "../shared/ColorV";
import Sphere from "./meshes/Sphere";
import Plane from "./meshes/Plane";
import TextureLoader from "./gpuLib/TextureLoader";
import CanvasManager from "./gpuLib/CanvasManager";
import Quad from "./meshes/Quad";
import FullScreenTexture from "./shaders/FullScreenTexture";




export default class Main{
    private canvas: HTMLCanvasElement;
    private context: GPUCanvasContext;
    private device:GPUDevice;
    private mesh1: Mesh;
    private mesh2: Mesh;
    private mesh3: Mesh;
    private material1: Material;
    private material2: Material;
    private material3: Material;
    private material4: Material;
    private presentationFormat:  GPUTextureFormat;

    private preloader: PreLoader;

    private model1: Model;
    private model2: Model;
    private model3: Model;
    private model4: Model;

    private mainRenderPass: RenderPass;
    private camera: Camera;


    private myTexture:GPUTexture;
    private sampler: GPUSampler;
    private textureLoader: TextureLoader;
    private canvasManager: CanvasManager;
    private quad: Quad;
    private fullscreenShader: FullScreenTexture;
    private materialFullScreen: Material;
    private modelFullScreen: Model;

    constructor(canvas:HTMLCanvasElement) {
        this.canvas =canvas;
        this.canvasManager =new CanvasManager(this.canvas);
        this.setup().then(()=>{

            this.preloader =new PreLoader(()=>{console.log("load")},this.init.bind(this));
            this.textureLoader = new TextureLoader(this.device,this.preloader,"test.png");
        }
        );
    }

    async setup()
    {
        const adapter = await navigator.gpu.requestAdapter();
        this.device =await adapter.requestDevice();
        this.context = this.canvas.getContext('webgpu') as GPUCanvasContext;
        this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();
        this.context.configure({device:this.device, format: this.presentationFormat,
            alphaMode: 'premultiplied',
        });
    }

    init()
    {


        UI.setWebGPU(this.device,this.canvas,this.presentationFormat)

        this.myTexture =  this.textureLoader.texture;
        this.camera =new Camera(this.device);
        this.sampler =this.device.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
        });

        let colorShader =new ColorShader3D(this.device);
        let normalShader =new NormalShader3D(this.device);
        let uvShader =new UVShader3D(this.device);
        let textureShader =new TextureShader3D(this.device);
        this.fullscreenShader = new FullScreenTexture(this.device)

        this.quad = new Quad(this.device)
        this.mesh1 =new Box(this.device);
        this.mesh2 =new Sphere(this.device);
        this.mesh3 =new Plane(this.device);


        this.materialFullScreen = new Material(this.device,"materialFullscreen",this.fullscreenShader,this.presentationFormat);
        this.materialFullScreen.setTexture("texture1",this.myTexture);
        this.materialFullScreen.setSampler("sampler1",this.sampler);
        this.materialFullScreen.depthWriteEnabled =false;
        this.modelFullScreen =new Model(this.device,"modelFullScreen",  this.quad, this.materialFullScreen ,false);

        this.material1=new Material(this.device,"material1",normalShader,this.presentationFormat);
        this.model1 =new Model(this.device,"Model1",this.mesh1,this.material1,true,this.camera);//model adds transform data
        this.model1.transform.position =new Vector3(2.4,0,0);


        this.material2=new Material(this.device,"material2",colorShader,this.presentationFormat);
        this.model2 =new Model(this.device,"Model2",this.mesh3,this.material2,true,this.camera);
        this.model2.transform.position =new Vector3(0.8,0,0);
        this.material2.setUniform("color",new Vector4(0.3,0.6,1.0,1))


        this.material3 =new Material(this.device,"material3",uvShader,this.presentationFormat);
        this.model3 =new Model(this.device,"Model3",this.mesh1,this.material3,true,this.camera);
        this.model3.transform.position =new Vector3(-0.8,0,0);


        this.material4 =new Material(this.device,"material4",textureShader,this.presentationFormat);
        this.material4.setTexture("texture1",this.myTexture);
        this.material4.setSampler("sampler1",this.sampler);

        this.model4 =new Model(this.device,"Model4",this.mesh2,this.material4,true,this.camera);
        this.model4.transform.position =new Vector3(-2.4,0,0);


        this.mainRenderPass =new RenderPass(this.device,this.presentationFormat)
        this.mainRenderPass.add(this.modelFullScreen)
        this.mainRenderPass.add(this.model1);
        this.mainRenderPass.add(this.model2);
        this.mainRenderPass.add(this.model3);
        this.mainRenderPass.add(this.model4);


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

       // this.model1.transform.position =new Vector3(Math.sin(angle),0,Math.cos(angle));
        this.camera.ratio =this.canvas.width/this.canvas.height;
        let angle =(Date.now()/1000)
        this.model1.transform.rotation=new Vector3(0,-angle,0);
        UI.pushWindow("myWindow")

        UI.LFloat("myfloat",2);

        this.material2.setUniform("color",UI.LColor("color",new ColorV(1,0,1,1)))
        this.model4.transform.position =UI.LVector("pos",new Vector3(-2.4,0,0));
        for(let i=0;i<10;i++){
            UI.LButton("hello"+i)
        }
        UI.popWindow()
        //UI.UpdateGPU
    }
    prepDraw()
    {
        BindGroup.updateGroups();
        this.mainRenderPass.updateForCanvas(this.canvas.width,this.canvas.height,this.context)
        UI.updateGPU()
    }
    draw()
    {

        const commandEncoder = this.device.createCommandEncoder();

        this.mainRenderPass.draw(commandEncoder);

        this.device.queue.submit([commandEncoder.finish()]);

    }
}
