import Shader from "../Shader";
import { AbstractMaterial } from "./AbstractMaterial";

export default class ForwardMaterial extends AbstractMaterial {
  public depthWriteEnabled: boolean = true;
  public multiSampleCount: GPUSize32 = 1;
  private presentationFormat: GPUTextureFormat;
  private needsDepth: boolean = true;

  constructor(
    device: GPUDevice,
    label: string,
    shader: Shader,
    presentationFormat: GPUTextureFormat,
    needsDepth: boolean = true,
    multisampleCount: number = 1
  ) {
    super(device, label, shader);
    this.needsDepth = needsDepth;
    this.multiSampleCount = multisampleCount;
    this.presentationFormat = presentationFormat;
    if (this.presentationFormat) {
      this.colorTargets.push({ format: this.presentationFormat });
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
        cullMode: "back",
      },
      multisample: {
        count: this.multiSampleCount,
      },
    };
    if (this.needsDepth) {
      desc.depthStencil = {
        depthWriteEnabled: this.depthWriteEnabled,
        depthCompare: "less",
        format: "depth24plus",
      };
    }
    return desc;
  }
}
