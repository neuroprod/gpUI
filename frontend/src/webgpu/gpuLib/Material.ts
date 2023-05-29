
import MathArray from "@math.gl/core/dist/classes/base/math-array";
import Shader from "./Shader";
import UniformGroup from "./UniformGroup";
import UniqueObject from "./UniqueObject";


export default class Material extends UniqueObject{


    pipeLine: GPURenderPipeline;
    private device: GPUDevice;
    shader: Shader;
    private bindGroupsLayouts:Array<GPUBindGroupLayout>=[]// @group(0),group(1)
    public uniformGroups:Array<UniformGroup>=[]
    private name: string;
    private presentationFormat: GPUTextureFormat
    private shaderUniforms: UniformGroup;

    constructor( device: GPUDevice,name:string,shader:Shader, presentationFormat: GPUTextureFormat) {
        super();
        this.device =device;
        this.presentationFormat =presentationFormat;
        this.shader =shader;
        this.name =name;
        this.shaderUniforms = this.shader.getUniformGroup();
        if(this.shaderUniforms) this.addUniformGroup( this.shaderUniforms )
    }

    setUniform(name:string, value :MathArray| number)
    {
        for(let f of this.shaderUniforms.uniforms)
        {
            if(f.name ==name)
            {
                if(typeof f.defaultValue =="number" && typeof value =="number" ){
                    this.shaderUniforms.bufferData[f.offset] =value
                }else if (typeof value !="number"){
                    this.shaderUniforms.bufferData.set(value,f.offset)
                }

                break;
            }
        }
        this.shaderUniforms.isDirty =true;

    }

    addUniformGroup(data:UniformGroup)
    {
        for(let udata of this.uniformGroups){
            if(udata.typeID ==data.typeID)return;
        }
        this.uniformGroups.push(data);

    }
    makePipeLine()
    {
        if(this.pipeLine)return;
        //sort first and plug in shader
        let slot =0;
        for(let data of this.uniformGroups){
            this.bindGroupsLayouts.push(data.bindGroupLayout)
            data.slot =slot;
            slot++
        }



        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts:
                this.bindGroupsLayouts
            ,
        });
        pipelineLayout.label ="Material_"+this.name;
        this.pipeLine = this.device.createRenderPipeline({
            label :"Material_"+this.name,
            layout: pipelineLayout,
            vertex: {
                module: this.shader.shader,
                entryPoint: 'mainVertex',
                buffers:this.shader.getVertexBufferLayout()
                ,
            },
            fragment: {
                module: this.shader.shader,
                entryPoint: 'mainFragment',
                targets: [
                    {
                        format: this.presentationFormat,

                    },
                ],
            },
            primitive: {
                topology: 'triangle-list',
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: 'less',

                format: 'depth24plus',
              },
            multisample: {
                count: 4,
            },
        });

    }



}
