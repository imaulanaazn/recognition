"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import RegisterUserModal from "./RegisterUserModal";

const FaceRecognizer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detectedUser, setDetectedUser] = useState<{
    name: string;
    status: string;
  }>({
    name: "unknown",
    status: "not marked",
  });
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const knownFaces = useRef<{ name: string; descriptor: Float32Array }[]>([]);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri(
        "/models/tiny_face_detector"
      );
      // await faceapi.nets.faceLandmark68Net.loadFromUri(
      //   "/models/face_landmark_68"
      // );
      await faceapi.nets.faceRecognitionNet.loadFromUri(
        "/models/face_recognition"
      );
    };
    loadModels();
  }, []);

  const startVideo = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  }, []);

  const stopVideo = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const updateCanvasSize = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const videoAspectRatio =
        videoRef.current.videoWidth / videoRef.current.videoHeight;
      const canvasContainer = videoRef.current.parentElement;

      if (canvasContainer) {
        const { width: containerWidth, height: containerHeight } =
          canvasContainer.getBoundingClientRect();
        let canvasWidth, canvasHeight;

        if (containerWidth / containerHeight > videoAspectRatio) {
          canvasHeight = containerHeight;
          canvasWidth = containerHeight * videoAspectRatio;
        } else {
          canvasWidth = containerWidth;
          canvasHeight = containerWidth / videoAspectRatio;
        }

        canvasRef.current.width = canvasWidth;
        canvasRef.current.height = canvasHeight;
        faceapi.matchDimensions(canvasRef.current, {
          width: canvasWidth,
          height: canvasHeight,
        });
      }
    }
  }, []);

  const isKnownFace = (descriptor: Float32Array) => {
    const distanceThreshold = 0.6;
    return knownFaces.current.some((face) => {
      const distance = faceapi.euclideanDistance(face.descriptor, descriptor);
      return distance < distanceThreshold;
    });
  };

  const handleNewFace = (descriptor: Float32Array) => {
    if (!isKnownFace(descriptor)) {
      checkAttendance(descriptor);
      const newFace = { name: "unknown", descriptor };
      knownFaces.current = [newFace];
    } else {
      console.error("face already detected");
    }
  };

  async function checkAttendance(descriptor: Float32Array) {
    const arrayDescriptor = Array.from(descriptor);
    try {
      const response = await fetch("http://localhost:3001/check-attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ faceDescriptor: arrayDescriptor }),
      });
      if (response.status === 404) {
        setDetectedUser({ name: "unknown", status: "not marked" });
      } else {
        const result = await response.json();
        setDetectedUser({ name: result.name, status: "marked" });
      }
    } catch (error) {
      console.error("Error recognizing face:", error);
    }
  }

  useEffect(() => {
    const isGoodDetection = (detection: any) => detection.detection.score > 0.9;

    if (cameraActive) {
      startVideo();
      if (videoRef.current && canvasRef.current) {
        videoRef.current.addEventListener("play", () => {
          updateCanvasSize();
          window.addEventListener("resize", updateCanvasSize);

          const interval = setInterval(async () => {
            const detections = await faceapi
              .detectAllFaces(
                videoRef.current!,
                new faceapi.TinyFaceDetectorOptions()
              )
              .withFaceLandmarks()
              .withFaceDescriptors();

            if (detections.length > 0) {
              const goodDetections = detections.filter(isGoodDetection);
              if (goodDetections.length > 0) {
                const faceDescriptor = goodDetections[0].descriptor;
                handleNewFace(faceDescriptor);
              }

              if (canvasRef.current) {
                const context = canvasRef.current.getContext("2d");

                // Clear the previous frame
                context?.clearRect(
                  0,
                  0,
                  canvasRef.current.width,
                  canvasRef.current.height
                );

                // Flip context horizontally
                context?.scale(-1, 1);
                context?.translate(-canvasRef.current.width, 0);

                const resizedDetections = faceapi.resizeResults(
                  goodDetections,
                  {
                    width: canvasRef.current.width,
                    height: canvasRef.current.height,
                  }
                );

                // Draw detections and landmarks
                faceapi.draw.drawDetections(
                  canvasRef.current,
                  resizedDetections
                );
                faceapi.draw.drawFaceLandmarks(
                  canvasRef.current,
                  resizedDetections
                );

                // Reset context after drawing
                context?.setTransform(1, 0, 0, 1, 0, 0);
              }
            }
          }, 200);

          return () => {
            clearInterval(interval);
            window.removeEventListener("resize", updateCanvasSize);
          };
        });
      }
    } else {
      stopVideo();
    }
  }, [cameraActive, startVideo, stopVideo, updateCanvasSize]);

  const captureImage = () => {
    if (videoRef.current && cameraActive) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");

      if (context) {
        context.scale(-1, 1); // Mirror the capture
        context.translate(-canvas.width, 0);
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");
        setPreviewImage(imageData); // Save captured image
      }
    }
  };

  return (
    <div className="attendance-wrapper w-full lg:w-3/5 p-4 md:p-6 lg:p-8 bg-white rounded-xl md:rounded-2xl">
      <div className="header flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Face Recognition
        </h2>

        <button
          onClick={() => setCameraActive(!cameraActive)}
          className={`act-button flex items-center gap-2 w-max ${
            cameraActive
              ? "bg-gray-200 text-gray-500"
              : "bg-emerald-100 text-emerald-700"
          } py-2 px-4 rounded-full`}
        >
          {cameraActive ? "Matikan" : "Aktifkan"}
        </button>
      </div>
      <div className="relative w-full h-auto aspect-[4/5] md:aspect-[4/3] bg-gray-200 rounded-lg lg:rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-full object-cover absolute top-0 left-0 transform scale-x-[-1]"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
        <div className="absolute bottom-0 left-0 bg-[rgba(255,255,255,0.6)] w-full flex items-center justify-end text-center py-3 gap-10 px-4 md:px-6">
          <div className="hidden md:flex gap-1 text-base">
            <p className="text-gray-700">nama :</p>
            <span className="text-base text-gray-700">{detectedUser.name}</span>
          </div>
          <div className="hidden md:flex gap-1 text-base">
            <p className="text-gray-700">status :</p>
            <span className="text-base text-emerald-600">
              {detectedUser.status}
            </span>
          </div>

          <button
            onClick={() => {
              setShowModal(true);
              captureImage();
            }}
            className="text-blue-600 text-sm md:hidden"
          >
            Daftarkan pengguna ?
          </button>
        </div>
      </div>

      <div className="md:hidden flex gap-1 text-base mt-2">
        <p className="text-gray-500 text-sm">nama :</p>
        <span className="text-sm text-gray-500"> {detectedUser.name}</span>
      </div>

      <div className="md:hidden flex gap-1 text-base">
        <p className="text-gray-500 text-sm">status :</p>
        <span className="text-sm text-emerald-600"> {detectedUser.status}</span>
      </div>

      <div className="flex justify-start mt-3 hidden md:block">
        <button
          onClick={() => {
            setShowModal(true);
            captureImage();
          }}
          className="text-blue-600"
        >
          Daftarkan pengguna ?
        </button>
      </div>

      {/* {showModal && (
        <RegisterUserModal
          setPreviewImage={(imagUrl: string) => { 
            setPreviewImage(imagUrl);
          }}
          previewImage={previewImage}
          setShowModal={(showModal: boolean) => {
            setShowModal(showModal);
          }}
        />
      )} */}
    </div>
  );
};

export default FaceRecognizer;
