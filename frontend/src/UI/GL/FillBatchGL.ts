
import FillBatch from "../draw/FillBatch";


export default class FillBatchGL {
    private gl: WebGL2RenderingContext|WebGLRenderingContext;
    vertexBuffer: WebGLBuffer;
    indexBuffer: WebGLBuffer;
    private firstV = true;
    private firstI = true;
    private vertexSize = 0;
    numIndices =0;
    constructor(gl:WebGL2RenderingContext|WebGLRenderingContext) {

        this.gl = gl;
        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();


    }
    destroy()
    {
        this.gl.deleteBuffer(this.vertexBuffer);
        this.gl.deleteBuffer(this.indexBuffer);
        this.numIndices = 0;
    }
    setRenderData(fillBatch:FillBatch) {

        const gl = this.gl;
        let newVertexSize = fillBatch.vertexData.length * 12;
        if (newVertexSize > this.vertexSize) {
            this.firstV = true;
        }
        this.vertexSize = newVertexSize;
        if (fillBatch.indices.length > this.numIndices) {
            this.firstI = true;
        }
        this.numIndices = fillBatch.indices.length;

        let buffer = new ArrayBuffer(this.vertexSize);
        let dv = new DataView(buffer);

        for (let i = 0; i < fillBatch.vertexData.length; i++) {
            let data = fillBatch.vertexData[i];
            let index = i * 12;
            dv.setFloat32(index, data.vert.x, true);
            dv.setFloat32(index + 4, data.vert.y, true);
            dv.setInt8(index + 8,  Math.round(data.color.r * 0xFF));
            dv.setInt8(index + 9,  Math.round(data.color.g * 0xFF));
            dv.setInt8(index + 10,  Math.round(data.color.b * 0xFF));
            dv.setInt8(index + 11, Math.round(data.color.a * 0xFF));

        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        if (this.firstV) {
            gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.DYNAMIC_DRAW);
        } else {

            gl.bufferSubData(gl.ARRAY_BUFFER, 0, buffer);
        }


        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        if (this.firstI) {
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(fillBatch.indices), gl.DYNAMIC_DRAW);
        } else {
            gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(fillBatch.indices));
        }


    }
}
