

import React, {useRef, useEffect} from 'react';
import './App.css';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import Webcam from 'react-webcam';
import { drawMesh } from './utilities';

function App() {
  //Define styles
  const facemeshStyle = {
    position:     "absolute",
    marginLeft:   "auto",
    marginRight:  "auto",
    left:         0,
    right:        0,
    textAlign:    "center",
    zIndex:       9,
    width:        640,
    height:       480,
    display:      "block"
  }

  let cameraStyle = {
    position:     "absolute",
    marginLeft:   "auto",
    marginRight:  "auto",
    left:         0,
    right:        0,
    textAlign:    "center",
    zIndex:       9,
    width:        640,
    height:       480,
    display:      "block"
  }

  const headerStyle = {
    position:     "absolute",
    bottom:       1000,
    textAlign:    "center",
    zIndex:       10,
  }

  const versionStyle = {
    position:     "absolute",
    bottom:       950,
    textAlign:    "center",
    zIndex:       10,

  }

  const buttonStyle = {
    position:     "absolute",
    top:          900,
    textAlign:    "center",
    zIndex:       10,
    marginLeft:   "auto",
    marginRight:  "auto",
    left:         0,
    right:        0,
  }
  //Setup Refs
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  //Load facemesh
  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution: {
        width: 640, 
        height: 480
      }, 
      scale: 0.8
    });

    setInterval(() => {
      detect(net);
    }, 1);  
  };

  const detect = async (net) => {
    if (
      webcamRef.current instanceof Webcam && 
      webcamRef.current.video.readyState === 4 &&
      net instanceof facemesh.FaceMesh &&
      canvasRef.current instanceof HTMLCanvasElement
    ) {
      const ctx = canvasRef.current.getContext("2d");
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const face = await net.estimateFaces(video);

      requestAnimationFrame(()=>{drawMesh(face, ctx)});
    }
  };

  const toggleCamera = () => {
    webcamRef.current.video.style.visibility === "hidden" ?
    webcamRef.current.video.style.visibility = "" :
    webcamRef.current.video.style.visibility = "hidden";
  }

  const toggleMesh = () => {
    canvasRef.current.style.visibility === "hidden" ?
    canvasRef.current.style.visibility = "" :
    canvasRef.current.style.visibility = "hidden";
  }

  useEffect(()=>{runFacemesh()});

  return (
    <div className="App">
      <header
        className='App-header'
      >
        <h1 style={headerStyle}>
          Face Mesh Test
        </h1>
        <h5 style={versionStyle}>
          TensorFlow: {tf.version['tfjs-core']}
        </h5>
        <Webcam 
          ref={webcamRef} 
          style={cameraStyle} 
        />
        <canvas 
          ref={canvasRef} 
          style={facemeshStyle} 
        ></canvas>
      </header>
      <div style={buttonStyle}>
        <button onClick={toggleCamera}>
          Toggle Camera
        </button>
        <button onClick={toggleMesh}>
          Toggle Mesh
        </button>
      </div>
    </div>
  );
}

export default App;
