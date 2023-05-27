import Mesh from "./Mesh";
import Material from "./Material";
import Transform from "./Transform";

export class Model{
    public mesh: Mesh;
    public material: Material;
    public transform: Transform;
    private name: string;
    constructor(device:GPUDevice,name:string,mesh:Mesh,material:Material) {
        this.name =name;
        this.transform =new Transform(device,this.name+"transform")

        this.mesh=mesh;
        this.material =material
        this.material.addUniformData(this.transform)
    }
}
