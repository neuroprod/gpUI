export default class FontTexture
{
    private image: HTMLImageElement;
    public texture: WebGLTexture;
    private gl: WebGL2RenderingContext|WebGLRenderingContext;
    constructor(gl:WebGL2RenderingContext|WebGLRenderingContext) {
        this.gl =gl;
        this.image = new Image();
        this.texture = gl.createTexture();
        this.image.onload = () => {

            const gl = this.gl;
            gl.bindTexture(gl.TEXTURE_2D, this.texture);

            gl.texImage2D(gl.TEXTURE_2D, 0,this.gl.RGB, this.gl.RGB, gl.UNSIGNED_BYTE, this.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            gl.bindTexture(gl.TEXTURE_2D, null);


        }

        this.image.src ="/charmap.png";

    }


}
