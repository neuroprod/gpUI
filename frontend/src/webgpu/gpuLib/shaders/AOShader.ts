import Shader from "../Shader";
import {Vector3, Vector4} from "math.gl";
import Camera from "../Camera";



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
    getKernel()
    {
        let numSamples =32;
        let s ="const kernel = array<vec3f, "+numSamples+">("
        for (let i = 0; i < numSamples; i++) {
            let v = new Vector3(Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0,Math.random());
            v.normalize();
            v.z+=1.;
            v.normalize();
            v.scale(Math.random())

            s+= "vec3("+v.x+", "+v.y+","+v.z+"),"
        }
        s+=" );"
        return s;
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
${Camera.getShaderUniforms(2)}
${this.getKernel()}

const radius :f32 =0.4;
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
     let randomVec =normalize(vec3f(random(uv),random(uv.yx +vec2f(3.9333)),random(uv.yx+vec2f(0.9))));
     let tangent   = normalize(randomVec - normal * dot(randomVec, normal));
     let bitangent = cross(normal, tangent);
     let TBN       = mat3x3<f32>(tangent, bitangent, normal); 
      
      
      var value  =0.0;
     for (var i: i32 = 0; i < 25; i++) {
        let samplePos3D = (TBN*(kernel[i]*radius))+position;
 
        let posDistance  =distance(samplePos3D,camera.cameraWorld);
        let pos2D = camera.viewProjection*vec4f(  samplePos3D,1.0);
        var uvSample = pos2D.xy;
        uvSample/=pos2D.w*2.0;
        uvSample+=vec2f(0.5);
        uvSample.y = 1.0- uvSample.y ;
        let uvK = clamp(vec2<i32>(floor( uvSample*uniforms.size.xy)),vec2<i32>(0,0),vec2<i32>(floor(uniforms.size.xy)));
      
        let positionKernel=textureLoad(texturePosition,   uvK,0).xyz;
        
         let sampleDistance  =distance(positionKernel,camera.cameraWorld);
         let dif = posDistance-sampleDistance;
        /* if(dif<radius){
          value+=1.0;//-smoothstep(0.0, radius,dif);
         }*/
        value+=1.0-smoothstep(0.0, radius,dif);
         
     }
     value/=32.0;
       
     return  vec4f(vec3f(value),1.0);
}
///////////////////////////////////////////////////////////
`;
    }
}
