import UniqueObject from "./UniqueObject";

export class BindGroup extends UniqueObject{


    private static allGroups:Array<BindGroup>=[]

    public device: GPUDevice;
    public label:string;
    public slot:number=0

    public bindGroupLayout: GPUBindGroupLayout;
    public bindGroup: GPUBindGroup;
    public typeID =0

    public isDirty:boolean=false;


    constructor(device:GPUDevice,label:string) {
        super();
        this.typeID =this.uID;
        this.device = device;
        this.label =label;
        BindGroup.allGroups.push(this);

    }
    static updateGroups()
    {
        let dirtyCount =0
        for(let group of this.allGroups)
        {
            if(group.isDirty){
                group.update()
                group.isDirty =false;
                dirtyCount++;
            }
        }
        //console.log("updatedBuffers "+dirtyCount+"/"+this.allGroups.length )
    }
    public update(){
        //extend
    }






}
