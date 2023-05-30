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
import UVShader3D from "./shaders/UVShader3D";
import TextureShader3D from "./shaders/TextureShader3D";
import {BindGroup} from "./gpuLib/BindGroup";

export default class Main{
    private canvas: HTMLCanvasElement;
    private context: GPUCanvasContext;
    private device:GPUDevice;
    private mesh1: Mesh;
    private mesh2: Mesh;
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
    private _resizeTimeOut:  ReturnType<typeof setTimeout>;

    private myTexture:GPUTexture;
    private sampler: GPUSampler;

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


//set in preloader
        {
            const response = await fetch(
                'test.png'
            );
            const imageBitmap = await createImageBitmap(await response.blob());

            this.myTexture = this.device.createTexture({
                size: [imageBitmap.width, imageBitmap.height, 1],
                format: 'rgba8unorm',
                usage:
                    GPUTextureUsage.TEXTURE_BINDING |
                    GPUTextureUsage.COPY_DST |
                    GPUTextureUsage.RENDER_ATTACHMENT,
            });
            this.device.queue.copyExternalImageToTexture(
                { source: imageBitmap },
                { texture: this.myTexture },
                [imageBitmap.width, imageBitmap.height]
            );
        }
        this.myTexture.label ='test.png';
    //    this.preloader =new PreLoader(()=>{},this.init.bind(this));
        this.init()


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
        window.onresize =this.delayedResize.bind(this);
//UI.setWebGPU(canvas,device)

        this.camera =new Camera(this.device);
        this.sampler =this.device.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
        });

        let colorShader =new ColorShader3D(this.device);
        let normalShader =new NormalShader3D(this.device);
        let uvShader =new UVShader3D(this.device);
        let textureShader =new TextureShader3D(this.device);


        this.mesh1 =new Box(this.device);
        this.mesh2 =new Box(this.device);

        this.material1=new Material(this.device,"material1",normalShader,this.presentationFormat);
        this.model1 =new Model(this.device,"Model1",this.mesh1,this.material1,this.camera);//model adds transform data
        this.model1.transform.position =new Vector3(2.4,0,0);


        this.material2=new Material(this.device,"material2",colorShader,this.presentationFormat);
        this.model2 =new Model(this.device,"Model2",this.mesh2,this.material2,this.camera);
        this.model2.transform.position =new Vector3(0.8,0,0);
        this.material2.setUniform("color",new Vector4(0.3,0.6,1.0,1))


        this.material3 =new Material(this.device,"material3",uvShader,this.presentationFormat);
        this.model3 =new Model(this.device,"Model3",this.mesh2,this.material3,this.camera);
        this.model3.transform.position =new Vector3(-0.8,0,0);


        this.material4 =new Material(this.device,"material4",textureShader,this.presentationFormat);
        this.material4.setTexture("texture1",this.myTexture);
        this.material4.setSampler("sampler1",this.sampler);

        this.model4 =new Model(this.device,"Model4",this.mesh2,this.material4,this.camera);
        this.model4.transform.position =new Vector3(-2.4,0,0);


        this.mainRenderPass =new RenderPass(this.device,this.presentationFormat)
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
        let angle =(Date.now()/1000)
       // this.model1.transform.position =new Vector3(Math.sin(angle),0,Math.cos(angle));
       this.model1.transform.rotation=new Vector3(0,-angle,0);
        this.camera.ratio =this.canvas.width/this.canvas.height;
        //UI.UpdateGPU
    }
    prepDraw()
    {
        BindGroup.updateGroups();
        this.mainRenderPass.updateTexture(this.canvas.width,this.canvas.height,this.context)
    }
    draw()
    {

        const commandEncoder = this.device.createCommandEncoder();

        this.mainRenderPass.draw(commandEncoder);

        this.device.queue.submit([commandEncoder.finish()]);

    }
}
