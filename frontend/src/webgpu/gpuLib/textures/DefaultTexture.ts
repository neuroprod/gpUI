import FontTextureData from "../../../UI/draw/FontTextureData";

export default class DefaultTexture
{
    private static white:GPUTexture;

    static getWhite(device:GPUDevice)
    {
        if(this.white)return this.white

        this.white= device.createTexture({
            label: "defaultWhite",
            size: [1, 1, 1],
            format: 'r8unorm',
            sampleCount:1,
            usage:
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.COPY_DST,
        });
        let f =new Uint8ClampedArray(4)
        f.fill(255);
        device.queue.writeTexture(
            {texture: this.white},
            f,
            {bytesPerRow: 4},
            [1, 1]
        );
        return this.white;
    }


}
