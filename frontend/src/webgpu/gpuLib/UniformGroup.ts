
import Uniform from "./Uniform";

import {BindGroup} from "./BindGroup";


export default class UniformGroup extends BindGroup{



    public buffer: GPUBuffer;
    public dataSize: number;
    public bufferData: Float32Array;
    public getAtModel =false;
    public uniforms:Array<Uniform> =[]


    constructor(device:GPUDevice,label:string) {
        super(device,label);


    }

    update()
    {
        this.updateData()
        this.updateBuffer()

    }


    addUniform(uniform:Uniform)
    {
        this.uniforms.push(uniform)
    }

    resolveUniforms(visibility: GPUShaderStageFlags)
    {
        let size =0
        for(let u of this.uniforms)
        {
            u.offset =size;
            size+=u.size;
        }
        let f=new Float32Array(size);
        for(let u of this.uniforms)
        {
            if(typeof u.defaultValue =="number"){
                f[u.offset] =u.defaultValue;
            }else{
                f.set(u.defaultValue, u.offset);
            }
        }

        this.makeBuffers(visibility,size,f);
    }

    /**
     * dataSize should be multiple of 16
     *
     * visibility: GPUShaderStage.FRAGMENT GPUShaderStage.VERTEX GPUShaderStage.COMPUTE
     *
     */
    makeBuffers(visibility: GPUShaderStageFlags,dataSize:number,defaultValue?:Float32Array)
    {
        this.dataSize = dataSize;
        const uniformBufferSize = dataSize * 4;//floats only???
        this.buffer = this.device.createBuffer({
            size: uniformBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        this.buffer.label ="uniformBuffer_"+this.label
        if(defaultValue){
            this.bufferData =defaultValue;
        }else
        {
            this.bufferData = new Float32Array(dataSize);
        }

        this.device.queue.writeBuffer(
            this.buffer,
            0,
            this.bufferData.buffer,
            this.bufferData.byteOffset,
            this.bufferData.byteLength
        );
        //implement multiple bindings?
        this.bindGroupLayout =this.device.createBindGroupLayout({
            label:"BindGroupLayout_"+this.label,
            entries: [{
                binding: 0,
                visibility:visibility,
                buffer: {},
            }]
        });


        this.bindGroup = this.device.createBindGroup({
            label : "BindGroup_"+this.label,
            layout: this.bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.buffer,
                    },
                },
            ],
        });

    }
    updateData(){

    }
    updateBuffer()
    {
        this.device.queue.writeBuffer(
            this.buffer,
            0,
            this.bufferData.buffer,
            this.bufferData.byteOffset,
            this.bufferData.byteLength
        );
    }



}
