
import Shader from "./Shader";
import UniformData from "./UniformData";
import UniqueObject from "./UniqueObject";


export default class Material extends UniqueObject{


    pipeLine: GPURenderPipeline;
    private device: GPUDevice;
    private shader: Shader;
    private bindGroupsLayouts:Array<GPUBindGroupLayout>=[]// @group(0),group(1)
    public uniformData:Array<UniformData>=[]
    private name: string;
    private presentationFormat: GPUTextureFormat
    constructor( device: GPUDevice,name:string,shader:Shader, presentationFormat: GPUTextureFormat) {
        super();
        this.device =device;
        this.presentationFormat =presentationFormat;
        this.shader =shader;
        this.name =name;




    }
    addUniformData(data:UniformData)
    {
        for(let udata of this.uniformData){
            if(udata.typeID ==data.typeID)return;
        }

        this.uniformData.push(data);

    }
    makePipeLine()
    {
        //sort first and plug in shader
        for(let data of this.uniformData){
            this.bindGroupsLayouts.push(data.bindGroupLayout)

        }



        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts:
                this.bindGroupsLayouts
            ,
        });

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
        });
    }



}
