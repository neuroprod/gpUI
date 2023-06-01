export default class Mesh {
    public verticesBuffer: GPUBuffer;
    public numVertices: GPUSize32;


    public indexBuffer: GPUBuffer;
    public numIndices: GPUSize32;
    public hasIndices: boolean = false;


    private device: GPUDevice;
    private name: string;


    private buffers:Array<GPUBuffer>=[];
    private bufferMap:Map<string,GPUBuffer> =new Map<string,GPUBuffer>();

    constructor(device: GPUDevice, name: string) {
        this.device = device;
        this.name = name
    }

    setVertices(vertices: Float32Array) {
        this.numVertices = vertices.length;
        this.createBuffer(vertices, "position");
    }

    setNormals(normals: Float32Array) {
        this.createBuffer(normals, "normal");
    }

    setUV0(uv0: Float32Array) {
        this.createBuffer(uv0, "uv0");
    }


    createBuffer(data: Float32Array, name: string) {

        const buffer = this.device.createBuffer({
            size: data.byteLength,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true,
        });
        const dst = new Float32Array(buffer.getMappedRange());
        dst.set(data);

        buffer.unmap();
        buffer.label = "vertexBuffer_" + this.name + "_" + name;

        this.buffers.push(buffer);
        this.bufferMap.set(name, buffer);

    }

    setIndices(indices: Uint16Array) {
        this.hasIndices = true;
        this.numIndices = indices.length
        let size =Math.ceil(indices.byteLength/4)*4
        this.indexBuffer = this.device.createBuffer({
            size: size,
            usage: GPUBufferUsage.INDEX,
            mappedAtCreation: true,
        });

        const dst = new Uint16Array(this.indexBuffer.getMappedRange());
        dst.set(indices);

        this.indexBuffer.unmap();
        this.indexBuffer.label = "indexBuffer_" + this.name;

    }


    destroy() {
        if (this.indexBuffer) this.indexBuffer.destroy()
    }

    getBufferByName(name: string) {
        return this.bufferMap.get(name);
    }
}
