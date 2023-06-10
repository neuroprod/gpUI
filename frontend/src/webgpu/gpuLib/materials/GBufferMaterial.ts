import Shader from "../Shader";
import { AbstractMaterial } from "./AbstractMaterial";

export default class GBufferMaterial extends AbstractMaterial {
  constructor(device: GPUDevice, label: string, shader: Shader) {
    super(device, label, shader);
    this.colorTargets.push({ format: "rgba16float" });
    this.colorTargets.push({ format: "rgb10a2unorm" });
    this.colorTargets.push({ format: "rgba8unorm" });
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
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth24plus",
      },
    };

    return desc;
  }
}
