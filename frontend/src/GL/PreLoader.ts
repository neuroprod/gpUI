export default class PreLoader
{
    private progress: (n: number) => any;
    private complete: () => any;
    private count: number;
    private totalCount: number;

    constructor(progress:(n:number)=>any,complete:()=>any)
    {
      this.progress =progress;
      this.complete =complete;
      this.count =0;
      this.totalCount =0;

    }
    startLoad()
    {
      this.totalCount++;
      this.count++;
    }
    stopLoad()
    {

      this.count--;
      if(this.count==0)
      {

        this.progress (1);
        this.complete();

      }
      else{

        this.progress (this.count/this.totalCount);
      }
    }

}
