import React, { useState } from "react";
import { Button, Modal, Toast } from "react-bootstrap";
import "./uploadNotes.css";
import Sidebar from "../sidebar/sidebar";

const UploadPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState("");

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (selectedFile) {
            setUploadedFileName(selectedFile.name);
            setShowToast(true); // Show success message
            setShowModal(false); // Close the modal
        }
    };

    return (
        <div className="upload-page">
            <Sidebar />
            <Button className="open-modal-btn" onClick={() => setShowModal(true)}>
                📤 Upload Notes
            </Button>

            {/* Display uploaded file name */}
            {uploadedFileName && (
                <p className="uploaded-file">
                    <strong>📂 File uploaded:</strong> {uploadedFileName}
                </p>
            )}
            
            {/* Upload Notes Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body className="upload-modal">
                    <h4>Upload Your Notes</h4>
                    <p>Select and upload your notes for easy access.</p>
                    <input type="file" className="upload-input" onChange={handleFileChange} />
                    <div className="modal-actions">
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleUpload} disabled={!selectedFile}>Upload</Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Success Notification */}
            <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide className="success-toast">
                <Toast.Body>🎉 Good work! File uploaded successfully.</Toast.Body>
            </Toast>
        </div>
    );
};

export default UploadPage;
