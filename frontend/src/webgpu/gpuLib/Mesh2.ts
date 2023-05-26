export default class Mesh
{
    private verticesBuffer: GPUBuffer;

    constructor(device:GPUDevice) {

        let vertices = new Float32Array([-1,-1,0,0,0,-1]);
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
