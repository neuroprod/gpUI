import Camera from "./gpuLib/Camera";

import FullScreenTextureShader from "./gpuLib/shaders/FullScreenTextureShader";
import Quad from "./gpuLib/meshes/Quad";
import Box from "./gpuLib/meshes/Box";

import ForwardMaterial from "./gpuLib/materials/ForwardMaterial";
import {Model} from "./gpuLib/Model";
import {Matrix4, Vector2, Vector3, Vector4} from "math.gl";
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
import DefaultTexture from "./gpuLib/textures/DefaultTexture";
import LightShader from "./gpuLib/shaders/LightShader";
import Sphere from "./gpuLib/meshes/Sphere";
import ForwardAddMaterial from "./gpuLib/materials/ForwardAddMaterial";
import ColorV from "../shared/ColorV";
import DofBlurShader from "./gpuLib/shaders/DofBlurShader";
import InstanceColorShaderGBuffer from "./gpuLib/shaders/InstanceColorShaderGBuffer";
import UniformGroup from "./gpuLib/UniformGroup";

enum Views {
    dofBlur,
    combine,
    light,

    ao,
    albedoGbuffer,
    normalGbuffer,
    positionGbuffer,


}


export default class DeferredTest {


    private device: GPUDevice;


    private mainRenderPass: CanvasRenderPass;
    private mainPassNeedsDepth = false;


    private gBufferPass: GBufferRenderPass;


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
    private material1: GBufferMaterial;
    private material2: GBufferMaterial;
    private material3: GBufferMaterial;
    private models: Array<Model> = [];

    private views: Array<SelectItem>;
    private currentView: Views;


    private aoPass: TextureRenderPass;
    private aoShader: AOShader;
    private materialAO: ForwardMaterial;
    private modelAO: Model;
    private useAO: boolean = true;


    private combineShader: CombineShader;
    private materialCombine: ForwardMaterial;
    private modelCombine: Model;
    private combinePass: TextureRenderPass;

    private lightShader: LightShader;
    private lightPass: TextureRenderPass;
    private sphere: Sphere;
    private modelsLight: Array<Model> = [];

    private boxColor1 = new ColorV(1.00, 1.00, 1.00, 1.00)
    private boxColor2 = new ColorV(0.72, 1.00, 0.00, 1.00)
    private boxColor3 = new ColorV(0.79, 0.64, 0.00, 1.00)
    private materialLight: GBufferMaterial;


    private dofBlurShader: DofBlurShader;
    private dofBlurPass1: TextureRenderPass;
    private materialDofBlur1: ForwardMaterial;
    private modelDofBlur1: Model;

    private dofBlurPass2: TextureRenderPass;
    private materialDofBlur2: ForwardMaterial;
    private modelDofBlur2: Model;

    private instanceShader: InstanceColorShaderGBuffer;
    private instanceMaterial: GBufferMaterial;
    private modelInst: Model;
    private instanceUniforms: UniformGroup;


    constructor(device: GPUDevice, preloader: PreLoader, presentationFormat: GPUTextureFormat, canvas: HTMLCanvasElement) {
        this.device = device;
        this.canvas = canvas;
        this.presentationFormat = presentationFormat
        this.textureLoader = new TextureLoader(this.device, preloader, "test.png");
        this.views = UIUtils.EnumToSelectItem(Views)
    }

