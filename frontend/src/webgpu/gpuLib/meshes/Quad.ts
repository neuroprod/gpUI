import Mesh from "../Mesh";

export default class Quad extends Mesh {
  constructor(device: GPUDevice) {
    super(device, "Quad");

    const positionData: Float32Array = new Float32Array([
      -1,
      -1,
      0, //0
      -1,
      1,
      0, //1
      1,
      1,
      0, //2
      1,
      -1,
      0, //3
    ]);
    this.setVertices(positionData);

    const uvData: Float32Array = new Float32Array([
      0,
      1, //0
      0,
      0, //1
      1,
      0, //2
      1,
      1, //3
    ]);
    this.setUV0(uvData);

    const indices: Uint16Array = new Uint16Array([0, 2, 1 ,2, 0, 3]);
    this.setIndices(indices);
  }
}
