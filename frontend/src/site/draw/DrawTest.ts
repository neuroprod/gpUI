import BrushCircle from "./mesh/BrushCircle";
import BrushBasePass from "./renderPass/BrushBasePass";
import BrushBaseMaterial from "./materials/BrushBaseMaterial";
import BrushBaseShader from "./shaders/BrushBaseShader";
import {Model2D} from "./twoD/Model2D";

import Camera2D from "./twoD/Camera2D";

import Quad from "../../webgpu/gpuLib/meshes/Quad";

import {Model} from "../../webgpu/gpuLib/Model";
import {Vector3} from "math.gl";



export default class DrawTest
{
    private brushCircleMesh: BrushCircle;
    private device: GPUDevice;
    private presentationFormat: GPUTextureFormat;
   public brushBaseTexture: GPUTexture;
    public brushBasePass: BrushBasePass;
    private brushBaseShader: BrushBaseShader;
    private brushBaseMaterial: BrushBaseMaterial;
    private model2D: Model2D;
    private camera2D: Camera2D;


    constructor(device:GPUDevice,presentationFormat:GPUTextureFormat) {

        this.device =device;
        this.presentationFormat =presentationFormat;
        this.brushCircleMesh  =new BrushCircle(device);

        this.camera2D =new Camera2D(this.device,"camera2D");
        this.brushBaseTexture = this.device.createTexture({
            size: [1024,1024],
            usage:
                GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            format:"rgba8unorm",
        });
        this.brushBasePass =new BrushBasePass(this.device,"brushBasePass",this.brushBaseTexture);
      // new BrushBasePass(this.device,"brushBasePass",this.brushBaseTexture);
        this.brushBaseShader = new BrushBaseShader(this.device);
        this.brushBaseMaterial = new BrushBaseMaterial(device,"brushBasematerial",this.brushBaseShader,"rgba8unorm");

      this.model2D  =new Model2D(device,"brush",  this.brushCircleMesh,this.brushBaseMaterial,true,this.camera2D);
this.model2D.transform.scale =new Vector3(50,50,1);
        this.model2D.transform.position =new Vector3(10,10,0);
        this.brushBasePass.add(this.model2D);

    }

    update(width,height) {
        this.model2D.transform.position =new Vector3(Math.random()*1024,Math.random()*1024,0)
    }

    draw(commandEncoder: GPUCommandEncoder) {

        this.brushBasePass.draw(commandEncoder);
    }
}
