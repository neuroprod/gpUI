import PreLoader from "../shared/PreLoader";


import UI from "../UI/UI";


import DrawTest from "./draw/DrawTest";
import CanvasManager from "../webgpu/gpuLib/CanvasManager";
import {BindGroup} from "../webgpu/gpuLib/BindGroup";
import FullScreenTextureShader from "../webgpu/gpuLib/shaders/FullScreenTextureShader";
import ForwardMaterial from "../webgpu/gpuLib/materials/ForwardMaterial";
import {Model} from "../webgpu/gpuLib/Model";
import CanvasRenderPass from "../webgpu/gpuLib/renderPass/CanvasRenderPass";
import Quad from "../webgpu/gpuLib/meshes/Quad";
import BrushCircle from "./draw/mesh/BrushCircle";
import {Vector2, Vector4} from "math.gl";


export default class Main {
    private canvas: HTMLCanvasElement;
    private context: GPUCanvasContext;
    private device: GPUDevice;

    private presentationFormat: GPUTextureFormat;

    private preloader: PreLoader;

    private canvasManager: CanvasManager;


    private useTimeStampQuery: boolean = false;
    private drawTest: DrawTest;
    private fullscreenShader: FullScreenTextureShader;
    private materialFullScreen: ForwardMaterial;
    private modelFullScreen: Model;
    private mainRenderPass: CanvasRenderPass;
    private quad: Quad;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvasManager = new CanvasManager(this.canvas);
        this.setup().then(() => {
            // this.preloader = new PreLoader(() => {}, this.init.bind(this));
            this.init();

        });
    }

    async setup() {
        const adapter = await navigator.gpu.requestAdapter();
        //--disable-dawn-features=disallow_unsafe_apis
        // on mac: /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --disable-dawn-features=disallow_unsafe_apis
        ///https://omar-shehata.medium.com/how-to-use-webgpu-timestamp-query-9bf81fb5344a test this

        const requiredFeatures: Array<GPUFeatureName> = ["rg11b10ufloat-renderable"];
        if (adapter.features.has('timestamp-query')) {
            requiredFeatures.push('timestamp-query');
            this.useTimeStampQuery = true;
        }

        this.device = await adapter.requestDevice({requiredFeatures: requiredFeatures,});

        this.context = this.canvas.getContext("webgpu") as GPUCanvasContext;
        this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();
        this.context.configure({
            device: this.device,
            format: this.presentationFormat,
            alphaMode: "premultiplied",
        });

        this.drawTest = new DrawTest(this.device, this.presentationFormat)

        this.quad = new Quad(this.device);

        this.fullscreenShader = new FullScreenTextureShader(this.device);
        this.materialFullScreen = new ForwardMaterial(
            this.device,
            "materialFullscreen",
            this.fullscreenShader,
            this.presentationFormat,
            false,
            4
        );
        this.materialFullScreen.setTexture(
            "texture1",
            this.drawTest.brushBaseTexture
        );

        this.materialFullScreen.depthWriteEnabled = false;
        this.modelFullScreen = new Model(
            this.device,
            "modelFullScreen",
        this.quad,
            this.materialFullScreen,
            false
        );

        this.mainRenderPass = new CanvasRenderPass(
            this.device,
            this.presentationFormat,
            false
        );
        this.mainRenderPass.add(this.modelFullScreen);
    }

    init() {
        UI.setWebGPU(this.device, this.canvas, this.presentationFormat);

        requestAnimationFrame(this.step.bind(this));
    }

    step() {
        this.update();
        this.prepDraw();
        this.draw();
        requestAnimationFrame(this.step.bind(this));
    }

    update() {
        UI.pushWindow("main");

        UI.popWindow();

        this.mainRenderPass.updateForCanvas(this.canvas.width, this.canvas.height, this.context);
        this.drawTest.update(this.canvas.width, this.canvas.height)
        //UI.UpdateGPU
       // this.materialFullScreen.setTexture("texture1",this.drawTest.brushBaseTexture);
        this.materialFullScreen.setUniform(
            "size",
            new Vector4(this.canvas.width, this.canvas.height)
        );

    }

    prepDraw() {
        BindGroup.updateGroups();


        UI.updateGPU();
    }

    draw() {
        const commandEncoder = this.device.createCommandEncoder();

        this.drawTest.draw(commandEncoder);
        this.mainRenderPass.draw(commandEncoder);
        this.device.queue.submit([commandEncoder.finish()]);
        /* if (!this.showForward &&  this.useTimeStampQuery) {
             this.deferredTest.tsq.finish();
         }*/
    }
}
