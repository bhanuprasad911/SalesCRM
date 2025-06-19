import React, { useState, useRef } from "react";
import axios from "axios";

const FileUploader = () => {
  const [progress, setProgress] = useState(0);
  const [fileBuffer, setFileBuffer] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileRef = useRef();

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setProgress(0);
    setFileBuffer(null);
    setUploadedFileName("");

    try {
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

      setFileBuffer(res.data.tempId); // Simulate buffer tracking with tempId
      setUploadedFileName(file.name);
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
    } catch (err) {
      console.error("Saving to DB failed", err);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
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
        <p>Click or drag to upload file</p>
      </div>

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

      {progress === 100 && fileBuffer && (
        <button
          onClick={handleSaveToDb}
          style={{ marginTop: "20px", padding: "10px 20px" }}
        >
          Upload to DB
        </button>
      )}
    </div>
  );
};

export default FileUploader;
