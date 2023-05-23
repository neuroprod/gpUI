import GL from "./GL";

export default class Texture {
    private glMain: GL;
    private gl: WebGL2RenderingContext;
    private type: GLenum;
    private linear: boolean;
    private mipmap: boolean;
    private loaded: boolean;
    private image: HTMLImageElement;
    width: number;
    height: number;
    public texture!: WebGLTexture;


    constructor(glMain:GL,useMipMap =true,transparent =false,linear =true) {
        this.glMain = glMain;
        this.gl = glMain.gl;

        this.type = this.gl.RGB;
        if(transparent){
            this.type = this.gl.RGBA;
        }

        this.linear = linear;
        this.mipmap =useMipMap;
        this.loaded = false;
    }





    load(path) {
        this.glMain.preLoader.startLoad();
        this.image = new Image();
        this.image.onload = () => {
            this.setTextureData();
            this.width = this.image.width;
            this.height = this.image.height;

            this.loaded = true;
            this.glMain.preLoader.stopLoad();
        }

        this.image.src = this.glMain.assetPath + "" + path;

    }

    bind(id) {

        const gl = this.gl;
        gl.activeTexture(id);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

    }
    updateData()
    {
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, this.type, this.type, gl.UNSIGNED_BYTE, this.image);
        gl.bindTexture(gl.TEXTURE_2D, null);

    }
    setTextureData(flip =false) {
        const gl = this.gl;

        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);


        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, this.type, this.type, gl.UNSIGNED_BYTE, this.image);
        if(!this.mipmap)
        {
            if( this.linear){

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }else
            {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            }

        }else
            {
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

            }
        if( this.linear) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }

        gl.bindTexture(gl.TEXTURE_2D, null);

    }

    destroy() {
        if (this.texture) {
            this.gl.deleteTexture(this.texture);
            this.image = null;
        }
    }

}
