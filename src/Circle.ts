import Shape from "./Shape";

export default class Circle extends Shape<SVGCircle> {
    _radius: number;

    constructor(parent) {
        super(parent);

        this._radius = 100;
        this.shape = this.root.circle(this._radius);
    }

    radius(radius) {
        this._radius = radius;
        this.shape.radius(radius);
        this._resize();
        return this;
    }
}
