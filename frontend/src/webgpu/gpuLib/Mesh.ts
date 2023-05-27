export default class Mesh
{
    public verticesBuffer: GPUBuffer;
    public numVertices: GPUSize32;
    public vertexSize =3;

    private device: GPUDevice;
    private name: string;

    constructor(device:GPUDevice,name:string) {
        this.device =device;
        this.name =name

    }
    setVertices(vertices:Float32Array)
    {
        this.numVertices =vertices.length/this.vertexSize
        this.verticesBuffer =this.createBuffer(vertices,this.name+"_vertices" )
    }
    createBuffer( data:Float32Array, name:string) {
        const buffer = this.device.createBuffer({
            size: data.byteLength,
            usage:GPUBufferUsage.VERTEX,
            mappedAtCreation: true,
        });
        const dst = new data.constructor(buffer.getMappedRange());
        dst.set(data);
        buffer.unmap();
        buffer.label ="vertexBuffer_"+name;
        return buffer;
    }
    destroy()
    {
        if(this.verticesBuffer)this.verticesBuffer.destroy()
    }
}
