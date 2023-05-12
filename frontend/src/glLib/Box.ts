import GL from "./GL";
import {vec3} from "gl-matrix";
import Program from "./Program";


class Vector {
    x =0;
    y=0;
    z=0;
}

export default class Box
{
    private gl: WebGL2RenderingContext;
    private planeVertexBuffer: WebGLBuffer;
    private planeUVBuffer: WebGLBuffer;
    private planeNormalBuffer: WebGLBuffer;
    private indexBuffer: WebGLBuffer;
    private numIndices: number;


    constructor(glMain:GL,width = 1, height = 2, depth = 3 ) {

        this.gl =glMain.gl
       let widthSegments = 1;
        let  heightSegments =1 ;
        let  depthSegments =1 ;

        const indices: Array<number> = [];
        const vertices: Array<number> = [];
        const normals: Array<number> = [];
        const uvs: Array<number> = [];

        // helper variables
        type VectorProps = { x: number; y: number; z: number };
        let numberOfVertices = 0;

        const buildPlane = (
            u: keyof VectorProps,
            v: keyof VectorProps,
            w: keyof VectorProps,
            udir: number,
            vdir: number,
            width: number,
            height: number,
            depth: number,
            gridX: number,
            gridY: number,

        ) => {
            const segmentWidth = width / gridX;
            const segmentHeight = height / gridY;

            const widthHalf = width / 2;
            const heightHalf = height / 2;
            const depthHalf = depth / 2;

            const gridX1 = gridX + 1;
            const gridY1 = gridY + 1;

            let vertexCounter = 0;

            const vector =new Vector;
            // generate vertices, normals and uvs
            for (let iy = 0; iy < gridY1; iy++) {
                const y = iy * segmentHeight - heightHalf;
                for (let ix = 0; ix < gridX1; ix++) {
                    const x = ix * segmentWidth - widthHalf;

                    // set values to correct vector component
                    vector[u] = x * udir;
                    vector[v] = y * vdir;
                    vector[w] = depthHalf;

                    // now apply vector to vertex buffer
                    vertices.push(vector.x, vector.y, vector.z);

                    // set values to correct vector component
                    vector[u] = 0;
                    vector[v] = 0;
                    vector[w] = depth > 0 ? 1 : -1;

                    // now apply vector to normal buffer
                    normals.push(vector.x, vector.y, vector.z);

                    // uvs
                    uvs.push(ix / gridX);
                    uvs.push(1 - iy / gridY);

                    // counters
                    vertexCounter += 1;
                }
            }

            // indices

            // 1. you need three indices to draw a single face
            // 2. a single segment consists of two faces
            // 3. so we need to generate six (2*3) indices per segment
            for (let iy = 0; iy < gridY; iy++) {
                for (let ix = 0; ix < gridX; ix++) {
                    const a = numberOfVertices + ix + gridX1 * iy;
                    const b = numberOfVertices + ix + gridX1 * (iy + 1);
                    const c = numberOfVertices + (ix + 1) + gridX1 * (iy + 1);
                    const d = numberOfVertices + (ix + 1) + gridX1 * iy;

                    // faces
                    indices.push(a, b, d);
                    indices.push(b, c, d);
                }
            }

            // update total number of vertices
            numberOfVertices += vertexCounter;
        };

        buildPlane('z', 'y', 'x', -1, -1, depth, height, width, depthSegments, heightSegments); // px
        buildPlane('z', 'y', 'x', 1, -1, depth, height, -width, depthSegments, heightSegments); // nx
        buildPlane('x', 'z', 'y', 1, 1, width, depth, height, widthSegments, depthSegments); // py
        buildPlane('x', 'z', 'y', 1, -1, width, depth, -height, widthSegments, depthSegments); // ny
        buildPlane('x', 'y', 'z', 1, -1, width, height, depth, widthSegments, heightSegments); // pz
        buildPlane('x', 'y', 'z', -1, -1, width, height, -depth, widthSegments, heightSegments); // nz


        let gl =  this.gl;


        this.planeVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.planeVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        this.planeUVBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,  this.planeUVBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);


        this.planeNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.planeNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        this.numIndices=indices.length
    }

    draw(program:Program)
    {
        if(program) {
            let gl = this.gl;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.planeVertexBuffer);
            gl.vertexAttribPointer(program.vertexAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.planeNormalBuffer);
            gl.vertexAttribPointer(program.normalAttribute, 3, gl.FLOAT, false, 0, 0);

          //  gl.bindBuffer(gl.ARRAY_BUFFER, this.planeUVBuffer);
          //  gl.vertexAttribPointer(program.uvAttribute0, 2, gl.FLOAT, false, 0, 0);


            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.indexBuffer);
            gl.drawElements(gl.TRIANGLES,this.numIndices, gl.UNSIGNED_SHORT, 0);

        }

    }

}
