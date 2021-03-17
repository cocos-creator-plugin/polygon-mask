export default class Shape<S extends SVGShape> {

    parent: SVGShape;
    children: Shape<SVGShape>[];
    isRoot: boolean;
    _position: [number, number]
    _rotate: number;
    _scale: number;
    _visible: boolean;
    root: SVGShape;
    _angle: number;
    shape: S;

    constructor(parent: any) {
        this.parent = parent;
        this.children = [];
        this.isRoot = false;
        this._position = [0, 0];
        this._rotate = 0;
        this._scale = 1;
        this._visible = true;

        if (parent.root !== undefined) {
            this.root = parent.root.group();
            parent.children.push(this);
        } else {
            this.isRoot = true;
            this.root = parent.group();
        }
    }

    position(x, y) {
        this._position = [x, y];
        this.root.move(x, y);
        return this;
    }

    rotate(angle) {
        this._angle = angle;
        this.root.rotate(angle);
        return this;
    }

    scale(s) {
        this._scale = s;
        this.root.scale(s);
        return this;
    }

    color(lineColor?, fillColor?) {
        if (lineColor === null) {
            this.shape.stroke("none");
        } else {
            this.shape.stroke({color: lineColor});
        }
        if (fillColor === null) {
            this.shape.fill("none");
        } else {
            this.shape.fill({color: fillColor});
        }
        return this;
    }

    lineStytle(lineWidth) {
        this.shape.attr({
            'stroke-width': lineWidth,
        });
        return this;
    }

    cursorStytle(cursorType?, pointerArea?) {
        this.shape.attr({
            'cursor': cursorType,
            'pointer-events': pointerArea,
        });
        return this;
    }

    visible(v) {
        this._visible = v;
        if (v)
            this.shape.show();
        else
            this.shape.hide();
        return this;
    }

    _resize() {
        if (!this.isRoot)
            this.shape.center(this.parent.shape.cx(), this.parent.shape.cy());
        else
            this.shape.center(0, 0);

        this.children.forEach(function (child) {
            child.shape.center(child.parent.shape.cx(), child.parent.shape.cy());
        }, this);
    }

    onClick(callback) {
        this.shape.on('click', callback.bind(this));
        return this;
    }

    onMousedown(callback) {
        this.shape.on('mousedown', callback.bind(this));
        return this;
    }

    onMouseup(callback) {
        this.shape.on('mouseup', callback.bind(this));
        return this;
    }

    onMousemove(callback) {
        this.shape.on('mousemove', callback.bind(this));
        return this;
    }

    onMouseover(callback) {
        this.shape.on('mouseover', callback.bind(this));
        return this;
    }

    onMouseout(callback) {
        this.shape.on('mouseout', callback.bind(this));
        return this;
    }
}
