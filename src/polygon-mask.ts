import Polygon from "./Polygon";
import Line from "./Line";
import Circle from "./Circle";

export default class PolygonMask extends Editor.Gizmo {
    fillArea: Polygon;
    lines: Line[];
    points: Circle[];
    _targetEditing: boolean;

    onCreateRoot() {
        cc.log("onCreateRoot");
        this.fillArea = new Polygon(this._root.group(), true)
            .color(null, 'rgba(0,128,255,0.2)')
            .cursorStytle('move', 'fill')
        ;

        Editor.GizmosUtils.addMoveHandles(this.fillArea.shape, this.setOffset());


        this.lines = [];
        for (let i = 0; i < this.target.vertexes.length; ++i) {
            this.lines[i] = new Line(this._root.group())
                .color('rgba(0,128,255,1)')
                .lineStytle(2)
                .cursorStytle('pointer')
            ;
            Editor.GizmosUtils.addMoveHandles(this.lines[i].shape, this.addVertexe());
        }

        this.points = [];
        for (let i = 0; i < this.target.vertexes.length; ++i) {
            this.points[i] = new Circle(this._root.group())
                .color(null, 'rgba(0,128,255,1)')
                .cursorStytle('pointer')
                .radius(3)
            ;
            Editor.GizmosUtils.addMoveHandles(this.points[i].shape, this.moveOrDeleteVertexe());
        }


        this._targetEditing = !this.target.editing;
    }

    moveOrDeleteVertexe() {
        let index;
        return {
            start: function (x, y, event) {

                this.pressx = x;
                this.pressy = y;
                this.updated = false;

                let el = event.currentTarget.instance;
                index = -1;
                for (let i = 0; i < this.points.length; ++i) {
                    if (this.points[i].shape === el) {
                        index = i;
                        break;
                    }
                }

                let deleteKeyDown = event.ctrlKey || event.metaKey;
                if (deleteKeyDown) {
                    _Scene.Undo.recordNode(this.node.uuid);

                    let vertexes = this.target.vertexes;
                    vertexes.splice(index, 1);
                    this.target.vertexes = vertexes;
                    this.points[0].visible(false)
                    this.points.splice(0, 1);
                    this.lines[0].visible(false);
                    this.lines.splice(0, 1);

                    this._view.repaintHost();
                    return;
                }
            }.bind(this),

            update: function (dx, dy, event) {
                if (dx === 0 && dy === 0) {
                    return;
                }
                this.updated = true;

                let deleteKeyDown = event.ctrlKey || event.metaKey;
                if (deleteKeyDown) {
                    return;
                }

                let node = this.node;
                _Scene.Undo.recordNode(node.uuid);

                let x = this.pressx + dx, y = this.pressy + dy;
                let pos = this._view.pixelToWorld(cc.v2(x, y));
                pos = node.convertToNodeSpaceAR(pos).sub(this.target.offset);

                let minDifference = Editor.Math.numOfDecimalsF(1.0 / this._view.scale);
                pos.x = Editor.Math.toPrecision(pos.x, minDifference);
                pos.y = Editor.Math.toPrecision(pos.y, minDifference);

                this.target.vertexes[index] = pos;
                this.target.vertexes = this.target.vertexes;
                this._view.repaintHost();
            }.bind(this),

            end: function (event) {
                if (this.updated) {
                    _Scene.Undo.commit();
                }
            }.bind(this)
        };
    }

    setOffset() {
        let startPos, startX, startY, startOffset;
        return {
            start: function (x, y, event) {
                let pos = this._view.pixelToWorld(cc.v2(x, y));
                pos = this.node.convertToNodeSpaceAR(pos);
                let minDifference = Editor.Math.numOfDecimalsF(1.0 / this._view.scale);
                pos.x = Editor.Math.toPrecision(pos.x, minDifference);
                pos.y = Editor.Math.toPrecision(pos.y, minDifference);
                startPos = pos;
                startX = x;
                startY = y;
                startOffset = this.target.offset;
            }.bind(this),

            update: function (dx, dy, event) {
                _Scene.Undo.recordNode(this.node.uuid);

                let x = startX + dx;
                let y = startY + dy;
                let pos = this._view.pixelToWorld(cc.v2(x, y));
                pos = this.node.convertToNodeSpaceAR(pos);
                let minDifference = Editor.Math.numOfDecimalsF(1.0 / this._view.scale);
                pos.x = Editor.Math.toPrecision(pos.x, minDifference);
                pos.y = Editor.Math.toPrecision(pos.y, minDifference);
                this.target.offset = startOffset.add(pos.sub(startPos));
            }.bind(this),

            end: function (event) {
            }.bind(this)
        };
    }

