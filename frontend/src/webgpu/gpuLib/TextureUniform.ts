export default class TextureUniform {
  public name: string;
  public samplerType: GPUTextureSampleType;
  constructor(name: string, samplerType: GPUTextureSampleType = "float") {
    this.name = name;
    this.samplerType = samplerType;
  }
}
