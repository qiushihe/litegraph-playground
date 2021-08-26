import flow from "lodash/fp/flow";
import reverse from "lodash/fp/reverse";
import slice from "lodash/fp/slice";
import toString from "lodash/fp/toString";
import map from "lodash/fp/map";

const nodeType = {
  title: "Console",
  defaultClass: null
};

const CONFIG = {
  offset: [10, 60, 10, 100],
  history: 100
};

const defineNodeType = ({ LGraphNode, LiteGraph }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("action", LiteGraph.ACTION);
        this.addInput("clear", LiteGraph.ACTION);
        this.addInput("message", "");
        this.addOutput("event", LiteGraph.EVENT);

        this.size = [640, 220];
        this.tasks = [];
        this.messageLines = [];
      }

      onDrawForeground(ctx) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;

        const boxWidth = this.size[0] - CONFIG.offset[3] - CONFIG.offset[1];
        const boxHeight = this.size[1] - CONFIG.offset[0] - CONFIG.offset[2];

        ctx.strokeRect(CONFIG.offset[3], CONFIG.offset[0], boxWidth, boxHeight);

        ctx.font = "12px monospace";

        const {
          width: letterWidth,
          fontBoundingBoxAscent,
          fontBoundingBoxDescent
        } = ctx.measureText(" ");

        const letterHeight = fontBoundingBoxAscent + fontBoundingBoxDescent;
        const maxLineChars = Math.floor(boxWidth / letterWidth);
        const maxLines = Math.floor(boxHeight / letterHeight);

        const textOrigin = [
          CONFIG.offset[3],
          CONFIG.offset[0] + fontBoundingBoxAscent
        ];

        const visibleLines = flow([reverse, slice(0, maxLines), reverse])(
          this.messageLines
        );

        for (let lineIndex = 0; lineIndex < visibleLines.length; lineIndex++) {
          const line = visibleLines[lineIndex];

          ctx.fillText(
            line.slice(0, maxLineChars),
            textOrigin[0],
            textOrigin[1] + letterHeight * lineIndex
          );
        }
      }

      onAction(action) {
        if (action === "action") {
          this.tasks.push({ name: "log-message" });
          this.tasks.push({ name: "send-signal" });
        } else if (action === "clear") {
          this.tasks.push({ name: "clear-messages" });
        }
      }

      onExecute() {
        if (this.tasks.length > 0) {
          const task = this.tasks.shift();

          if (task.name === "log-message") {
            this.messageLines = flow([
              reverse,
              slice(0, CONFIG.history),
              reverse,
              map(toString)
            ])([...this.messageLines, this.getInputData(2) || ""]);
          } else if (task.name === "clear-messages") {
            this.messageLines = [];
          } else if (task.name === "send-signal") {
            this.triggerSlot(0, "");
          }
        }
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
