declare class SVGCircle extends SVGShape {
    radius(radius: number);
}

declare class SVGLine extends SVGShape {
    plot(sx: number, sy: number, ex: number, ey: number);
}

declare class SVGPath extends SVGShape {
    plot(x: string);
}

declare class SVGPolygon extends SVGShape {
    plot(x: string);
}

declare class SVGJSRect extends SVGShape {
    width(w: number);

    height(h: number);
}

declare class SVGShape {
    center(x: number, y: number);

    stroke(args: any);

    fill(args: any);

    attr(args: any);

    show();

    hide();

    on(event: string, callback: Function);

    move(x, y);

    rotate(angle);

    scale(s);

    shape: SVGShape;

    cx();

    cy();

    rect(w: number, h: number): SVGJSRect;

    line(sx, sy, ex, ey): SVGLine;

    circle(radius): SVGCircle;

    path(path): SVGPath;

    polygon(path): SVGPolygon;

    polyline(path): SVGPolygon;
}
