import Mesh from "../../../webgpu/gpuLib/Mesh";


export default class BrushCircle extends Mesh {
    constructor(
        device: GPUDevice
    ) {
        super(device, "brushCircle");



        const subDivisions =20;
        const vertexCount: number = subDivisions;
        const positionData: Float32Array = new Float32Array(vertexCount * 3);
        const uvData: Float32Array = new Float32Array(vertexCount * 2);
//center
        positionData[0]=0;
        positionData[1]=0;
        positionData[2]=0;
        uvData[0]=1;
        uvData[1]=1;

        let posCount =3;
        let uvCount =2;
        const  angleStep = Math.PI*2/subDivisions;

        for(let i=0;i<subDivisions;i++)
        {
            let angel = angleStep*i;

            let x =Math.sin(angel);
            let y =Math.cos(angel);
            positionData[posCount++]=x;
            positionData[posCount++]=y;
            positionData[posCount++]=1;
            uvData[uvCount++] =0;
            uvData[uvCount++] =0;
        }


        this.setVertices(positionData);
        this.setUV0(uvData);

        const triCount: number = subDivisions;
        const indices: Uint16Array = new Uint16Array(triCount * 3);

        let indexCount =0;
        for (let i = 0; i < triCount-1; i++) {

                indices[indexCount++] =  i+1;
                indices[indexCount++] =0;
                indices[indexCount++] = i+ 2;


        }
        indices[indexCount++] = 0;
        indices[indexCount++] =1;
        indices[indexCount++] = triCount-1;

        this.setIndices(indices);

    }
}
