import Shader from "../Shader";
import {AbstractMaterial} from "./AbstractMaterial";


export default class Material extends AbstractMaterial {


    public depthWriteEnabled: boolean = true;
    public multiSampleCount: GPUSize32 = 4;
    private presentationFormat: GPUTextureFormat
    private colorTargets: Array<GPUColorTargetState> = []

    constructor(device: GPUDevice, label: string, shader: Shader, presentationFormat?: GPUTextureFormat) {
        super(device, label, shader);

        this.presentationFormat = presentationFormat;
        if (this.presentationFormat) {
            this.colorTargets.push({format: this.presentationFormat})
        }


    }


    getPipeLineDescriptor(): GPURenderPipelineDescriptor {
        let desc: GPURenderPipelineDescriptor = {
            label: "Material_pipeLine" + this.label,
            layout: this.pipelineLayout,
            vertex: {
                module: this.shader.shader,
                entryPoint: 'mainVertex',
                buffers: this.shader.getVertexBufferLayout()
                ,
            },
            fragment: {
                module: this.shader.shader,
                entryPoint: 'mainFragment',
                targets: this.colorTargets,
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'back',
            },
            /* depthStencil: {

                 depthWriteEnabled: this.depthWriteEnabled,
                 depthCompare: this.depthCompare,

                 format: 'depth24plus',
             },*/
            multisample: {
                count: this.multiSampleCount,
            },
        }

        return desc
    }


}
