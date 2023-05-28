import Mesh from "../gpuLib/Mesh";

export default class TestMesh1 extends Mesh
{

    constructor(device:GPUDevice) {
        super(device,"testMesh1");
        let vertices = new Float32Array([0.5,0.5,0.0,0.2,-0.3,0.0,0,0.8,0]);
        this.setVertices(vertices)
    }

}
