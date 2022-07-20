import Konva from "konva";

export const addTextNode = (stage, layer) => {
  stage.add(layer);
  
  let textNode = new Konva.Text({
    text: "type text here",
    x: 50,
    y: 50,
    fontSize: 20,
  });

  layer.add(textNode);

  textNode.draggable = true
  textNode.on("dblclick dbltap", () => {
    // create textarea over canvas with absolute position

    // first we need to find position for textarea
    // how to find it?

    // at first lets find position of text node relative to the stage:
    let textPosition = textNode.getAbsolutePosition();

    // then lets find position of stage container on the page:
    let stageBox = stage.container().getBoundingClientRect();

    // so position of textarea will be the sum of positions above:
    let areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    };

    // create textarea and style it
    let textarea = document.createElement("textarea");
    document.body.appendChild(textarea);

    textarea.value = textNode.text();
    textarea.style.position = "absolute";
    textarea.style.top = areaPosition.y + "px";
    textarea.style.left = areaPosition.x + "px";
    textarea.style.width = textNode.width();

    textarea.focus();

    textarea.addEventListener("keydown", function (e) {
      // hide on enter
      if (e.keyCode === 13) {
        textNode.text(textarea.value);
        document.body.removeChild(textarea);
      }
    });
  });
};
