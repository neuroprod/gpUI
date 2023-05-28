export default class Mesh {
    public verticesBuffer: GPUBuffer;
    public numVertices: GPUSize32;
    public vertexSize = 3;


    public indexBuffer: GPUBuffer;
    public numIndices: GPUSize32;
    public hasIndices: boolean = false;


    private device: GPUDevice;
    private name: string;
  

    constructor(device: GPUDevice, name: string) {
        this.device = device;
        this.name = name

    }
    setVertices(vertices: Float32Array) {
        this.numVertices = vertices.length / this.vertexSize
        this.verticesBuffer = this.createBuffer(vertices, this.name + "_vertices")
    }
    createBuffer(data: Float32Array, name: string) {
        const buffer = this.device.createBuffer({
            size: data.byteLength,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true,
        });
        //const dst = new data.constructor(buffer.getMappedRange());
        const dst = new Float32Array(buffer.getMappedRange());
        // const dst:Float32Array = buffer.getMappedRange() as Float32Array;

        dst.set(data);

        buffer.unmap();
        buffer.label = "vertexBuffer_" + name;
        return buffer;
    }

    setIndices(indices: Uint16Array) {
        this.hasIndices = true;
        this.numIndices = indices.length


        this.indexBuffer = this.device.createBuffer({
            size: indices.byteLength,
            usage: GPUBufferUsage.INDEX,
            mappedAtCreation: true,
        });

        const dst = new Uint16Array(this.indexBuffer.getMappedRange());
        dst.set(indices);

        this.indexBuffer.unmap();
        this.indexBuffer.label = "indexBuffer_" + this.name;

    }


    destroy() {
        if (this.verticesBuffer) this.verticesBuffer.destroy()
    }
}
