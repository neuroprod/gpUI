import FillBatch from "../draw/FillBatch";

export default class FillBatchGPU {
    private device: GPUDevice;
    private vertexBuffer: GPUBuffer;
    private indexBuffer: GPUBuffer;

    constructor(device: GPUDevice) {

        this.device = device

        // this.vertexBuffer = gl.createBuffer();
        // this.indexBuffer = gl.createBuffer();


    }

    destroy() {
        //if(this.vertexBuffer)  this.gl.deleteBuffer(this.vertexBuffer);
        //  if(this.indexBuffer)  this.gl.deleteBuffer(this.indexBuffer);
        //this.numIndices = 0;
    }

    setRenderData(fillBatch: FillBatch) {
        if (fillBatch.indices.length == 0) return;

       // console.log(fillBatch.indices.length)
       // console.log(fillBatch.vertices.length)
        //TODO reuse buffers if posible
////vertices
        let vertices = new Float32Array(fillBatch.vertices);

        if (this.vertexBuffer) this.vertexBuffer.destroy()
        this.vertexBuffer = this.device.createBuffer({
            size: vertices.byteLength,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true,
        });
        const dstV = new Float32Array(this.vertexBuffer.getMappedRange());
        dstV.set(vertices);

        this.vertexBuffer.unmap();
        this.vertexBuffer.label = "UI_fill_vertexBuffer";

////indices
        let indices = new Float32Array(fillBatch.vertices);
        if (this.indexBuffer) this.indexBuffer.destroy()
        this.indexBuffer = this.device.createBuffer({
            size: indices.byteLength,
            usage: GPUBufferUsage.INDEX,
            mappedAtCreation: true,
        });

        const dstI = new Uint16Array(this.indexBuffer.getMappedRange());
        dstI.set(indices);

        this.indexBuffer.unmap();
        this.indexBuffer.label = "UI_fill_indexBuffer";
    }

}
