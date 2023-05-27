import Mesh from "../gpuLib/Mesh";

export default class TestMesh2 extends Mesh
{

    constructor(device:GPUDevice) {
        super(device,"testMesh2");
        let vertices = new Float32Array([0.3,0.5,0.0,0.4,0.2,0.0,0,-0.8,0]);
        this.setVertices(vertices)
    }

}
