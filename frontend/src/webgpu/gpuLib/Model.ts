import Mesh from "./Mesh";
import Material from "./Material";
import Transform from "./Transform";
import Camera from "./Camera";

export class Model{
    public mesh: Mesh;
    public material: Material;
    public transform: Transform;
    private name: string;
    constructor(device:GPUDevice,name:string,mesh:Mesh,material:Material,camera:Camera) {
        this.name =name;

        this.material =material
        this.transform =new Transform(device,this.name+"transform")
        this.mesh=mesh;
       this.material.addUniformGroup(camera)
        this.material.addUniformGroup(this.transform)

        ///this.material.addUniformGroup(camera)


    }
}
