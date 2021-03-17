import Shape from "./Shape";

export default class Rect extends Shape<SVGJSRect> {
    _size: [number, number];

    constructor(parent) {
        super(parent);

        this._size = [100, 100];
        this.shape = this.root.rect(this._size[0], this._size[1]);
    }

    size(w, h) {
        this._size = [w, h];
        this.shape.width(w);
        this.shape.height(h);
        this._resize();
        return this;
    }
}
