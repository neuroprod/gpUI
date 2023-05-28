
import UniformGroup from "./UniformGroup";
import Uniform,{UniformType} from "./Uniform";
import MathArray from "@math.gl/core/dist/classes/base/math-array";


export default class Shader {
    device: GPUDevice;
    shader: GPUShaderModule;

    buffers: any;
    uniforms:Array<Uniform>=[]
    private uniformText: string;
    private name: string;

    constructor(device: GPUDevice, name: string) {
        this.device = device;
        this.name =name;
    }

    addUniform(name: string, value:   MathArray| number) {
        this.uniforms.push(new Uniform(name,value))
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
        let uniformGroup =new UniformGroup(this.device,"shader_"+this.name);
        for(let u of this.uniforms)
        {
            let newUnifrom =new Uniform(u.name,u.cloneValue())//uniforms should be cloned for the material
            uniformGroup.addUniform(newUnifrom)
        }
        uniformGroup.resolveUniforms(GPUShaderStage.FRAGMENT)
        return uniformGroup;
    }

    public getShaderData(id:number)
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

        this.processUniforms()
        this.shader = this.device.createShaderModule({
            code: this.getShader(),
        });
        this.shader.label="shader_"+this.name;
        this.buffers = [{
            arrayStride: 3 * 4,
            attributes: [
                {
                    // position
                    shaderLocation: 0,
                    offset: 0,
                    format: 'float32x3',
                },
            ],
        }]
    }



}
