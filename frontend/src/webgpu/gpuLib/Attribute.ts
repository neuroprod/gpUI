export default class Attribute
{
    public name:string;
    public length:number;
    public slot =0
    public format ="float32"

    constructor(name:string,length:number) {
        this.name =name
        this.length =length
        if(length>1){
            this.format+="x"+length
        }
    }

    getShaderText()
    {
        if(length==1)
        {
            return  "@location("+this.slot+") "+this.name+" : f32 ,"
        }else
        {
            return  "@location("+this.slot+") "+this.name+" : vec"+this.length+"<f32> ,";
        }

    }
}
