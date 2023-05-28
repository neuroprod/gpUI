
import MathArray from "@math.gl/core/dist/classes/base/math-array";
import Shader from "./Shader";
import UniformGroup from "./UniformGroup";
import UniqueObject from "./UniqueObject";


export default class Material extends UniqueObject{


    pipeLine: GPURenderPipeline;
    private device: GPUDevice;
    private shader: Shader;
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
        this.addUniformGroup( this.shaderUniforms )
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
        this.shaderUniforms.updateBuffer()
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
        for(let data of this.uniformGroups){
            this.bindGroupsLayouts.push(data.bindGroupLayout)

        }



        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts:
                this.bindGroupsLayouts
            ,
        });
        pipelineLayout.label ="Material_"+this.name;
        this.pipeLine = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: this.shader.shader,
                entryPoint: 'mainVertex',
                buffers:this.shader.buffers
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
        this.pipeLine.label ="Material_"+this.name;
    }



}
