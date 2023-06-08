export default class Main {
  private image: HTMLImageElement;
  private div: HTMLDivElement;
  constructor(div: HTMLDivElement) {
    this.div = div;
    this.div.innerText = "loading";
    (this.image = new Image()),
      (this.image.onload = () => {
        console.log(this.image);
        this.getBytes();
      });

    this.image.src = "charmap.png";
  }

  private getBytes() {
    const canvas = document.createElement("canvas");
    canvas.width = this.image.width;
    canvas.height = this.image.height;
    const ctx = <CanvasRenderingContext2D>(
      canvas.getContext("2d", { colorSpace: "srgb" })
    );
    ctx.drawImage(this.image, 0, 0);
    let id = ctx.getImageData(0, 0, this.image.width, this.image.height);

    let arr = [];
    for (let i = 0; i < id.data.length; i += 4) {
      arr.push(id.data[i]);
    }

    let newArray = new Array();

    let oldNumber = -1;
    let numberCount = 0;
    for (let i = 0; i < arr.length; i++) {
      let n = arr[i];
      if (n == oldNumber) {
        numberCount++;
      } else {
        if (oldNumber != -1) newArray.push(numberCount, oldNumber);
        oldNumber = n;
        numberCount = 1;
      }
    }

    this.div.innerText =
      this.image.width + "_" + this.image.height + "\n" + newArray;
  }
}
