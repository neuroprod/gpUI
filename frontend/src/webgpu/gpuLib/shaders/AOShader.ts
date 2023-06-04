import Shader from "../Shader";
import {Vector4} from "math.gl";



export default class AOShader extends Shader
{

    constructor(device: GPUDevice) {
        super(device,'AOShader');

        //set needed atributes
        this.addAttribute("position",3);
        this.addAttribute("uv0",2);
        //set needed uniforms
        this.addUniform("size",new Vector4(1,1,0,1));

        this.addTexture("textureNormal",'unfilterable-float');
        this.addTexture("texturePosition",'unfilterable-float');

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


fn random(st : vec2f ) -> f32 {
  return fract(sin(dot(st.xy, vec2f(12.9898, 78.233))) * 43758.5453123);
}

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
     let normal=textureLoad(textureNormal,   vec2<i32>(floor(uv*uniforms.size.xy)),0).xyz;
     let position=textureLoad(texturePosition,   vec2<i32>(floor(uv*uniforms.size.xy)),0).xyz;
     let randomVec =vec3f(random(position.xy),random(position.yz),random(position.xz));
     let  tangent   = normalize(randomVec - normal * dot(randomVec, normal));
     let bitangent = cross(normal, tangent);
     let TBN       = mat3x3<f32>(tangent, bitangent, normal);  
     
     
     return  vec4f(TBN*normal,1.0);
}
///////////////////////////////////////////////////////////
`;
    }
}
