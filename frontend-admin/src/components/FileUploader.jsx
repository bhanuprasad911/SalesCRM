import React, { useState, useRef } from "react";
import axios from "axios";
import { MdDriveFolderUpload } from "react-icons/md";
import styles from "../styles/FileUploader.module.css";

const FileUploader = () => {
  const [progress, setProgress] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [fileBuffer, setFileBuffer] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileRef = useRef();

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setProgress(0);
    setIsVerifying(false);
    setVerified(false);
    setFileBuffer(null);
    setUploadedFileName("");

    try {
      // Uploading CSV to temp
      const res = await axios.post(
        "http://localhost:5000/upload-temp",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
          },
        }
      );

      setIsVerifying(true); // Show verifying after upload
      setUploadedFileName(file.name);

      // Simulate backend verification delay
      setTimeout(() => {
        setFileBuffer(res.data.tempId); // tempId returned by backend
        setIsVerifying(false);
        setVerified(true);
      }, 1500); // fake delay (can be real from backend)
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleSaveToDb = async () => {
    if (!fileBuffer) return;

    try {
      const res = await axios.post("http://localhost:5000/save-to-db", {
        tempId: fileBuffer,
        fileName: uploadedFileName,
      });
      alert(res.data.message);
      resetState();
    } catch (err) {
      console.error("Saving to DB failed", err);
    }
  };

  const handleCancelUpload = async () => {
    if (!fileBuffer) return;

    try {
      await axios.post("http://localhost:5000/cancel-upload", {
        tempId: fileBuffer,
      });
      alert("Upload cancelled.");
      resetState();
    } catch (err) {
      console.error("Cancel failed", err);
    }
  };

  const resetState = () => {
    setProgress(0);
    setIsVerifying(false);
    setVerified(false);
    setFileBuffer(null);
    setUploadedFileName("");
  };

  return (
    <div style={{ textAlign: "center", height: "100%", width: "100%" }}>
      <input
        type="file"
        ref={fileRef}
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
      <div
        onClick={() => fileRef.current.click()}
        style={{
          border: "2px dashed #999",
          padding: "40px",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        <MdDriveFolderUpload />
        <p>Drag your file to start uplaoding</p>
        <p>or</p>
        <button>Browse files</button>
      </div>

      {/* Uploading Progress */}
      {progress > 0 && progress < 100 && (
        <div
          style={{
            margin: "20px auto",
            width: "100px",
            height: "100px",
            position: "relative",
          }}
        >
          <svg width="100" height="100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#ddd"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#00f"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 45}
              strokeDashoffset={(1 - progress / 100) * 2 * Math.PI * 45}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              top: "35px",
              left: "0",
              width: "100%",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {progress}%
          </div>
        </div>
      )}

      {/* Verifying... Loader */}
      {progress === 100 && isVerifying && (
        <div style={{ marginTop: "20px" }}>
          <div
            className="loader"
            style={{
              border: "6px solid #f3f3f3",
              borderTop: "6px solid #1976d2",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              animation: "spin 1s linear infinite",
              margin: "auto",
            }}
          />
          <p>Verifying leads...</p>
        </div>
      )}

      {/* Final Step: Cancel or Proceed */}
      {verified && (
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={handleSaveToDb}
            style={{ padding: "10px 20px", marginRight: "10px" }}
          >
            ✅ Proceed
          </button>
          <button onClick={handleCancelUpload} style={{ padding: "10px 20px" }}>
            ❌ Cancel
          </button>
        </div>
      )}

      {/* Loader animation CSS */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default FileUploader;
