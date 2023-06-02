import PreLoader from "../../shared/PreLoader";

export default class TextureLoader{
    private device: GPUDevice;
    public texture: GPUTexture;


    constructor(device:GPUDevice,preLoader:PreLoader,url:string) {
        this.device =device;
        preLoader.startLoad();
        this.loadURL(url).then(()=>{
            preLoader.stopLoad()
            console.log("done")
        })
    }
    async loadURL(url:string){
        const response = await fetch(
            url
        );
        const imageBitmap = await createImageBitmap(await response.blob());

        this.texture = this.device.createTexture({
            size: [imageBitmap.width, imageBitmap.height, 1],
            format: 'rgba8unorm',
            usage:
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.COPY_DST |
                GPUTextureUsage.RENDER_ATTACHMENT,
        });
        this.device.queue.copyExternalImageToTexture(
            { source: imageBitmap },
            { texture: this.texture },
            [imageBitmap.width, imageBitmap.height]
        );
    }


}
