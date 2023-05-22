

import GL from "./GL";

export default class FBO
{
    private glMain: GL;
    private gl: WebGL2RenderingContext|WebGLRenderingContext;
    private useStencil: boolean;
    private width: number;
    private height: number;
    private mipmap: boolean;
    private filtering: GLenum;
    private fbo: WebGLFramebuffer;
    public texture: WebGLTexture;
    private renderbuffer: WebGLRenderbuffer;
    private _resizeTimeOut: NodeJS.Timeout;


    constructor(glMain:GL,width=1,height=1,useStencil =false,linear=true)
    {
        this.glMain =glMain;
        this.gl =glMain.gl;
        this.useStencil = useStencil;


        this.width = width;

        this.height = height;
        this.mipmap =false;

        this.filtering = this.gl.LINEAR;
        if(!linear)this.filtering = this.gl.NEAREST;

        this.makeBuffers();

    }
    makeBuffers()
    {
        let gl = this.gl;
        this.fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);


        this.texture = this.gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D,this.texture );



        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0,gl.RGBA, gl.UNSIGNED_BYTE, null);


        if(!this.mipmap)
        {
          //  gl.texParameterf(gl.TEXTURE_2D,this.glMain.ext.TEXTURE_MAX_ANISOTROPY_EXT, 16);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.filtering);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.filtering);

        }else
        {
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        }



        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);


        this.renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);

        if(this.useStencil) {

            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
        }else
            {
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
            }
         gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

        if(this.useStencil)
        {
            gl.STENCIL_ATTACHMENT
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);

        }else
            {
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);
            }



      //  console.log( gl.checkFramebufferStatus(gl.FRAMEBUFFER),gl.FRAMEBUFFER_COMPLETE,gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  // console.log( gl.checkFramebufferStatus(gl.FRAMEBUFFER),gl.FRAMEBUFFER_COMPLETE);

    }
    setFiltering(type)
    {
        let gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D,this.texture );

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, type);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,type);

        gl.bindTexture(gl.TEXTURE_2D, null);

    }
    resize(width,height)
    {
        if(width<1 )width =1;
        if(height<1 )height =1;
        if(this.width == width && this.height ==height )return;

        this.width = width;
        this.height = height;

        this.destroy();
        this.makeBuffers();
    }
    delayedResize(width,height)
    {
        if(this.width == width && this.height ==height )return;
        this.width = width ;
        this.height =height;
        clearTimeout(this._resizeTimeOut);
        this._resizeTimeOut = setTimeout (()=>{this.destroy();this.makeBuffers()}, 100);

    }

    bindtexture(id)
    {
        //id = gl.TEXTURE0 etc
        var gl =this.gl;

        gl.activeTexture(id);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

    }

    bind()
    {
        let gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
        gl.viewport(0, 0, this.width, this.height);

    }
    unbind()
    {
        let gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    }
    destroy()
    {
        let gl = this.gl;
        gl.deleteRenderbuffer(this.renderbuffer)
        gl.deleteTexture(this.texture)
        gl.deleteFramebuffer(this.fbo);

    }

}