    init() {
        this.quad = new Quad(this.device)
        this.cube = new Box(this.device, 1, 0.1, 0.1)
        this.sphere = new Sphere(this.device, 1)


        this.myTexture = this.textureLoader.texture;
        this.camera = new Camera(this.device);
        this.sampler = this.device.createSampler({
            magFilter: 'nearest',
            minFilter: 'nearest',

        });

        this.gBufferPass = new GBufferRenderPass(this.device)
        this.gBufferPass.update(this.canvas.width, this.canvas.height);

        this.shader = new ColorShaderGBuffer(this.device);
        this.material1 = new GBufferMaterial(this.device, "GbufferMaterial", this.shader)
        this.material1.setUniform("color", new Vector4(1.0, 0.3, 0.3, 0))

        this.material2 = new GBufferMaterial(this.device, "GbufferMaterial", this.shader)
        this.material2.setUniform("color", new Vector4(1.0, 0.3, 0.3, 0))

        this.material3 = new GBufferMaterial(this.device, "GbufferMaterial", this.shader)
        this.material3.setUniform("color", new Vector4(1.0, 0.3, 0.3, 0))


        this.materialLight = new GBufferMaterial(this.device, "GbufferMaterial", this.shader)
        this.materialLight.setUniform("color", new Vector4(1.0, 0.9, 0.5, 1.0))

       let numInstances  =500;
        this.instanceShader =new InstanceColorShaderGBuffer(this.device,numInstances);
        this.instanceMaterial = new GBufferMaterial(this.device, "GbufferMaterial", this.instanceShader);
        this.instanceUniforms =new UniformGroup(this.device,"instanceUniforms");
        let dataSize =numInstances*16*2;

        let f =new Float32Array(dataSize)
        for (let i = 0; i <numInstances; i++) {
            let mat =new Matrix4()
            let pos = new Vector3(this.randomRange(-2, 2), this.randomRange(-2, 2), this.randomRange(-2, 2));
            pos.normalize()
            pos.scale((1 - (Math.pow(Math.random(), 3))) * 2)
            mat.translate(pos);
            mat.rotateX(Math.random()*3)
            mat.rotateY(Math.random()*3)
            f.set(mat,i*16)


            mat.invert();
            mat.transpose();

            f.set(mat,i*16+(16*numInstances))
        }



        this.instanceUniforms.makeBuffers(GPUShaderStage.VERTEX,dataSize,f);

        this.instanceMaterial.addUniformGroup(this.instanceUniforms);
        this.modelInst = new Model(this.device, "gbuffermodelInst", this.cube,  this.instanceMaterial, false, this.camera)
        this.gBufferPass.add(this.modelInst);

        let positions = [];

        for (let i = 0; i < 50; i++) {
            let model = new Model(this.device, "gbuffermodel", this.sphere, this.materialLight, true, this.camera)
            let pos = new Vector3(this.randomRange(-2, 2), this.randomRange(-2, 2), this.randomRange(-2, 2));

            pos.normalize()
            pos.scale(2.2)
            positions.push(pos);

            model.transform.position = pos;
            model.transform.scale = new Vector3(0.05, 0.05, 0.05)
            // model.transform.rotation = new Vector3(this.randomRange(-3, 3), this.randomRange(-3, 3), this.randomRange(-3, 3))
            this.models.push(model);
            this.gBufferPass.add(model)
        }


        this.lightShader = new LightShader(this.device)
        this.lightPass = new TextureRenderPass(this.device, "rgba8unorm");
        this.lightPass.update(this.canvas.width, this.canvas.height);

        for (let i = 0; i < positions.length; i++) {

            let pos = positions[i];
            let materialLight = new ForwardAddMaterial(this.device, "materialLight", this.lightShader, this.lightPass.format, false);
            materialLight.setUniform("lightPos", new Vector4(pos.x, pos.y, pos.z, 1.0))
            materialLight.setTexture("textureNormal", this.gBufferPass.gBufferTextureNormal);
            materialLight.setTexture("texturePosition", this.gBufferPass.gBufferTexturePosition);
            materialLight.setTexture("textureAlbedo", this.gBufferPass.gBufferTextureAlbedo);
            let model = new Model(this.device, "gbuffermodel", this.sphere, materialLight, true, this.camera)

            model.transform.position = positions[i];
            this.modelsLight.push(model);
            this.lightPass.add(model)
        }


        /*this.modelAO = new Model(this.device, "modelAO", this.quad, this.materialAO, false, this.camera);
        this.materialAO.setTexture("textureNormal", this.gBufferPass.gBufferTextureNormal);
        this.materialAO.setTexture("texturePosition", this.gBufferPass.gBufferTexturePosition);*/

        this.aoPass = new TextureRenderPass(this.device, "r8unorm");
        this.aoPass.update(this.canvas.width, this.canvas.height);
        this.aoShader = new AOShader(this.device);
        this.materialAO = new ForwardMaterial(this.device, "materialAO", this.aoShader, this.aoPass.format, false);

        this.modelAO = new Model(this.device, "modelAO", this.quad, this.materialAO, false, this.camera);
        this.materialAO.setTexture("textureNormal", this.gBufferPass.gBufferTextureNormal);
        this.materialAO.setTexture("texturePosition", this.gBufferPass.gBufferTexturePosition);
        this.aoPass.add(this.modelAO)


        this.combinePass = new TextureRenderPass(this.device);
        this.combinePass.update(this.canvas.width, this.canvas.height);
        this.combineShader = new CombineShader(this.device)
        this.materialCombine = new ForwardMaterial(this.device, "materialCombine", this.combineShader, this.combinePass.format, false);

        this.modelCombine = new Model(this.device, "combine", this.quad, this.materialCombine, false, this.camera);
        this.materialCombine.setTexture("albedo", this.gBufferPass.gBufferTextureAlbedo);
        this.materialCombine.setTexture("ao", this.aoPass.texture);
        this.materialCombine.setTexture("normal", this.gBufferPass.gBufferTextureNormal);
        this.materialCombine.setTexture("positionTexture", this.gBufferPass.gBufferTexturePosition);
        this.materialCombine.setTexture("light", this.lightPass.texture);
        this.combinePass.add(this.modelCombine)


        this.dofBlurShader = new DofBlurShader(this.device)


        this.dofBlurPass1 = new TextureRenderPass(this.device);
        this.dofBlurPass1.update(this.canvas.width, this.canvas.height);
        this.materialDofBlur1 = new ForwardMaterial(this.device, "materialDofBlur", this.dofBlurShader, this.combinePass.format, false);
        this.modelDofBlur1 = new Model(this.device, "combine", this.quad, this.materialDofBlur1, false, this.camera);
        this.materialDofBlur1.setTexture("texture1", this.combinePass.texture);
        this.dofBlurPass1.add(this.modelDofBlur1)


        this.dofBlurPass2 = new TextureRenderPass(this.device);
        this.dofBlurPass2.update(this.canvas.width, this.canvas.height);
        this.materialDofBlur2 = new ForwardMaterial(this.device, "materialDofBlur", this.dofBlurShader, this.combinePass.format, false);
        this.modelDofBlur2 = new Model(this.device, "combine", this.quad, this.materialDofBlur2, false, this.camera);
        this.materialDofBlur2.setTexture("texture1",   this.dofBlurPass1.texture);
        this.dofBlurPass2.add(this.modelDofBlur2)

        this.fullscreenShader = new FullScreenTextureShader(this.device)
        this.materialFullScreen = new ForwardMaterial(this.device, "materialFullscreen", this.fullscreenShader, this.presentationFormat, this.mainPassNeedsDepth,4);
        this.materialFullScreen.setTexture("texture1", this.gBufferPass.gBufferTextureAlbedo);

        this.materialFullScreen.depthWriteEnabled = false;
        this.modelFullScreen = new Model(this.device, "modelFullScreen", this.quad, this.materialFullScreen, false);

        this.mainRenderPass = new CanvasRenderPass(this.device, this.presentationFormat, this.mainPassNeedsDepth)
        this.mainRenderPass.add(this.modelFullScreen)

    }

