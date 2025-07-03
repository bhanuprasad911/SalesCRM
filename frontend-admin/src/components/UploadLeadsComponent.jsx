import React, { useState, useRef } from "react";
import style from "../styles/UpploadLeads.module.css";
import { MdDriveFolderUpload } from "react-icons/md";
import toast from "react-hot-toast";
import {
  cancelTempUpload,
  saveLeadsToDB,
  uploadTempFile,
} from "../services/api.js";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

function UploadLeadsComponent({ showForm, refreshLeads }) {
  const [progress, setProgress] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [fileBuffer, setFileBuffer] = useState(null); // tempId or file
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileRef = useRef();

  const resetState = () => {
    setProgress(0);
    setIsVerifying(false);
    setVerified(false);
    setFileBuffer(null);
    setUploadedFileName("");
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Only CSV files are allowed.");
      return;
    }

    resetState();
    setUploadedFileName(file.name);
    setFileBuffer(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect({ target: { files: [file] } });
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleTempUploadAndVerify = async () => {
    if (!fileBuffer || typeof fileBuffer === "string") {
      toast.error("Please select a valid file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileBuffer);

    try {
      setIsVerifying(true);
      setProgress(10);

      // Simulate progress while uploading/validating
      let p = 10;
      const interval = setInterval(() => {
        if (p < 95) {
          p += 5;
          setProgress(p);
        } else {
          clearInterval(interval);
        }
      }, 150);

      const res = await uploadTempFile(formData);

      clearInterval(interval);
      setProgress(100);
      setFileBuffer(res.tempId); // Now holds the temp file ID
      setIsVerifying(false);
      setVerified(true);
    } catch (error) {
      console.error("uploadTempFile error:", error);
      setIsVerifying(false);
      setProgress(0);

      const message = error?.response?.data?.message || "Upload failed.";
      toast.error(message);

      const duplicates = error?.response?.data?.duplicates || [];
      duplicates.forEach((d) => toast.error(`Duplicate: ${d}`));

      resetState();
      showForm(false);
    }
  };

  const handleSaveToDb = async () => {
    if (!fileBuffer || typeof fileBuffer !== "string") {
      toast.error("File not verified.");
      return;
    }

    try {
      const res = await saveLeadsToDB(fileBuffer, uploadedFileName);
      toast.success(res.message);
      await refreshLeads();
      showForm(false);
      resetState();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save to DB");
      err.response?.data?.duplicates?.forEach((d) =>
        toast.error(`Duplicate: ${d}`)
      );
      showForm(false);
      resetState();
    }
  };

  const handleCancelUpload = async () => {
    if (!fileBuffer) {
      showForm(false);
      return;
    }

    if (typeof fileBuffer !== "string") {
      toast.success("File selection cancelled.");
      resetState();
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    try {
      await cancelTempUpload(fileBuffer);
      toast.success("Upload cancelled.");
      resetState();
      if (fileRef.current) fileRef.current.value = "";
    } catch (error) {
      console.log(error);
      toast.error("Cancel failed. Try again.");
    }
  };

  return (
    <div className={style.main} onClick={() => showForm(false)}>
      <div className={style.innerMain} onClick={(e) => e.stopPropagation()}>
        <div className={style.header}>
          <div className={style.left}>
            <h2>CSV Upload</h2>
            <p>Add your documents here</p>
          </div>
          <button className={style.close} onClick={() => showForm(false)}>
            X
          </button>
        </div>

        <div className={style.body}>
          {progress === 0 && (
            <>
              <input
                type="file"
                ref={fileRef}
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
              <div
                className={style.drag}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <MdDriveFolderUpload size={50} />
              </div>
              <p>Drag your file to start uploading</p>
              <p>or</p>
              <button
                className={style.btn}
                onClick={() => fileRef.current.click()}
              >
                Browse files
              </button>
            </>
          )}

          {uploadedFileName && (
            <p style={{ color: "#333", marginTop: "10px" }}>
              {uploadedFileName}
            </p>
          )}

          {progress > 0 && (
            <div style={{ width: 50, height: 50, margin: "20px auto" }}>
              <CircularProgressbar
                value={progress}
                text={`${progress}%`}
                styles={buildStyles({
                  textSize: "20px",
                  pathColor: "rgb(19,19,19)",
                  textColor: "#333",
                  trailColor: "#eee",
                })}
              />
            </div>
          )}

          {progress > 0 && progress < 100 && isVerifying && (
            <div style={{ marginTop: "20px" }}>
              <p>Verifying leads...</p>
            </div>
          )}

          {progress === 100 && verified && (
            <p style={{ marginTop: "10px" }}>
              File verified. Click <strong>Upload</strong> to save or{" "}
              <strong>Cancel</strong> to discard.
            </p>
          )}
        </div>

        <div className={style.buttons}>
          {!verified ? (
            <button onClick={handleTempUploadAndVerify} className={style.save}>
              Next {">"}
            </button>
          ) : (
            <button onClick={handleSaveToDb} className={style.save}>
              Upload
            </button>
          )}
          <button onClick={handleCancelUpload} className={style.cancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadLeadsComponent;
