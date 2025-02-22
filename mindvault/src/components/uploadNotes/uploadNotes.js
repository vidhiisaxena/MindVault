import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "./uploadNotes.css";

const UploadPage = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="upload-page">
            <Button className="open-modal-btn" onClick={() => setShowModal(true)}>
                📤 Upload Notes
            </Button>

            {/* Upload Notes Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body className="upload-modal">
                    <h4>Upload Your Notes</h4>
                    <p>Select and upload your notes for easy access.</p>
                    <input type="file" className="upload-input" />
                    <div className="modal-actions">
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary">Upload</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default UploadPage;
