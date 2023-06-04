import Shader from "../Shader";
import {Vector4} from "math.gl";



export default class CombineShader extends Shader
{

    constructor(device: GPUDevice) {
        super(device,'TextureShader3D');

        //set needed atributes
        this.addAttribute("position",3);
        this.addAttribute("uv0",2);
        //set needed uniforms
        this.addUniform("size",new Vector4(1,1,0,1));

        this.addTexture("ao",'unfilterable-float');
        this.addTexture("albedo",'unfilterable-float');
        this.addTexture("normal",'unfilterable-float');
        this.makeShaders();
    }

    getShader(): string {


        return /* wgsl */`
///////////////////////////////////////////////////////////      
struct VertexOutput
{
    @location(0) uv : vec2f,
    @builtin(position) position : vec4f
  
}

${this.getShaderTexturesSamplers(0)}
${this.getShaderUniforms(1)}

@vertex
fn mainVertex( ${this.getShaderAttributes()} ) -> VertexOutput
{
    var output : VertexOutput;
    output.position = vec4( position,1.0);
    output.uv = uv0;
    return output;
}

@fragment
fn mainFragment(@location(0) uv: vec2f,) -> @location(0) vec4f
{
     let ao = textureLoad(ao,   vec2<i32>(floor(uv*uniforms.size.xy)),0).x;
     
     var color = textureLoad(albedo,   vec2<i32>(floor(uv*uniforms.size.xy)),0).xyz;
     let N = textureLoad(normal,   vec2<i32>(floor(uv*uniforms.size.xy)),0).xyz;
     let tempLight =dot(N,vec3f(0.0,1.0,0.0))*0.2+0.8;
     color*=vec3f((1.0-ao)*tempLight);
   
     return  vec4(color,1.0);
}
///////////////////////////////////////////////////////////
`;
    }
}
