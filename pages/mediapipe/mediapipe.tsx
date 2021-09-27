import React, { useEffect } from "react";
import type { NextPage } from "next";

import PageHead from "../../components/page-head";

import { GlobalStyle } from "./mediapipe.style";

// Import to fix incorrectly setup THREE.js under `globalThis`.
// @ts-ignore
// import("imports-loader?wrapper=globalThis!@mediapipe/control_utils_3d").then(console.log);

const MediapipePage: NextPage = () => {
  useEffect(() => {
    const controls = window;
    // @ts-ignore
    const LandmarkGrid = window.LandmarkGrid;
    const drawingUtils = window;
    const mpPose = window;

    const options = {
      locateFile: (file: string) => {
        // @ts-ignore
        // return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}/${file}`;

        return `/mediapipe/pose/${file}`;
      }
    };

    // Our input frames will come from here.
    const videoElement = document.getElementsByClassName(
      "input_video"
    )[0] as HTMLVideoElement;
    const canvasElement = document.getElementsByClassName(
      "output_canvas"
    )[0] as HTMLCanvasElement;
    const controlsElement = document.getElementsByClassName(
      "control-panel"
    )[0] as HTMLDivElement;
    const canvasCtx = canvasElement.getContext("2d")!;

    // We'll add this to our control panel later, but we'll save it here so we can
    // call tick() each time the graph runs.
    // @ts-ignore
    const fpsControl = new controls.FPS();

    // Optimization: Turn off animated spinner after its hiding animation is done.
    const spinner = document.querySelector(".loading")! as HTMLDivElement;
    // setTimeout(() => {
    //   spinner.style.display = "none";
    // }, 1000);
    spinner.ontransitionend = () => {
      spinner.style.display = "none";
    };

    const landmarkContainer = document.getElementsByClassName(
      "landmark-grid-container"
    )[0] as HTMLDivElement;
    const grid = new LandmarkGrid(landmarkContainer, {
      connectionColor: 0xcccccc,
      definedColors: [
        { name: "LEFT", value: 0xffa500 },
        { name: "RIGHT", value: 0x00ffff }
      ],
      range: 2,
      fitToGrid: true,
      labelSuffix: "m",
      landmarkSize: 2,
      numCellsPerAxis: 4,
      showHidden: false,
      centered: true
    });

    let activeEffect = "mask";

    // @ts-ignore
    const pose = new mpPose.Pose(options);

    // @ts-ignore
    pose.onResults((results: mpPose.Results) => {
      // Hide the spinner.
      document.body.classList.add("loaded");

      // Update the frame rate.
      // @ts-ignore
      fpsControl.tick();

      // Draw the overlays.
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

      if (results.segmentationMask) {
        canvasCtx.drawImage(
          results.segmentationMask,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );

        // Only overwrite existing pixels.
        if (activeEffect === "mask" || activeEffect === "both") {
          canvasCtx.globalCompositeOperation = "source-in";
          // This can be a color or a texture or whatever...
          canvasCtx.fillStyle = "#00FF007F";
          canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
        } else {
          canvasCtx.globalCompositeOperation = "source-out";
          canvasCtx.fillStyle = "#0000FF7F";
          canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
        }

        // Only overwrite missing pixels.
        canvasCtx.globalCompositeOperation = "destination-atop";
        canvasCtx.drawImage(
          results.image,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );

        canvasCtx.globalCompositeOperation = "source-over";
      } else {
        canvasCtx.drawImage(
          results.image,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
      }

      if (results.poseLandmarks) {
        // @ts-ignore
        drawingUtils.drawConnectors(
          canvasCtx,
          results.poseLandmarks,
          // @ts-ignore
          mpPose.POSE_CONNECTIONS,
          { visibilityMin: 0.65, color: "white" }
        );

        // @ts-ignore
        drawingUtils.drawLandmarks(
          canvasCtx,
          // @ts-ignore
          Object.values(mpPose.POSE_LANDMARKS_LEFT).map(
            (index) => results.poseLandmarks[index]
          ),
          { visibilityMin: 0.65, color: "white", fillColor: "rgb(255,138,0)" }
        );

        // @ts-ignore
        drawingUtils.drawLandmarks(
          canvasCtx,
          // @ts-ignore
          Object.values(mpPose.POSE_LANDMARKS_RIGHT).map(
            (index) => results.poseLandmarks[index]
          ),
          { visibilityMin: 0.65, color: "white", fillColor: "rgb(0,217,231)" }
        );

        // @ts-ignore
        drawingUtils.drawLandmarks(
          canvasCtx,
          // @ts-ignore
          Object.values(mpPose.POSE_LANDMARKS_NEUTRAL).map(
            (index) => results.poseLandmarks[index]
          ),
          { visibilityMin: 0.65, color: "white", fillColor: "white" }
        );
      }
      canvasCtx.restore();

      if (results.poseWorldLandmarks) {
        grid.updateLandmarks(
          results.poseWorldLandmarks,
          // @ts-ignore
          mpPose.POSE_CONNECTIONS,
          [
            // @ts-ignore
            { list: Object.values(mpPose.POSE_LANDMARKS_LEFT), color: "LEFT" },
            // @ts-ignore
            { list: Object.values(mpPose.POSE_LANDMARKS_RIGHT), color: "RIGHT" }
          ]
        );
      } else {
        grid.updateLandmarks([]);
      }
    });

    // Present a control panel through which the user can manipulate the solution
    // options.
    // @ts-ignore
    new controls.ControlPanel(controlsElement, {
      selfieMode: true,
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      effect: "background"
    })
      .add([
        // @ts-ignore
        new controls.StaticText({ title: "MediaPipe Pose" }),
        fpsControl,
        // @ts-ignore
        new controls.Toggle({ title: "Selfie Mode", field: "selfieMode" }),
        // @ts-ignore
        new controls.SourcePicker({
          onSourceChanged: () => {
            // Resets because this model gives better results when reset between
            // source changes.
            pose.reset();
          },
          onFrame: async (
            // @ts-ignore
            input: controls.InputImage,
            // @ts-ignore
            size: controls.Rectangle
          ) => {
            const aspect = size.height / size.width;
            let width: number, height: number;
            if (window.innerWidth > window.innerHeight) {
              height = window.innerHeight;
              width = height / aspect;
            } else {
              width = window.innerWidth;
              height = width * aspect;
            }
            canvasElement.width = width;
            canvasElement.height = height;
            await pose.send({ image: input });
          }
        }),
        // @ts-ignore
        new controls.Slider({
          title: "Model Complexity",
          field: "modelComplexity",
          discrete: ["Lite", "Full", "Heavy"]
        }),
        // @ts-ignore
        new controls.Toggle({
          title: "Smooth Landmarks",
          field: "smoothLandmarks"
        }),
        // @ts-ignore
        new controls.Toggle({
          title: "Enable Segmentation",
          field: "enableSegmentation"
        }),
        // @ts-ignore
        new controls.Toggle({
          title: "Smooth Segmentation",
          field: "smoothSegmentation"
        }),
        // @ts-ignore
        new controls.Slider({
          title: "Min Detection Confidence",
          field: "minDetectionConfidence",
          range: [0, 1],
          step: 0.01
        }),
        // @ts-ignore
        new controls.Slider({
          title: "Min Tracking Confidence",
          field: "minTrackingConfidence",
          range: [0, 1],
          step: 0.01
        }),
        // @ts-ignore
        new controls.Slider({
          title: "Effect",
          field: "effect",
          discrete: { background: "Background", mask: "Foreground" }
        })
      ])
      // @ts-ignore
      .on((x) => {
        // @ts-ignore
        const options = x as mpPose.Options;
        videoElement.classList.toggle("selfie", options.selfieMode);
        activeEffect = (x as { [key: string]: string })["effect"];
        pose.setOptions(options);
      });
  }, []);

  /* eslint-disable @next/next/no-sync-scripts */
  const renderedPageHead = (
    <PageHead title="Mediapipe Playground" description="A Mediapipe Playground">
      <link
        rel="stylesheet"
        type="text/css"
        // href="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils_3d@0.2/landmark_grid.css"
        href="/mediapipe-asset/landmark_grid.css"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        type="text/css"
        // href="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils@0.6/control_utils.css"
        href="/mediapipe-asset/control_utils.css"
        crossOrigin="anonymous"
      />
      <script
        // src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3/camera_utils.js"
        src="/mediapipe-asset/camera_utils.js"
        crossOrigin="anonymous"
      />
      <script
        // src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils_3d@0.2/control_utils_3d.js"
        src="/mediapipe-asset/control_utils_3d.js"
        crossOrigin="anonymous"
      />
      <script
        // src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils@0.6/control_utils.js"
        src="/mediapipe-asset/control_utils.js"
        crossOrigin="anonymous"
      />
      <script
        // src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3/drawing_utils.js"
        src="/mediapipe-asset/drawing_utils.js"
        crossOrigin="anonymous"
      />
      <script
        // src="https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.4/pose.js"
        src="/mediapipe-asset/pose.js"
        crossOrigin="anonymous"
      />
    </PageHead>
  );
  /* eslint-enable @next/next/no-sync-scripts */

  return (
    <>
      <GlobalStyle />
      {renderedPageHead}
      <div className="container">
        <video className="input_video" />
        <canvas className="output_canvas" width="1280px" height="720px" />
        <div className="loading">
          <div className="spinner" />
          <div className="message">Loading</div>
        </div>
        <a
          className="abs logo"
          href="http://www.mediapipe.dev"
          target="_blank"
          rel="noreferrer"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              bottom: 0,
              right: "10px"
            }}
          >
            <span className="title">MediaPipe</span>
          </div>
        </a>
        <div className="shoutout">
          <div>
            <a href="https://solutions.mediapipe.dev/pose">
              Click here for more info
            </a>
          </div>
        </div>
      </div>
      <div className="control-panel" />
      <div className="square-box">
        <div className="landmark-grid-container" />
      </div>
    </>
  );
};

export default MediapipePage;