    public randomRange(min: number, max: number) {
        let r = Math.random() * (max - min);
        r += min;
        return r;
    }

    update() {
        this.camera.ratio = this.canvas.width / this.canvas.height;
        let angle = Date.now() / 10000;
        this.camera.eye = new Vector3(Math.sin(angle) * 6, 0, Math.cos(angle) * 5);
        UI.pushWindow("myWindowDef");

        this.currentView = UI.LSelect("view", this.views);
        UI.LColor("boxColor1", this.boxColor1)
        //UI.LColor("boxColor2", this.boxColor2)
        //UI.LColor("boxColor3", this.boxColor3)
        UI.pushGroup("SSAO");
        this.useAO = UI.LBool("enabled", true,);
        this.materialAO.setUniform("radius", UI.LFloatSlider("radius", 0.2, 0, 1));
        this.materialAO.setUniform("strength", UI.LFloatSlider("strength", 1, 0, 1))
        UI.popGroup();
        UI.popWindow()

        this.materialFullScreen.setUniform("size", new Vector4(this.canvas.width, this.canvas.height, 0, 0))
        this.materialAO.setUniform("size", new Vector2(this.canvas.width, this.canvas.height))
        //this.material1.setUniform("color", new Vector4(this.boxColor1.r, this.boxColor1.g, this.boxColor1.b, 0))
        //this.material2.setUniform("color", new Vector4(this.boxColor2.r, this.boxColor2.g, this.boxColor2.b, 0))
        //this.material3.setUniform("color", new Vector4(this.boxColor3.r, this.boxColor3.g, this.boxColor3.b, 0))
        for (let m of this.modelsLight) {
            m.material.setUniform("size", new Vector2(this.canvas.width, this.canvas.height))
        }
        this.instanceMaterial.setUniform("color", new Vector4(this.boxColor1.r, this.boxColor1.g, this.boxColor1.b, 0));

        this.materialCombine.setUniform("size", new Vector4(this.canvas.width, this.canvas.height, 0, 0))
        this.materialDofBlur1.setUniform("size", new Vector4(this.canvas.width, this.canvas.height, 0, 0))
        this.materialDofBlur2.setUniform("size", new Vector4(this.canvas.width, this.canvas.height, 0, 0))
    }

