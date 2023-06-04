import Camera from "./gpuLib/Camera";
import ColorShader3D from "./gpuLib/shaders/ColorShader3D";
import NormalShader3D from "./gpuLib/shaders/NormalShader3D";
import UVShader3D from "./gpuLib/shaders/UVShader3D";
import TextureShader3D from "./gpuLib/shaders/TextureShader3D";
import FullScreenTextureShader from "./gpuLib/shaders/FullScreenTextureShader";
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


export default class ForwardTest {
    private mesh1: Mesh;
    private mesh2: Mesh;
    private mesh3: Mesh;
    private material1: ForwardMaterial;
    private material2: ForwardMaterial;
    private material3: ForwardMaterial;
    private material4: ForwardMaterial;
    private device: GPUDevice;

    private model1: Model;
    private model2: Model;
    private model3: Model;
    private model4: Model;

    private mainRenderPass: CanvasRenderPass;
    private camera: Camera;


    private myTexture: GPUTexture;
    private sampler: GPUSampler;
    private textureLoader: TextureLoader;


    private mainPassNeedsDepth = true;
    private presentationFormat: GPUTextureFormat;
    private canvas: HTMLCanvasElement;
    private colorShader: ColorShader3D;
    private normalShader: NormalShader3D;
    private uvShader: UVShader3D;
    private textureShader: TextureShader3D;


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

        this.colorShader = new ColorShader3D(this.device);
        this.normalShader = new NormalShader3D(this.device);
        this.uvShader = new UVShader3D(this.device);
        this.textureShader = new TextureShader3D(this.device);


        this.mesh1 = new Box(this.device);
        this.mesh2 = new Sphere(this.device);
        this.mesh3 = new Plane(this.device);




        this.material1 = new ForwardMaterial(this.device, "material1", this.normalShader, this.presentationFormat, this.mainPassNeedsDepth);
        this.model1 = new Model(this.device, "Model1", this.mesh1, this.material1, true, this.camera);//model adds transform data
        this.model1.transform.position = new Vector3(2.4, 0, 0);


        this.material2 = new ForwardMaterial(this.device, "material2", this.colorShader, this.presentationFormat, this.mainPassNeedsDepth);
        this.model2 = new Model(this.device, "Model2", this.mesh3, this.material2, true, this.camera);
        this.model2.transform.position = new Vector3(0.8, 0, 0);
        this.material2.setUniform("color", new Vector4(0.3, 0.6, 1.0, 1))


        this.material3 = new ForwardMaterial(this.device, "material3", this.uvShader, this.presentationFormat, this.mainPassNeedsDepth);
        this.model3 = new Model(this.device, "Model3", this.mesh1, this.material3, true, this.camera);
        this.model3.transform.position = new Vector3(-0.8, 0, 0);


        this.material4 = new ForwardMaterial(this.device, "material4", this.textureShader, this.presentationFormat, this.mainPassNeedsDepth);
        this.material4.setTexture("texture1", this.myTexture);
        this.material4.setSampler("sampler1", this.sampler);

        this.model4 = new Model(this.device, "Model4", this.mesh2, this.material4, true, this.camera);
        this.model4.transform.position = new Vector3(-2.4, 0, 0);


        this.mainRenderPass = new CanvasRenderPass(this.device, this.presentationFormat, this.mainPassNeedsDepth)

        this.mainRenderPass.add(this.model1);
        this.mainRenderPass.add(this.model2);
        this.mainRenderPass.add(this.model3);
        this.mainRenderPass.add(this.model4);
    }

    update()
    {
        UI.pushWindow("myWindow")
        // this.model1.transform.position =new Vector3(Math.sin(angle),0,Math.cos(angle));
        this.camera.ratio = this.canvas.width / this.canvas.height;
        let angle = (Date.now() / 1000)
        this.model1.transform.rotation = new Vector3(0, -angle, 0);


        this.material2.setUniform("color", UI.LColor("color", new ColorV(1, 0, 1, 1)))
        this.model4.transform.position = UI.LVector("pos", new Vector3(-2.4, 0, 0));

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
