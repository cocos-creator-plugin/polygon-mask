import Shape from "./Shape";

export default class Line extends Shape<SVGLine> {

    _start: [number, number];
    _end: [number, number];

    constructor(parent) {
        super(parent);

        this._start = [0, 0];
        this._end = [100, 100];
        this.shape = this.root.line(0, 0, 100, 100);
    }

    // 跟多边形一样，线段的中心点就是第一个点的位置，而不去矫正
    _resize() {
        //if (!this.isRoot)
        //    this.shape.center(this.parent.shape.cx(), this.parent.shape.cy());
        //else
        //    this.shape.center(0, 0);

        this.children.forEach(function (child) {
            child.shape.center(child.parent.shape.cx(), child.parent.shape.cy());
        }, this);
    }

    line(start, end) {
        this._start = start;
        this._end = end;
        this.shape.plot(start.x, start.y, end.x, end.y);
        this._resize();
        return this;
    }

}
