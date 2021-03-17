import Shape from "./Shape";

export default class Path extends Shape<SVGPath> {
    _path: string;

    constructor(parent) {
        super(parent);

        this._path = 'M100,200L300,400';
        this.shape = this.root.path(this._path);
    }

    path(v) {
        this._path = v;
        this.shape.plot(v);
        this._resize();
        return this;
    }
}
