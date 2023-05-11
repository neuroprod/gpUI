import UI_I from "../UI_I";
import UITexture from "./UITexture";
import TexturePoolGL from "../GL/TexturePoolGL";

export default class TexturePool
{
    private static textures=new Map<string,UITexture>();
    public static init()
    {
        if(UI_I.renderType=="gl")
        {
            this.textures =TexturePoolGL.getStaticTextures();

        }
    }
    //don't destroy

    public static getStatic(key:string):UITexture
    {
        return TexturePool.textures.get(key)
    }
    //destroy
    public  static getDynamic(type:string)
    {

    }


}
