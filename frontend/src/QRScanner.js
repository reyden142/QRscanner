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

  // Normalize QR code data: extract path from URL if needed
  const normalizeQRData = (qrData) => {
    if (!qrData) return qrData;

    // Trim whitespace
    const trimmed = qrData.trim();

    // If it's already a relative path starting with /, return as is
    if (trimmed.startsWith("/")) {
      return trimmed;
    }

    // If it's a full URL, extract the path
    try {
      const url = new URL(trimmed);
      return url.pathname;
    } catch (e) {
      // If it's not a valid URL, check if it looks like a path
      if (trimmed.includes("/uploads/")) {
        const pathMatch = trimmed.match(/\/uploads\/[^/]+\.(jpg|jpeg|png|gif)/i);
        if (pathMatch) {
          return pathMatch[0];
        }
      }
      // Return trimmed if we can't parse it
      return trimmed;
    }
  };

  // Get the full image URL from QR data
  const getImageUrl = (qrData) => {
    const normalizedPath = normalizeQRData(qrData);

    // If it's already a full URL (starts with http/https), return as is
    if (normalizedPath.startsWith("http://") || normalizedPath.startsWith("https://")) {
      return normalizedPath;
    }

    // Otherwise, construct URL using current origin
    return `${window.location.origin}${normalizedPath}`;
  };

  // Check if the QR data represents an image file
  const isImageFile = (qrData) => {
    if (!qrData) return false;
    const normalized = normalizeQRData(qrData);
    // Check if it ends with image extension OR contains /uploads/ path
    return /\.(jpg|jpeg|png|gif)$/i.test(normalized) || normalized.includes("/uploads/");
  };

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
          // Trim the QR data to remove any whitespace
          const trimmedData = qrCodeData.data.trim();
          setScanResult(trimmedData);
          setIsScanning(false);
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error scanning QR code:", error);
      }
    };
    img.onerror = () => console.error("Failed to load image for QR scanning");
  }, []);

  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(scanQRCode, 500);
    return () => clearInterval(interval);
  }, [isScanning, scanQRCode]);

  const closeModal = () => {
    setShowModal(false);
    setScanResult("");
    setIsScanning(true);
  };

  const imageUrl = scanResult ? getImageUrl(scanResult) : "";

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
                  src={imageUrl}
                  alt="Scanned File"
                  className={`image-preview ${imageLoading ? "loading" : ""}`}
                  onLoad={() => setImageLoading(false)}
                  onError={(e) => {
                    console.error("Failed to load image:", imageUrl);
                    setImageLoading(false);
                  }}
                />
              ) : (
                <div>
                  <p>Unsupported or invalid QR Code data</p>
                  <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
                    Scanned: {scanResult}
                  </p>
                </div>
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