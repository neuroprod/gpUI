import TextBatch from "../draw/TextBatch";


export default class TextBatchGL {
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
    setRenderData(textBatch:TextBatch) {
        const gl = this.gl;
        let newVertexSize = textBatch.vertexData.length * 20;
        if (newVertexSize > this.vertexSize) {
            this.firstV = true;
        }
        this.vertexSize = newVertexSize;
        if (textBatch.indices.length > this.numIndices) {
            this.firstI = true;
        }
        this.numIndices = textBatch.indices.length;

        let buffer = new ArrayBuffer(this.vertexSize);
        let dv = new DataView(buffer);

        for (let i = 0; i < textBatch.vertexData.length; i++) {
            let data = textBatch.vertexData[i];
            let index =i*20;


            dv.setFloat32(index, data.vert.x, true);
            dv.setFloat32(index + 4, data.vert.y, true);
            dv.setFloat32(index+8, data.uv.x, true);
            dv.setFloat32(index + 12, data.uv.y, true);
            dv.setInt8(index + 16, data.color.r * 0xFF);
            dv.setInt8(index + 17, data.color.g * 0xFF);
            dv.setInt8(index + 18, data.color.b * 0xFF);
            dv.setInt8(index + 19, data.color.a * 0xFF);

        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        if (this.firstV) {
            gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.DYNAMIC_DRAW);
        } else {

            gl.bufferSubData(gl.ARRAY_BUFFER, 0, buffer);
        }


        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        if (this.firstI) {
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(textBatch.indices), gl.DYNAMIC_DRAW);
        } else {
            gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(textBatch.indices));
        }


    }
}