    prepDraw(context: GPUCanvasContext) {


        this.gBufferPass.update(this.canvas.width, this.canvas.height);

        if (this.useAO) {
            this.aoPass.update(this.canvas.width, this.canvas.height);
            this.materialAO.setTexture("textureNormal", this.gBufferPass.gBufferTextureNormal);
            this.materialAO.setTexture("texturePosition", this.gBufferPass.gBufferTexturePosition);
        }

        this.lightPass.update(this.canvas.width, this.canvas.height)
        for (let m of this.modelsLight) {
            m.material.setTexture("textureNormal", this.gBufferPass.gBufferTextureNormal);
            m.material.setTexture("texturePosition", this.gBufferPass.gBufferTexturePosition);
            m.material.setTexture("textureAlbedo", this.gBufferPass.gBufferTextureAlbedo);
        }


        this.combinePass.update(this.canvas.width, this.canvas.height);
        if (this.useAO) {
            this.materialCombine.setTexture("ao", this.aoPass.texture);
        } else {
            this.materialCombine.setTexture("ao", DefaultTexture.getWhite(this.device));
        }
        this.materialCombine.setTexture("albedo", this.gBufferPass.gBufferTextureAlbedo);
        this.materialCombine.setTexture("normal", this.gBufferPass.gBufferTextureNormal);
        this.materialCombine.setTexture("light", this.lightPass.texture);
        this.materialCombine.setTexture("positionTexture", this.gBufferPass.gBufferTexturePosition);

        this.dofBlurPass1.update(this.canvas.width, this.canvas.height);
        this.materialDofBlur1.setTexture("texture1", this.combinePass.texture);


        this.dofBlurPass2.update(this.canvas.width, this.canvas.height);
        this.materialDofBlur2.setTexture("texture1", this.dofBlurPass1.texture);

        this.mainRenderPass.updateForCanvas(this.canvas.width, this.canvas.height, context)

        if (this.currentView == Views.albedoGbuffer) this.materialFullScreen.setTexture("texture1", this.gBufferPass.gBufferTextureAlbedo);
        else if (this.currentView == Views.normalGbuffer) this.materialFullScreen.setTexture("texture1", this.gBufferPass.gBufferTextureNormal);
        else if (this.currentView == Views.positionGbuffer) this.materialFullScreen.setTexture("texture1", this.gBufferPass.gBufferTexturePosition);
        else if (this.currentView == Views.ao) this.materialFullScreen.setTexture("texture1", this.aoPass.texture);
        else if (this.currentView == Views.combine) this.materialFullScreen.setTexture("texture1", this.combinePass.texture);
        else if (this.currentView == Views.light) this.materialFullScreen.setTexture("texture1", this.lightPass.texture);
        else if (this.currentView == Views.dofBlur) this.materialFullScreen.setTexture("texture1", this.dofBlurPass2.texture);
    }

    draw(commandEncoder: GPUCommandEncoder) {
        this.gBufferPass.draw(commandEncoder);
        this.lightPass.draw(commandEncoder)
        if (this.useAO) {
            this.aoPass.draw(commandEncoder);
        }
        this.combinePass.draw(commandEncoder);
        this.dofBlurPass1.draw(commandEncoder);
        this.dofBlurPass2.draw(commandEncoder);
        this.mainRenderPass.draw(commandEncoder);

    }
}
