const nodeType = {
  title: "Image",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("url", "");

        this.size = [250, 250];
        this.resizable = true;

        this.image = null;
      }

      onDrawBackground(ctx) {
        if (this.flags.collapsed) {
          return;
        }

        if (!this.image) {
          return;
        }

        const imageAspectRatio = this.image.width / this.image.height;

        const renderImageSize =
          this.image.width < this.image.height
            ? [this.size[1] / imageAspectRatio, this.size[1]]
            : [this.size[0], this.size[0] / imageAspectRatio];

        if (renderImageSize[0] > this.size[0]) {
          renderImageSize[1] =
            renderImageSize[1] / (renderImageSize[0] / this.size[0]);
          renderImageSize[0] = this.size[0];
        }

        if (renderImageSize[1] > this.size[1]) {
          renderImageSize[0] =
            renderImageSize[0] / (renderImageSize[1] / this.size[1]);
          renderImageSize[1] = this.size[1];
        }

        ctx.drawImage(
          this.image,
          (this.size[0] - renderImageSize[0]) / 2,
          (this.size[1] - renderImageSize[1]) / 2,
          renderImageSize[0],
          renderImageSize[1]
        );
      }

      onExecute() {
        const imageUrl = this.getInputData(0) || "";

        if (this.image) {
          if (this.image.src !== imageUrl) {
            this.image = null;
          }
        } else {
          const image = new Image();

          image.onload = () => {
            this.image = image;
            this.setDirtyCanvas(true);
          };

          image.onerror = () => {
            this.image = null;
          };

          image.src = imageUrl;
        }
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