    addVertexe() {
        return {
            start: function (x, y, event) {
                _Scene.Undo.recordNode(this.node.uuid);

                // let canvasSize = cc.view.getCanvasSize();
                // y = canvasSize.height - y;
                // let pos = this.node.convertToNodeSpaceAR(cc.v2(x, y)).sub(this.target.offset);
                let pos = this._view.pixelToWorld(cc.v2(x, y));
                pos = this.node.convertToNodeSpaceAR(pos).sub(this.target.offset);
                let minDifference = Editor.Math.numOfDecimalsF(1.0 / this._view.scale);
                pos.x = Editor.Math.toPrecision(pos.x, minDifference);
                pos.y = Editor.Math.toPrecision(pos.y, minDifference);

                let el = event.currentTarget.instance;
                let vertexes = this.target.vertexes;
                let nextIndex = -1;
                for (let i = 0; i < this.lines.length; ++i) {
                    if (this.lines[i].shape === el) {
                        nextIndex = i + 1;
                        break;
                    }
                }

                let newLine = new Line(this._root.group())
                    .color('rgba(0,128,255,1)')
                    .lineStytle(2)
                    .cursorStytle('pointer')
                ;
                Editor.GizmosUtils.addMoveHandles(newLine.shape, this.addVertexe());
                this.lines.push(newLine);

                let newPoint = new Circle(this._root.group())
                    .color(null, 'rgba(0,128,255,1)')
                    .cursorStytle('pointer')
                    .radius(3)
                ;
                Editor.GizmosUtils.addMoveHandles(newPoint.shape, this.moveOrDeleteVertexe());
                this.points.push(newPoint);

                vertexes.splice(nextIndex, 0, pos);
                this.target.vertexes = vertexes;

                this._view.repaintHost();
            }.bind(this),

            update: function (dx, dy, event) {
            }.bind(this),

            end: function (event) {
            }.bind(this)
        };
    }

    onUpdate() {
        if (this.target.editing) {
            this.enterEditing();
        } else {
            this.leaveEditing();
        }

        if (this.target.vertexes.length <= 0)
            return;

        let node = this.node;
        let pos = Editor.GizmosUtils.snapPixelWihVec2(this._view.worldToPixel(node.convertToWorldSpaceAR(this.target.offset)));

        let vertexes = [];
        for (let i = 0; i < this.target.vertexes.length; ++i) {
            vertexes[i] = Editor.GizmosUtils.snapPixelWihVec2(
                this._view.worldToPixel(node.convertToWorldSpaceAR(this.target.vertexes[i].add(this.target.offset))));
        }

        this.fillArea.vertexes(vertexes);

        for (let i = 0; i < vertexes.length; i++) {
            let line = this.lines[i];
            if (!line) {
                line = new Line(this._root.group())
                    .color('rgba(0,128,255,1)')
                    .lineStytle(2)
                    .cursorStytle('pointer')
                ;
                this.lines[i] = line;
                Editor.GizmosUtils.addMoveHandles(line.shape, this.addVertexe());
            }
            line.visible(true);
            line.line(vertexes[i], vertexes[i === vertexes.length - 1 ? 0 : i + 1]);
        }

        if (this.lines.length > vertexes.length) {
            for (let i = vertexes.length; i < this.lines.length; i++) {
                this.lines[i].visible(false);
            }
        }

        for (let i = 0; i < vertexes.length; i++) {
            let point = this.points[i];
            if (!point) {
                point = new Circle(this._root.group())
                    .color(null, 'rgba(0,128,255,1)')
                    .cursorStytle('pointer')
                    .radius(3)
                ;
                this.points[i] = point
                Editor.GizmosUtils.addMoveHandles(point.shape, this.moveOrDeleteVertexe());
            }
            point.visible(true);
            point.position(vertexes[i].x, vertexes[i].y);
        }

        if (this.points.length > vertexes.length) {
            for (let i = vertexes.length; i < this.points.length; i++) {
                this.points[i].visible(false);
            }
        }
    }

    enterEditing() {
        if (this._targetEditing) {
            return;
        }

        this.fillArea.visible(true);
        for (let i = 0; i < this.points.length; ++i) {
            this.points[i].visible(true);
        }

        this._targetEditing = true;
    }

    leaveEditing() {
        if (!this._targetEditing) {
            return;
        }

        this.fillArea.visible(false);
        for (let i = 0; i < this.points.length; ++i) {
            this.points[i].visible(false);
        }

        this._targetEditing = false;
    }

    visible() {
        return true;
    }
}

module.exports = PolygonMask;
