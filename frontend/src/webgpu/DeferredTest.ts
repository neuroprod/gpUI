import Camera from "./gpuLib/Camera";

import FullScreenTextureShader from "./gpuLib/shaders/FullScreenTextureShader";
import Quad from "./gpuLib/meshes/Quad";
import Box from "./gpuLib/meshes/Box";

import ForwardMaterial from "./gpuLib/materials/ForwardMaterial";
import {Model} from "./gpuLib/Model";
import {Vector3, Vector4} from "math.gl";
import CanvasRenderPass from "./gpuLib/renderPass/CanvasRenderPass";
import PreLoader from "../shared/PreLoader";

import TextureLoader from "./gpuLib/TextureLoader";
import UI from "../UI/UI";

import GBufferRenderPass from "./gpuLib/renderPass/GBufferRenderPass";
import ColorShaderGBuffer from "./gpuLib/shaders/ColorShaderGBuffer";
import GBufferMaterial from "./gpuLib/materials/GBufferMaterial";
import SelectItem from "../UI/math/SelectItem";
import UIUtils from "../UI/UIUtils";
import TextureRenderPass from "./gpuLib/renderPass/TextureRenderPass";
import AOShader from "./gpuLib/shaders/AOShader";
import CombineShader from "./gpuLib/shaders/CombineShader";

enum Views{
    combine,
    ao,
    albedoGbuffer,
    normalGbuffer,
    positionGbuffer,


}


export default class DeferredTest {




    private device: GPUDevice;


    private mainRenderPass: CanvasRenderPass;
    private mainPassNeedsDepth = false;



    private gBufferPass:GBufferRenderPass;


    private camera: Camera;


    private myTexture: GPUTexture;
    private sampler: GPUSampler;
    private textureLoader: TextureLoader;

    private quad: Quad;
    private fullscreenShader: FullScreenTextureShader;
    private materialFullScreen: ForwardMaterial;
    private modelFullScreen: Model;

    private presentationFormat: GPUTextureFormat;
    private canvas: HTMLCanvasElement;

    private cube: Box;
    private shader: ColorShaderGBuffer;
    private material: GBufferMaterial;

    private views: Array<SelectItem>;
    private currentView: Views;
    private aoPass: TextureRenderPass;
    private aoShader: AOShader;
    private materialAO: ForwardMaterial;
    private modelAO: Model;
    private models: Array<Model>=[];

    private combineShader: CombineShader;
    private materialCombine: ForwardMaterial;
    private modelCombine: Model;
    private combinePass: TextureRenderPass;


    constructor(device: GPUDevice, preloader: PreLoader, presentationFormat: GPUTextureFormat,canvas:HTMLCanvasElement) {
        this.device = device;
        this.canvas  =canvas;
        this.presentationFormat = presentationFormat
        this.textureLoader = new TextureLoader(this.device, preloader, "test.png");
        this.views =UIUtils.EnumToSelectItem(Views)
    }

