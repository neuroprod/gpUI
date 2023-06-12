import {AbstractMaterial} from "../../../webgpu/gpuLib/materials/AbstractMaterial";
import Shader from "../../../webgpu/gpuLib/Shader";


export default class BrushBaseMaterial extends AbstractMaterial {

    public multiSampleCount: GPUSize32 = 1;
    private presentationFormat: GPUTextureFormat;


    constructor(
        device: GPUDevice,
        label: string,
        shader: Shader,
        presentationFormat: GPUTextureFormat,

    ) {
        super(device, label, shader);

        this.presentationFormat = presentationFormat;
        if (this.presentationFormat) {
            this.colorTargets.push({
                format: this.presentationFormat,
                blend: {
                    color: {
                        srcFactor: "one",
                        dstFactor: "one",
                        operation: "max",
                    },
                    alpha: {
                        srcFactor: "one",
                        dstFactor: "one",
                        operation: "add",
                    },
                },
            });
        }
    }

    getPipeLineDescriptor(): GPURenderPipelineDescriptor {
        let desc: GPURenderPipelineDescriptor = {
            label: "Material_pipeLine" + this.label,
            layout: this.pipelineLayout,
            vertex: {
                module: this.shader.shader,
                entryPoint: "mainVertex",
                buffers: this.shader.getVertexBufferLayout(),
            },
            fragment: {
                module: this.shader.shader,
                entryPoint: "mainFragment",
                targets: this.colorTargets,
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none",
            },
            multisample: {
                count: this.multiSampleCount,
            },
        };

        return desc;
    }
}
