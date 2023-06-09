import { BindGroup } from "./BindGroup";
import TextureUniform from "./TextureUniform";
import { lazy } from "react";
class TextureLayout {
  textureUniform!: TextureUniform;
  name!: string;
  index!: number;
  texture!: GPUTexture;
}
class SamplerLayout {
  name!: string;
  index!: number;
  sampler!: GPUSampler;
}
export class TextureGroup extends BindGroup {
  textureLayouts: Array<TextureLayout> = [];
  samplerLayouts: Array<SamplerLayout> = [];
  //public bindGroupLayout: GPUBindGroupLayout;
  //public bindGroup: GPUBindGroup;
  private indexCount: number;

  constructor(device: GPUDevice, label: string) {
    super(device, label);
    this.indexCount = 0;
  }
  public addTextureLayout(t: TextureUniform) {
    let tl = new TextureLayout();
    tl.name = t.name;
    tl.textureUniform = t;
    tl.index = this.indexCount;
    this.textureLayouts.push(tl);
    this.indexCount++;
  }
  public addSamplerLayout(s: string) {
    let sl = new SamplerLayout();
    sl.name = s;
    sl.index = this.indexCount;
    this.samplerLayouts.push(sl);
    this.indexCount++;
  }
  public makeBindGroupLayout() {
    let ent = [];
    for (let s of this.samplerLayouts) {
      let e = {
        binding: s.index,
        visibility: GPUShaderStage.FRAGMENT,
        sampler: {},
      };

      ent.push(e);
    }
    for (let s of this.textureLayouts) {
      let e = {
        binding: s.index,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {
          sampleType: s.textureUniform.samplerType,
        },
      };

      ent.push(e);
    }

    this.bindGroupLayout = this.device.createBindGroupLayout({
      label: this.label + "_textureGroup",
      entries: ent,
    });
  }
  public update() {
    let ent = [];
    for (let s of this.samplerLayouts) {
      let e = {
        binding: s.index,
        resource: s.sampler,
      };

      ent.push(e);
    }
    for (let t of this.textureLayouts) {
      if (!t.texture) {
        console.log(this.label);
      }
      let e = {
        binding: t.index,
        resource: t.texture.createView(),
      };

      ent.push(e);
    }
    this.bindGroup = this.device.createBindGroup({
      label: this.label + "_textureGroup",
      layout: this.bindGroupLayout,
      entries: ent,
    });
  }
  public setTexture(texture: GPUTexture, name) {
    for (let a of this.textureLayouts) {
      if (a.name == name) {
        if (a.texture !== texture) {
          this.isDirty = true;
          a.texture = texture;
        }
        return;
      }
    }
  }
  public setSampler(sampler: GPUSampler, name) {
    this.isDirty = true;
    for (let a of this.samplerLayouts) {
      if (a.name == name) {
        a.sampler = sampler;
        return;
      }
    }
  }
}
