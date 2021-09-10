import { preserve2DContext } from "../../util/canvas";

import BaseNode, { dataSocket } from "../base-node";

const TITLE = "Image";

class ImageNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("url")]
      },
      metadata: [["image", null]]
    });

    this.size = [250, 250];
    this.resizable = true;
  }

  onDrawBackground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) {
      return;
    }

    const [restore2DContext] = preserve2DContext(ctx);

    const image = this.getMeta<HTMLImageElement>("image");
    if (!image) {
      return;
    }

    const imageAspectRatio = image.width / image.height;

    const renderImageSize =
      image.width < image.height
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
      image,
      (this.size[0] - renderImageSize[0]) / 2,
      (this.size[1] - renderImageSize[1]) / 2,
      renderImageSize[0],
      renderImageSize[1]
    );

    restore2DContext();
  }

  onExecute() {
    const imageUrl = this.getInputData<string>(0) || "";
    let image = this.getMeta<HTMLImageElement>("image");

    if (image) {
      if (image.src !== imageUrl) {
        this.setMeta("image", null);
      }
    } else {
      image = new Image();

      image.onload = () => {
        this.setMeta("image", image);
        this.setDirtyCanvas(true);
      };

      image.onerror = () => {
        this.setMeta("image", null);
      };

      image.src = imageUrl;
    }
  }
}

export default ImageNode;
