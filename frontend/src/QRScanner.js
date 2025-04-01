import React, { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import "./QRScanner.css";

const QRScanner = () => {
  const [scanResult, setScanResult] = useState("");
  const [isScanning, setIsScanning] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const webcamRef = useRef(null);

  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(scanQRCode, 500);
    return () => clearInterval(interval);
  }, [isScanning]);

  const scanQRCode = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);

        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const qrCodeData = jsQR(
          imageData.data,
          imageData.width,
          imageData.height
        );

        if (qrCodeData) {
          setScanResult(qrCodeData.data);
          setIsScanning(false);
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error scanning QR code:", error);
      }
    };
    img.onerror = () => console.error("Failed to load image for QR scanning");
  }, []);

  const closeModal = () => {
    setShowModal(false);
    setScanResult("");
    setIsScanning(true);
  };

  const isImageFile = (url) => /\.(jpg|jpeg|png|gif)$/i.test(url);

  return (
    <div>
      <Webcam
        className="webcam-container"
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "environment" }}
      />

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <div className="image-container">
              {isImageFile(scanResult) ? (
                <img
                  src={scanResult}
                  alt="Scanned File"
                  className={`image-preview ${imageLoading ? "loading" : ""}`}
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              ) : (
                <p>Unsupported or invalid QR Code data</p>
              )}
            </div>
          </div>
        </div>
      )}

      {!showModal && <p>Scan Result: {scanResult || "Scanning..."}</p>}
    </div>
  );
};

export default QRScanner;
