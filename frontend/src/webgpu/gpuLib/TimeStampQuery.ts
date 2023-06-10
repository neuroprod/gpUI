export default class TimeStampQuery{
    private querySet: GPUQuerySet;
    private queryBuffer: GPUBuffer;
    private capacity: number =2;
    private device: GPUDevice;
    public totalTime: number=0;
    public timeArray:Array<number>;
    constructor(device:GPUDevice) {
        this.device =device;
        this.capacity = 7;//Max number of timestamps we can store
        this.timeArray=new Array<number>(this.capacity);


        this.querySet = device.createQuerySet({
            type: "timestamp",
            count: this.capacity,
        });
        this.queryBuffer = device.createBuffer({
            size: 8 * this.capacity,
            usage: GPUBufferUsage.QUERY_RESOLVE
                | GPUBufferUsage.STORAGE
                | GPUBufferUsage.COPY_SRC
                | GPUBufferUsage.COPY_DST,
        });

    }
    start(commandEncoder: GPUCommandEncoder)
    {
        this.setStamp(commandEncoder,0);
    }
    setStamp(commandEncoder: GPUCommandEncoder,index:number){
        commandEncoder.writeTimestamp(this.querySet, index);
    }
    stop(commandEncoder: GPUCommandEncoder){
        commandEncoder.writeTimestamp(this.querySet, this.capacity-1);
        commandEncoder.resolveQuerySet(
            this.querySet,
            0,// index of first query to resolve
            this.capacity,//number of queries to resolve
            this.queryBuffer,
            0);// destination offset
    }
    finish(){
        const arrayBuffer = this.readBuffer(this.device, this.queryBuffer);
        arrayBuffer.then((value)=>{
        const timingsNanoseconds = new BigInt64Array(value);
        this.totalTime =(Number((timingsNanoseconds[this.capacity-1]-timingsNanoseconds[0]))/1000000);
       // console.log( timingsNanoseconds)
        for(let i=0;i<this.capacity-1;i++)
        {

            this.timeArray[i] = (Number((timingsNanoseconds[i+1]-timingsNanoseconds[i]))/1000000);

        }
        })
        //const timingsNanoseconds = new BigInt64Array(arrayBuffer);

    }
    async  readBuffer(device:GPUDevice, buffer:GPUBuffer) {
        const size = buffer.size;
        const gpuReadBuffer = device.createBuffer({size, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });
        const copyEncoder = device.createCommandEncoder();
        copyEncoder.copyBufferToBuffer(buffer, 0, gpuReadBuffer, 0, size);
        const copyCommands = copyEncoder.finish();
        device.queue.submit([copyCommands]);
        await gpuReadBuffer.mapAsync(GPUMapMode.READ);
        return gpuReadBuffer.getMappedRange();
    }
}
