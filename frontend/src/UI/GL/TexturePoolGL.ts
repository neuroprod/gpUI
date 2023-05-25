import UITexture from "../draw/UITexture";

import ColorPickerTextureGL from "./ColorPickerTextureGL";

export default class TexturePoolGL
{

    static getStaticTextures()
    {
        let textures=new Map<string,UITexture>();
        //
        let alphaGrid =new ColorPickerTextureGL(32,32,true,32);
        textures.set("alphaGrid",alphaGrid);


        let pickRect =new ColorPickerTextureGL(256,256,false,10,[0.5,1,0,1],[0.5,0,0,1],[0.5,1,1,1],[0.5,0,1,1]);
        textures.set("pickRect",pickRect);

        let heuBar =new ColorPickerTextureGL(8,256,false,10,[1,1,1,1],[1,1,1,1],[0,1,1,1],[0,1,1,1]);
        textures.set("heuBar",heuBar);

        let alphaBar =new ColorPickerTextureGL(32,256,false,20,[0.5,1,1,0],[0.5,1,1,0],[0.5,1,1,1],[0.5,1,1,1]);
        textures.set("alphaBar",alphaBar);

        return textures
    }
}
