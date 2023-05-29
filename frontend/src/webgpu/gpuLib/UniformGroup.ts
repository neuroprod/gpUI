
import Uniform from "./Uniform";
import UniqueObject from "./UniqueObject";


export default class UniformGroup extends UniqueObject{

    private static allGroups:Array<UniformGroup>=[]
    public device: GPUDevice;
    public buffer: GPUBuffer;
    public dataSize: number;
    public bufferData: Float32Array;
    public bindGroupLayout: GPUBindGroupLayout;
    public bindGroup: GPUBindGroup;
    public typeID =0
    public getAtModel =false;
    public label:string;
    public uniforms:Array<Uniform> =[]
    public isDirty:boolean=false;
    public slot: number;
    constructor(device:GPUDevice,label:string) {
        super();
        this.device = device;
        this.label =label;
        UniformGroup.allGroups.push(this);
    }
    static updateGroups()
    {
        let dirtyCount =0
        for(let group of this.allGroups)
        {
            if(group.isDirty){
                group.updateData()
                group.updateBuffer()
                group.isDirty =false;
                dirtyCount++;
            }
        }
        //console.log("updatedBuffers "+dirtyCount+"/"+this.allGroups.length )
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
     * dataSize should be multiple of 4, ->  16 bit align
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
            entries: [{
                binding: 0,
                visibility:visibility,
                buffer: {},
            }]
        });
        this.bindGroupLayout.label = "BindGroupLayout_"+this.label;

        this.bindGroup = this.device.createBindGroup({
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
        this.bindGroup.label = "BindGroup_"+this.label;
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
