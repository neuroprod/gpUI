export enum ShaderType {
    float,
    vec4,

}

class UniformShaderData
{
    public name;
    public type:ShaderType
    public defaultValue:Array<number> | number

    constructor(name: string, type:ShaderType,defaultValue: Array<number> | number) {

        this.name =name;
        this.type =type;
        this.defaultValue =defaultValue;
    }

}
export default class Shader {
    device: GPUDevice;
    shader: GPUShaderModule;

    buffers: any;
    uniformShaderData:Array<UniformShaderData>=[]
    private unformText: string;

    constructor(device: GPUDevice, name: string) {
        this.device = device;

    }

    addUniform(name: string, type:ShaderType,defaultValue: Array<number> | number) {
        this.uniformShaderData.push(new UniformShaderData(name,type,defaultValue))
    }

    protected getShader(): string {
        return ``;
    }
    private processUniforms() {
        this.unformText =""
        for(let uniform of  this.uniformShaderData)
        {
            this.unformText +=uniform.name + " : "
            if(uniform.type==ShaderType.vec4)
            {
                this.unformText  += "vec4 <f32>,"
            }

        }


    }
    public getShaderData(id:number)
    {
        if(this.uniformShaderData.length==0) return"";
        return `
        struct Uniforms
        {
            ${this.unformText}
        }
        @group(${id}) @binding(0)  var<uniform> unifoms : Uniforms;
`
    }
    protected makeShaders() {

        this.processUniforms()
        this.shader = this.device.createShaderModule({
            code: this.getShader(),
        });

        this.buffers = [{
            arrayStride: 3 * 4,
            attributes: [
                {
                    // position
                    shaderLocation: 0,
                    offset: 0,
                    format: 'float32x2',
                },
            ],
        }]
    }



}
