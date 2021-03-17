import Shape from "./Shape";

export default class Polygon extends Shape<SVGPolygon> {
    _vertexes: string;

    constructor(parent, close) {
        super(parent);

        this._vertexes = '0,0 -50,50 50,50';
        this.shape = close ? this.root.polygon(this._vertexes) : this.root.polyline(this._vertexes).fill('none').stroke({width: 1});
    }

    // 多边形的中心点为了方便起见，就设置为第一个点的位置
    _resize() {
        //if (!this.isRoot)
        //    this.shape.center(this.parent.shape.cx(), this.parent.shape.cy());
        //else
        //    this.shape.center(0, 0);

        this.children.forEach(function (child) {
            child.shape.center(child.parent.shape.cx(), child.parent.shape.cy());
        }, this);
    }

    vertexes(vs) {
        let _v = '';
        vs.forEach(function (v) {
            _v += v.x + ',' + v.y + ' ';
        }, this);
        this._vertexes = _v;
        this.shape.plot(_v);
        this._resize();
        return this;
    }
}
