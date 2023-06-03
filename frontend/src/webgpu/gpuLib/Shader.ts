import UniformGroup from "./UniformGroup";
import Uniform, {UniformType} from "./Uniform";
import MathArray from "@math.gl/core/dist/classes/base/math-array";
import Attribute from "./Attribute";
import {TextureGroup} from "./TextureGroup";


export default class Shader {
    device: GPUDevice;
    shader: GPUShaderModule;

    samplers: Array<string> = [];
    textures: Array<string> = [];

    uniforms: Array<Uniform> = []
    attributes: Array<Attribute> = []
    private uniformText: string;
    private name: string;


    constructor(device: GPUDevice, name: string) {
        this.device = device;
        this.name = name;
    }

    addUniform(name: string, value: MathArray | number) {
        this.uniforms.push(new Uniform(name, value))
    }

    public addAttribute(name: string, length: number) {
        let at = new Attribute(name, length)
        at.slot = this.attributes.length;

        this.attributes.push(at);
    }

    public getShaderAttributes() {
        let a = ""
        for (let atr of this.attributes) {
            a += atr.getShaderText()
        }
        return a;
    }

    getUniformGroup(): UniformGroup {
        if (this.uniforms.length == 0) return null;
        let uniformGroup = new UniformGroup(this.device, "shader_" + this.name);
        for (let u of this.uniforms) {
            let newUnifrom = new Uniform(u.name, u.cloneValue())//uniforms should be cloned for the material
            uniformGroup.addUniform(newUnifrom)
        }
        uniformGroup.resolveUniforms(GPUShaderStage.FRAGMENT)
        return uniformGroup;
    }

    getTextureGroup() {
        if (this.textures.length + this.samplers.length == 0) return null
        let group =new TextureGroup(this.device,"shader_" + this.name);
        for (let s of this.samplers) {
            group.addSamplerLayout(s)
        }
        for (let s of this.textures) {
            group.addTextureLayout(s)
        }
        group.makeBindGroupLayout();
        return group;
    }

    public getShaderTexturesSamplers(id: number): string {
        let r=""
        let count =0
        for(let s of this.samplers)
        {
            r+="@group("+id+") @binding("+count+") var "+s+": sampler;\n"
            count++
        }
        for(let t of this.textures)
        {
            r+="@group("+id+") @binding("+count+") var "+t+": texture_2d<f32>;\n"
            count++
        }
        return r;

    }


    public getShaderUniforms(id: number): string {
        if (this.uniforms.length == 0) return "";
        return /* wgsl */`
/////////////////////////////////////////////////////////////////////////////////        
struct Uniforms
{
    ${this.uniformText}
}
@group(${id}) @binding(0)  var<uniform> uniforms : Uniforms;
/////////////////////////////////////////////////////////////////////////////////
`
    }

    getVertexBufferLayout() {

        let bufferLayout = []
        for (let atr of this.attributes) {
            bufferLayout.push({
                arrayStride: atr.length * 4,
                attributes: [{shaderLocation: atr.slot, offset: 0, format: atr.format}]
            })
        }
        return bufferLayout;
    }

    protected getShader(): string {
        return ``;
    }

    protected addTexture(texture: string) {
        this.textures.push(texture)
    }

    protected addSampler(sampler: string) {
        this.samplers.push(sampler)
    }

    protected makeShaders() {

        this.processUniforms();
        this.shader = this.device.createShaderModule({
            label:"shader_" + this.name,
            code: this.getShader(),
        });


    }

    private processUniforms() {
        this.uniformText = ""
        for (let uniform of this.uniforms) {
            this.uniformText += uniform.name + " : "
            if (uniform.type == UniformType.vec4) {
                this.uniformText += "vec4 <f32>,"
            }
            if (uniform.type == UniformType.vec2) {
                this.uniformText += "vec2 <f32>,"
            }
            if (uniform.type == UniformType.float) {
                this.uniformText += "f32,"
            }

        }


    }


}
