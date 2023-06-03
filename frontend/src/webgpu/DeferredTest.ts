import Camera from "./gpuLib/Camera";
import ColorShader3D from "./gpuLib/shaders/ColorShader3D";
import NormalShader3D from "./gpuLib/shaders/NormalShader3D";
import UVShader3D from "./gpuLib/shaders/UVShader3D";
import TextureShader3D from "./gpuLib/shaders/TextureShader3D";
import FullScreenTexture from "./gpuLib/shaders/FullScreenTexture";
import Quad from "./gpuLib/meshes/Quad";
import Box from "./gpuLib/meshes/Box";
import Sphere from "./gpuLib/meshes/Sphere";
import Plane from "./gpuLib/meshes/Plane";
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

enum Views{
    albedoGbuffer,
    normalGbuffer,
  

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
    private fullscreenShader: FullScreenTexture;
    private materialFullScreen: ForwardMaterial;
    private modelFullScreen: Model;

    private presentationFormat: GPUTextureFormat;
    private canvas: HTMLCanvasElement;

    private cube: Box;
    private shader: ColorShaderGBuffer;
    private material: GBufferMaterial;
    private model: Model;
    private views: Array<SelectItem>;
    private currentView: Views;


    constructor(device: GPUDevice, preloader: PreLoader, presentationFormat: GPUTextureFormat,canvas:HTMLCanvasElement) {
        this.device = device;
        this.canvas  =canvas;
        this.presentationFormat = presentationFormat
        this.textureLoader = new TextureLoader(this.device, preloader, "test.png");
        this.views =UIUtils.EnumToSelectItem(Views)
    }

    init() {
        this.myTexture = this.textureLoader.texture;
        this.camera = new Camera(this.device);
        this.sampler = this.device.createSampler({
            magFilter: 'nearest',
            minFilter: 'nearest',

        });

        this.gBufferPass =new GBufferRenderPass(this.device)
        this.gBufferPass.update(this.canvas.width, this.canvas.height);
        this.cube =new Box(this.device)
        this.shader = new ColorShaderGBuffer(this.device);
        this.material = new GBufferMaterial(this.device,"GbufferMaterial",this.shader)
        this.material.setUniform("color", new Vector4(0.3, 0.6, 1.0, 1))
        this.model =new Model(this.device,"gbuffermodel",this.cube,this.material,true,this.camera)

        this.gBufferPass.add(this.model)

        this.quad = new Quad(this.device)
        this.fullscreenShader = new FullScreenTexture(this.device)
        this.materialFullScreen = new ForwardMaterial(this.device, "materialFullscreen", this.fullscreenShader, this.presentationFormat, this.mainPassNeedsDepth);
        this.materialFullScreen.setTexture("texture1", this.gBufferPass.gBufferTextureAlbedo);
        this.materialFullScreen.setSampler("sampler1", this.sampler);
        this.materialFullScreen.depthWriteEnabled = false;
        this.modelFullScreen = new Model(this.device, "modelFullScreen", this.quad, this.materialFullScreen, false);

        this.mainRenderPass = new CanvasRenderPass(this.device, this.presentationFormat, this.mainPassNeedsDepth)
        this.mainRenderPass.add(this.modelFullScreen)

    }

    update()
    {
        this.camera.ratio = this.canvas.width / this.canvas.height;
        UI.pushWindow("myWindowDef")
        this.currentView = UI.LSelect("view" ,this.views)
        // this.model1.transform.position =new Vector3(Math.sin(angle),0,Math.cos(angle));

        UI.popWindow()
    }

    prepDraw(context: GPUCanvasContext)
    {
        this.gBufferPass.update(this.canvas.width, this.canvas.height);

        this.mainRenderPass.updateForCanvas(this.canvas.width, this.canvas.height, context)
        if(this.currentView==Views.albedoGbuffer)    this.materialFullScreen.setTexture("texture1", this.gBufferPass.gBufferTextureAlbedo);
        else if(this.currentView==Views.normalGbuffer)    this.materialFullScreen.setTexture("texture1", this.gBufferPass.gBufferTextureNormal);
        //cant sample float texture
       // else if(this.currentView==Views.positionGbuffer)    this.materialFullScreen.setTexture("texture1", this.gBufferPass.gBufferTexturePosition);

    }
    draw(commandEncoder:GPUCommandEncoder)
    {
        this.gBufferPass.draw(commandEncoder);
        this.mainRenderPass.draw(commandEncoder);
    }
}
