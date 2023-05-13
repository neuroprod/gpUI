export default class Local
{
    static dockData:any =null;
    static itemData ={};
    private static isDirty: boolean;

    static  init(){
        let data =localStorage.getItem("uiData");
        if(data)
        {
            this.itemData = JSON.parse(data);
        }else
        {

        }

        let dataDock =localStorage.getItem("uiDock");
        if(dataDock)
        {
            this.dockData = JSON.parse(dataDock);
        }else
        {

        }
    }
    static setItem(id:number, data:any)
    {
        Local.itemData[id] =data;
        this.isDirty =true;


    }
    static getItem(id:number):any
    {
       return Local.itemData[id];
    }

    static setDockData(data:any) {
        this.dockData =data;

        this.isDirty =true;


    }
    static saveDockData(){
        if(!this.isDirty)return;

        let s =JSON.stringify(this.itemData);
        localStorage.setItem("uiData", s);

        let sd =JSON.stringify(this.dockData);
        localStorage.setItem("uiDock", sd);

        this.isDirty =false;
    }

    static clearLocalData() {
        localStorage.removeItem("uiData")
        localStorage.removeItem("uiDock")
    }
}
