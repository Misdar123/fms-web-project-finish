import Konva from "konva";

export const PencilDraw = ({ stage, layer, mode, color, stright }) => {
  if (stage === null) return;
  let isPaint = false;
  let lastLine;
  let strightLine;
  let stopDraw = false;

  stage.on("mousedown touchstart", function (e) {
    if (!stopDraw) {
      isPaint = true;
      let pos = stage.getPointerPosition();

      if (stright) {
        strightLine = new Konva.Line({
          stroke: mode === "brush" ? color : "white",
          strokeWidth: mode == "brush" ? 2 : 20,
          globalCompositeOperation:
            mode === "brush" ? "source-over" : "destination-out",
          points: [pos.x, pos.y],
          draggable: mode === "brush",
        });

        layer.add(strightLine);
      } else {
        lastLine = new Konva.Line({
          stroke: mode === "brush" ? color : "white",
          strokeWidth: mode == "brush" ? 2 : 20,
          globalCompositeOperation:
            mode === "brush" ? "source-over" : "destination-out",
          points: [pos.x, pos.y],
          draggable: mode === "brush",
        });

        layer.add(lastLine);
      }
    }
  });

  stage.on("mouseup touchend", function () {
    isPaint = false;
  });

  stage.on("mousemove touchmove", function () {
    if (!isPaint) {
      return;
    }
    const pos = stage.getPointerPosition();

    if (stright) {
      const points = [strightLine.points()[0], strightLine.points()[1], pos.x, pos.y];
      strightLine.points(points);
      layer.batchDraw();
    } else {
      let newPoints = lastLine.points().concat([pos.x, pos.y]);
      lastLine.points(newPoints);
      layer.batchDraw();
    }
  });

  stage.on("dblclick", () => {
    stopDraw = true;
  });
};
