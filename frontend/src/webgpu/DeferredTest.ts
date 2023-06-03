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
import Mesh from "./gpuLib/Mesh";
import TextureLoader from "./gpuLib/TextureLoader";
import UI from "../UI/UI";
import ColorV from "../shared/ColorV";


export default class DeferredTest {

    private device: GPUDevice;


    private mainRenderPass: CanvasRenderPass;
    private camera: Camera;


    private myTexture: GPUTexture;
    private sampler: GPUSampler;
    private textureLoader: TextureLoader;

    private quad: Quad;
    private fullscreenShader: FullScreenTexture;
    private materialFullScreen: ForwardMaterial;
    private modelFullScreen: Model;
    private mainPassNeedsDepth = false;
    private presentationFormat: GPUTextureFormat;
    private canvas: HTMLCanvasElement;


    constructor(device: GPUDevice, preloader: PreLoader, presentationFormat: GPUTextureFormat,canvas:HTMLCanvasElement) {
        this.device = device;
        this.canvas  =canvas;
        this.presentationFormat = presentationFormat
        this.textureLoader = new TextureLoader(this.device, preloader, "test.png");
    }

    init() {
        this.myTexture = this.textureLoader.texture;
        this.camera = new Camera(this.device);
        this.sampler = this.device.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
        });




        this.quad = new Quad(this.device)


        this.fullscreenShader = new FullScreenTexture(this.device)
        this.materialFullScreen = new ForwardMaterial(this.device, "materialFullscreen", this.fullscreenShader, this.presentationFormat, this.mainPassNeedsDepth);
        this.materialFullScreen.setTexture("texture1", this.myTexture);
        this.materialFullScreen.setSampler("sampler1", this.sampler);
        this.materialFullScreen.depthWriteEnabled = false;
        this.modelFullScreen = new Model(this.device, "modelFullScreen", this.quad, this.materialFullScreen, false);



        this.mainRenderPass = new CanvasRenderPass(this.device, this.presentationFormat, this.mainPassNeedsDepth)
        this.mainRenderPass.add(this.modelFullScreen)

    }

    update()
    {
        UI.pushWindow("myWindowDef")
        // this.model1.transform.position =new Vector3(Math.sin(angle),0,Math.cos(angle));

        UI.popWindow()
    }

    prepDraw(context: GPUCanvasContext)
    {
        this.mainRenderPass.updateForCanvas(this.canvas.width, this.canvas.height, context)
    }
    draw(commandEncoder:GPUCommandEncoder)
    {
        this.mainRenderPass.draw(commandEncoder);
    }
}