    init() {
        this.quad = new Quad(this.device)
        this.myTexture = this.textureLoader.texture;
        this.camera = new Camera(this.device);
        this.sampler = this.device.createSampler({
            magFilter: 'nearest',
            minFilter: 'nearest',

        });

        this.gBufferPass =new GBufferRenderPass(this.device)
        this.gBufferPass.update(this.canvas.width, this.canvas.height);
        this.cube =new Box(this.device,1,0.1,0.1)
        this.shader = new ColorShaderGBuffer(this.device);
        this.material = new GBufferMaterial(this.device,"GbufferMaterial",this.shader)
        this.material.setUniform("color", new Vector4(1.0, 1.0, 1.0, 1))

        for(let i=0;i<600;i++)
        {
            let model =new Model(this.device,"gbuffermodel",this.cube,this.material,true,this.camera)
            let pos = new Vector3(this.randomRange(-2,2),this.randomRange(-2,2) ,this.randomRange(-2,2)  );
            pos.normalize()
            pos.scale((1-(Math.pow(Math.random(),2)))*2)
            model.transform.position =pos;
            model.transform.rotation =new Vector3(this.randomRange(-3,3),this.randomRange(-3,3) ,this.randomRange(-3,3)  )
            this.models.push(model);
            this.gBufferPass.add(model)
        }

        this.aoPass = new TextureRenderPass(this.device,"r8unorm");
        this.aoPass.update(this.canvas.width, this.canvas.height);
        this.aoShader = new AOShader(this.device);
        this.materialAO = new ForwardMaterial(this.device, "materialAO",  this.aoShader, this.aoPass.format, false);
        this.materialAO.multiSampleCount=1;
        this.modelAO = new Model(this.device, "modelAO", this.quad, this.materialAO, false,this.camera);
        this.materialAO.setTexture("textureNormal",this.gBufferPass.gBufferTextureNormal);
        this.materialAO.setTexture("texturePosition", this.gBufferPass.gBufferTexturePosition);
        this.aoPass.add(this.modelAO)


        this.combinePass = new TextureRenderPass(this.device);
        this.combineShader = new CombineShader(this.device)
        this.materialCombine = new ForwardMaterial(this.device, "materialCombine",  this.combineShader,    this.combinePass.format, false);
        this.materialCombine.multiSampleCount=1;
        this.modelCombine= new Model(this.device, "combine", this.quad, this.materialCombine, false,this.camera);
        this.materialCombine.setTexture("albedo",this.gBufferPass.gBufferTextureAlbedo);
        this.materialCombine.setTexture("ao", this.aoPass.texture);
        this.materialCombine.setTexture("normal",this.gBufferPass.gBufferTextureNormal);
        this.combinePass.add(this.modelCombine)



        this.fullscreenShader = new FullScreenTextureShader(this.device)
        this.materialFullScreen = new ForwardMaterial(this.device, "materialFullscreen", this.fullscreenShader, this.presentationFormat, this.mainPassNeedsDepth);
        this.materialFullScreen.setTexture("texture1", this.gBufferPass.gBufferTextureAlbedo);

        this.materialFullScreen.depthWriteEnabled = false;
        this.modelFullScreen = new Model(this.device, "modelFullScreen", this.quad, this.materialFullScreen, false);

        this.mainRenderPass = new CanvasRenderPass(this.device, this.presentationFormat, this.mainPassNeedsDepth)
        this.mainRenderPass.add(this.modelFullScreen)

    }
    public randomRange(min:number,max:number)
    {
        let r =Math.random()*(max-min);
        r+=min;
        return r;
    }
    update()
    {
        this.camera.ratio = this.canvas.width / this.canvas.height;
        let angle  =Date.now()/5000;
        this.camera.eye =new Vector3(Math.sin(angle)*6,0,Math.cos(angle)*6);
        UI.pushWindow("myWindowDef");

        this.currentView = UI.LSelect("view" ,this.views)



        UI.popWindow()

        this.materialFullScreen.setUniform("size",new Vector4(this.canvas.width,this.canvas.height,0,0))
        this.materialAO.setUniform("size",new Vector4(this.canvas.width,this.canvas.height,0,0))

        this.materialCombine.setTexture("ao", this.aoPass.texture);
        this.materialCombine.setUniform("size",new Vector4(this.canvas.width,this.canvas.height,0,0))
    }

    prepDraw(context: GPUCanvasContext)
    {


        this.gBufferPass.update(this.canvas.width, this.canvas.height);

        this.aoPass.update(this.canvas.width, this.canvas.height);
        this.materialAO.setTexture("textureNormal",this.gBufferPass.gBufferTextureNormal);
        this.materialAO.setTexture("texturePosition", this.gBufferPass.gBufferTexturePosition);

        this.combinePass.update(this.canvas.width, this.canvas.height);
        this.materialCombine.setTexture("ao", this.aoPass.texture);
        this.materialCombine.setTexture("albedo",this.gBufferPass.gBufferTextureAlbedo);
        this.materialCombine.setTexture("normal",this.gBufferPass.gBufferTextureNormal);

        this.mainRenderPass.updateForCanvas(this.canvas.width, this.canvas.height, context)

        if(this.currentView==Views.albedoGbuffer)    this.materialFullScreen.setTexture("texture1", this.gBufferPass.gBufferTextureAlbedo);
        else if(this.currentView==Views.normalGbuffer)    this.materialFullScreen.setTexture("texture1", this.gBufferPass.gBufferTextureNormal);
        else if(this.currentView==Views.positionGbuffer)    this.materialFullScreen.setTexture("texture1", this.gBufferPass.gBufferTexturePosition);
        else if(this.currentView==Views.ao)    this.materialFullScreen.setTexture("texture1", this.aoPass.texture);
        else if(this.currentView==Views.combine)    this.materialFullScreen.setTexture("texture1", this.combinePass.texture);

    }
    draw(commandEncoder:GPUCommandEncoder)
    {
        this.gBufferPass.draw(commandEncoder);
        this.aoPass.draw(commandEncoder);
        this.combinePass.draw(commandEncoder);
        this.mainRenderPass.draw(commandEncoder);
    }
}
