import Shader from "../Shader";
import {Vector4} from "math.gl";



export default class DofBlurShader extends Shader
{

    constructor(device: GPUDevice) {
        super(device,'dofBlurShader');

        //set needed atributes
        this.addAttribute("position",3);
        this.addAttribute("uv0",2);
        //set needed uniforms
        this.addUniform("size",new Vector4(1,1,0,1));

        this.addTexture("texture1",'unfilterable-float');//implement texture types


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

    let uvPos =vec2<i32>(floor(uv*uniforms.size.xy ));
    var color =vec3f(0.0);
    var div =0.0;
    var w = 0.0;
    let rC =textureLoad(texture1,  uvPos,0);
    let base = rC.xyz;
    let m = rC.w;
    for(var i=-2;i<3;i+=1)
    {
        for(var j=-2;j<3;j+=1)
        {
            let uv =uvPos+vec2<i32>(j,i);
            let r =textureLoad(texture1,   uv,0);

            color+=r.xyz *r.w;
            div+=r.w;
        }
    }

 
    color/=div;
    color = clamp(color,vec3f(0.0),vec3f(1.0));
    let b =base*(1.0-m) +color*(m);

     return vec4(b,rC.w);
}
///////////////////////////////////////////////////////////
`;
    }
}
