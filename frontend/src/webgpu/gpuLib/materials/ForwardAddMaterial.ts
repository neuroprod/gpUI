import Shader from "../Shader";
import {AbstractMaterial} from "./AbstractMaterial";


export default class ForwardAddMaterial extends AbstractMaterial {


    public depthWriteEnabled: boolean = true;
    public multiSampleCount: GPUSize32 = 1;
    private presentationFormat: GPUTextureFormat
    private needsDepth: boolean =true;

    constructor(device: GPUDevice, label: string, shader: Shader, presentationFormat: GPUTextureFormat,needsDepth:boolean =true) {
        super(device, label, shader);
        this.needsDepth=needsDepth
        this.presentationFormat = presentationFormat;
        if (this.presentationFormat) {
            this.colorTargets.push({format: this.presentationFormat,  blend: {
                    color: {
                        srcFactor: 'one',
                        dstFactor: 'one',
                        operation: 'add',
                    },
                    alpha: {
                        srcFactor: 'src-alpha',
                        dstFactor: 'one-minus-src-alpha',
                        operation: 'add',
                    },
                },})
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
                targets: this.colorTargets
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'back',
            },
            multisample: {
                count: this.multiSampleCount,
            },
        }
        if(this.needsDepth)
        {
            desc.depthStencil={
                depthWriteEnabled: this.depthWriteEnabled,
                depthCompare: 'less',
                format: 'depth24plus',
            }

        }
        return desc
    }


}
