
import UniformGroup from "./UniformGroup";
import Uniform,{UniformType} from "./Uniform";
import MathArray from "@math.gl/core/dist/classes/base/math-array";
import Attribute from "./Attribute";


export default class Shader {
    device: GPUDevice;
    shader: GPUShaderModule;


    uniforms:Array<Uniform>=[]
    attributes:Array<Attribute>=[]
    private uniformText: string;
    private name: string;



    constructor(device: GPUDevice, name: string) {
        this.device = device;
        this.name =name;
    }

    addUniform(name: string, value:   MathArray| number) {
        this.uniforms.push(new Uniform(name,value))
    }

    public addAttribute(name:string,length:number)
    {
        let at =new Attribute(name,length)
        at.slot =this.attributes.length;

        this.attributes.push(at);
    }

    public getShaderAttributes()
    {
        let a=""
        for(let atr of this.attributes)
        {
            a+=atr.getShaderText()
        }
        return a;
    }

    protected getShader(): string {
        return ``;
    }
    private processUniforms() {
        this.uniformText =""
        for(let uniform of  this.uniforms)
        {
            this.uniformText +=uniform.name + " : "
            if(uniform.type==UniformType.vec4)
            {
                this.uniformText  += "vec4 <f32>,"
            }
            if(uniform.type==UniformType.float)
            {
                this.uniformText  += "f32,"
            }

        }


    }
    getUniformGroup()
    {
        if(this.uniforms.length==0)return null;
        let uniformGroup =new UniformGroup(this.device,"shader_"+this.name);
        for(let u of this.uniforms)
        {
            let newUnifrom =new Uniform(u.name,u.cloneValue())//uniforms should be cloned for the material
            uniformGroup.addUniform(newUnifrom)
        }
        uniformGroup.resolveUniforms(GPUShaderStage.FRAGMENT)
        return uniformGroup;
    }


    public getShaderUniforms(id:number)
    {
        if(this.uniforms.length==0) return"";
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
    protected makeShaders() {

        this.processUniforms();
        this.shader = this.device.createShaderModule({
            code: this.getShader(),
        });
        this.shader.label="shader_"+this.name;

    }


    getVertexBufferLayout() {

        let bufferLayout=[]
        for(let atr of this.attributes) {
            bufferLayout.push({arrayStride: atr.length * 4, attributes: [{shaderLocation: atr.slot, offset: 0, format: atr.format}]})
        }
        return  bufferLayout;
    }
}
