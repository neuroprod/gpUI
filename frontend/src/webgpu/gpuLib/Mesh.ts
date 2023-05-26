export default class Mesh
{
    private verticesBuffer: GPUBuffer;

    constructor(device:GPUDevice) {

        let vertices = new Float32Array([0.5,0.5,0.2,0.2,0,0.8]);
        this.verticesBuffer = device.createBuffer({
            size: vertices.byteLength,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true,
        });
        new Float32Array(this.verticesBuffer.getMappedRange()).set(vertices );

        this.verticesBuffer.unmap();
        console.log(this.verticesBuffer)

    }
}
