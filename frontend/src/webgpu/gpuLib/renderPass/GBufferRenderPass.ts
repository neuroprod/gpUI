import AbstractRenderPass from "./AbstractRenderPass";

export default class GBufferRenderPass extends AbstractRenderPass
{
    width: number = 1;
    height: number = 1;
    public gBufferTexturePosition: GPUTexture;
    public gBufferTextureNormal: GPUTexture;
    public gBufferTextureAlbedo: GPUTexture;
    private depthTexture: GPUTexture;

    constructor( device:GPUDevice) {
        super (device,"GBufferRenderPass")

    }
    public update(width: number, height: number) {

        if(this.width ==width && this.height==height)return;

        this.width =width
        this.height =height;
        if(this.gBufferTexturePosition)  this.gBufferTexturePosition.destroy();
            this.gBufferTexturePosition = this.device.createTexture({
            size: [ this.width,   this.height],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            format: 'rgba16float',
        });
        if(     this.gBufferTextureNormal)     this.gBufferTextureNormal.destroy();
        this.gBufferTextureNormal = this.device.createTexture({
            size: [this.width,   this.height],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            format: 'rgba16float',
        });
        if(this.gBufferTextureAlbedo)this.gBufferTextureAlbedo.destroy();
        this.gBufferTextureAlbedo = this.device.createTexture({
            size: [this.width,   this.height],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            format: 'rgba8unorm',
        });

        if(this.depthTexture)this.depthTexture.destroy();
        this.depthTexture = this.device.createTexture({
            size: [width, height],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });

        this.renderPassDescriptor = {
            label:this.label,
            colorAttachments: [
                {
                    view:  this.gBufferTexturePosition.createView(),
                    clearValue: {
                        r: Number.MAX_VALUE,
                        g: Number.MAX_VALUE,
                        b: Number.MAX_VALUE,
                        a: 1.0,
                    },
                    loadOp: 'clear',
                    storeOp: 'store',
                },
                {
                    view:this.gBufferTextureNormal.createView(),
                    clearValue: { r: 0.0, g: 0.0, b: 1.0, a: 1.0 },
                    loadOp: 'clear',
                    storeOp: 'store',
                },
                {
                    view: this.gBufferTextureAlbedo.createView(),
                    clearValue: { r: 1.0, g: 1.0, b: 1.0, a: 1.0 },
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
            depthStencilAttachment: {
                view: this.depthTexture.createView(),

                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            },
        };


    }

}
