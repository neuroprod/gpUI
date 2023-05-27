import UniqueObject from "./UniqueObject";


export default class UniformData extends UniqueObject{
    public device: GPUDevice;
    public buffer: GPUBuffer;
    public dataSize: number;
    public bufferData: Float32Array;
    public bindGroupLayout: GPUBindGroupLayout;
    public bindGroup: GPUBindGroup;
    public typeID =0
    public getAtModel =false;
    constructor(device:GPUDevice) {
        super();
        this.device = device;

    }

    /**
     * dataSize should be multiple of 4, ->  16 bit align
     *
     * visibility: GPUShaderStage.FRAGMENT GPUShaderStage.VERTEX GPUShaderStage.COMPUTE
     *
     */
    makeBuffers(label:string,visibility: GPUShaderStageFlags,dataSize:number,defaultValue?:Float32Array)
    {
        this.dataSize = dataSize;
        const uniformBufferSize = dataSize * 4;//floats only???
        this.buffer = this.device.createBuffer({
            size: uniformBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        this.buffer.label ="uniformBuffer_"+label
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
        this.bindGroupLayout.label = "BindGroupLayout_"+label;

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
        this.bindGroup.label = "BindGroup_"+label;
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
