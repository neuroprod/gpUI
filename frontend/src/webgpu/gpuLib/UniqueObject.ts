export default class UniqueObject
{
    static uIDCounter =0;
    public uID:number;

    constructor() {

        this.uID =UniqueObject.uIDCounter
        UniqueObject.uIDCounter++;
    }
}
