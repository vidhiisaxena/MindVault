import React, { useState, useEffect } from "react";
import { Button, Modal, Toast, Form, ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { uploadPDF, generateFlashcards } from "../../api";
import "./uploadNotes.css";
import Sidebar from "../sidebar/sidebar";
import FlashcardList from "../flashcard/flashcardlist";


const UploadPage = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showYoutubeModal, setShowYoutubeModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState("");
    const [youtubeLink, setYoutubeLink] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadedLinks, setUploadedLinks] = useState([]);
    const [tag, setTag] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [newSubject, setNewSubject] = useState("");
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const storedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
        const storedLinks = JSON.parse(localStorage.getItem("uploadedLinks")) || [];
        setUploadedFiles(storedFiles);
        setUploadedLinks(storedLinks);

        const storedSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
        const extractedSubjects = storedSubjects.map(subject =>
            typeof subject === "object" && subject.name ? subject.name : subject
        );
        const defaultSubjects = ["Machine Learning", "Neural Networks", "Deep Learning"];
        const mergedSubjects = [...new Set([...defaultSubjects, ...extractedSubjects])];
        setSubjects(mergedSubjects);
    }, []);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setProgress(0);
    };

    const handleUpload = async () => {
        if (!selectedFile || tag.trim() === "") return alert("Please select a file and subject.");
    
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("tag", tag);
    
        console.log("Uploading file with the following data:");
        console.log("File name: ", selectedFile.name);
        console.log("Tag: ", tag);
    
        try {
            setMessage("Uploading PDF...");
            setProgress(30);
    
            const uploadRes = await fetch("https://devcation.onrender.com/upload-pdf", {
                method: "POST",
                body: formData,
            });
    
            console.log("Upload response status: ", uploadRes.status);
    
            const uploadResData = await uploadRes.json();
            console.log(uploadResData);
    
            if (!uploadRes.ok) throw new Error("Failed to upload PDF.");
            setProgress(50);
    
            // Step 2: Generate Flashcards
            setMessage("Generating flashcards...");
            const generateFlashcardsRes = await fetch("https://devcation.onrender.com/generate-flashcards", {
                method: "POST",
            });
            if (!generateFlashcardsRes.ok) throw new Error("Failed to generate flashcards.");
            setProgress(75);
    
            // Step 3: Fetch Flashcards
            setMessage("Fetching flashcards...");
            const flashcardRes = await fetch("https://devcation.onrender.com/get-flashcards");
            const flashcardData = await flashcardRes.json();
            if (!flashcardRes.ok || !flashcardData.flashcards) throw new Error("Flashcard generation failed.");
            const generatedFlashcards = flashcardData.flashcards;
            localStorage.setItem("flashcards", JSON.stringify(generatedFlashcards));
            setFlashcards(generatedFlashcards);
    
            const newFile = { name: selectedFile.name, tag };
            const newFiles = [...uploadedFiles, newFile];
            setUploadedFiles(newFiles);
            localStorage.setItem("uploadedFiles", JSON.stringify(newFiles));
    
            const storedSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
            if (!storedSubjects.includes(tag)) {
                const updatedSubjects = [...storedSubjects, tag];
                localStorage.setItem("subjects", JSON.stringify(updatedSubjects));
            }
    
            setProgress(100);
            setShowToast(true);
            setShowModal(false);
            setTag("");
    
        } catch (error) {
            console.error("Error during upload flow:", error);
            setMessage(`Upload failed: ${error.message}`);
        }
    };    
                
            

    const handleYoutubeUpload = async () => {
        if (youtubeLink.trim() === "" || tag.trim() === "") {
            alert("Please enter a YouTube link and select a subject.");
            return;
        }
    
        try {
            setMessage("Processing YouTube link...");
            setProgress(30);
    
            const res = await fetch("https://devcation.onrender.com/generate-content", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ link: youtubeLink, tag }),
            });
    
            if (!res.ok) throw new Error("Failed to process YouTube link.");
    
            setProgress(60);
            const flashcardRes = await fetch("https://devcation.onrender.com/get-flashcards");
            const flashcardData = await flashcardRes.json();
    
            if (!flashcardRes.ok || !flashcardData.flashcards) {
                throw new Error("Failed to retrieve flashcards.");
            }
    
            setProgress(100);
            const generatedFlashcards = flashcardData.flashcards;
            localStorage.setItem("flashcards", JSON.stringify(generatedFlashcards));
            setFlashcards(generatedFlashcards);
    
            // Save the link and tag to localStorage
            const newLink = { link: youtubeLink, tag };
            const newLinks = [...uploadedLinks, newLink];
            setUploadedLinks(newLinks);
            localStorage.setItem("uploadedLinks", JSON.stringify(newLinks));
    
            // Save new subject if not already present
            const storedSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
            if (!storedSubjects.includes(tag)) {
                const updatedSubjects = [...storedSubjects, tag];
                localStorage.setItem("subjects", JSON.stringify(updatedSubjects));
            }
    
            setYoutubeLink("");
            setShowToast(true);
            setShowYoutubeModal(false);
            setTag("");
            setMessage("");
    
        } catch (error) {
            console.error("YouTube upload failed:", error);
            setMessage(`Upload failed: ${error.message}`);
        }
    };
    

    const handleAddSubject = () => {
        if (newSubject && !subjects.includes(newSubject)) {
            const updatedSubjects = [...subjects, newSubject];
            setSubjects(updatedSubjects);
            localStorage.setItem("subjects", JSON.stringify(updatedSubjects));
            setNewSubject("");
        }
    };

    return (
        <div className="upload-page">
            <Sidebar />
            <Button className="open-modal-btn" onClick={() => setShowModal(true)}>📤 Upload Notes</Button>
            <Button className="open-modal-btn" onClick={() => navigate("/reviseNotes")}>✍🏻 Revise previous Notes</Button>
            <Button className="open-modal-btn" onClick={() => setShowYoutubeModal(true)}>🎥 Upload YouTube Lecture</Button>

            {/* Upload PDF Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body className="upload-modal">
                    <h4>Upload Your Notes</h4>
                    <p>Select and upload your notes for flashcard generation.</p>
                    <input type="file" className="upload-input" onChange={handleFileChange} />
                    {progress > 0 && <ProgressBar now={progress} label={`${progress}%`} />}
                    <Form.Select className="mt-3" value={tag} onChange={(e) => setTag(e.target.value)}>
                        <option value="">-- Select a Subject --</option>
                        {subjects.map((subject, idx) => (
                            <option key={idx} value={subject}>{subject}</option>
                        ))}
                    </Form.Select>
                    <Form.Control
                        type="text"
                        placeholder="Add new subject..."
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        className="mt-2"
                    />
                    <Button variant="success" className="mt-2" onClick={handleAddSubject}>➕ Add Subject</Button>
                    <div className="modal-actions mt-3">
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleUpload} disabled={!selectedFile}>Upload</Button>
                    </div>
                    {message && <p className="upload-message">{message}</p>}
                </Modal.Body>
            </Modal>

            {/* Upload YouTube Modal */}
            <Modal show={showYoutubeModal} onHide={() => setShowYoutubeModal(false)} centered>
                <Modal.Body className="upload-modal">
                    <h4>Upload YouTube Lecture</h4>
                    <p>Paste a YouTube lecture link to store and tag.</p>
                    <Form.Control 
                        type="text"
                        placeholder="Paste YouTube Link here"
                        value={youtubeLink}
                        onChange={(e) => setYoutubeLink(e.target.value)}
                    />
                    <Form.Select className="mt-3" value={tag} onChange={(e) => setTag(e.target.value)}>
                        <option value="">-- Select a Subject --</option>
                        {subjects.map((subject, idx) => (
                            <option key={idx} value={subject}>{subject}</option>
                        ))}
                    </Form.Select>
                    <Form.Control
                        type="text"
                        placeholder="Add new subject..."
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        className="mt-2"
                    />
                    <Button variant="success" className="mt-2" onClick={handleAddSubject}>➕ Add Subject</Button>
                    <div className="modal-actions mt-3">
                        <Button variant="secondary" onClick={() => setShowYoutubeModal(false)}>Cancel</Button>
                        <Button variant="success" onClick={handleYoutubeUpload} disabled={!youtubeLink.trim()}>
                            🎥 Upload YouTube Link
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Toast */}
            <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide className="success-toast">
                <Toast.Body>🎉 Uploaded successfully!</Toast.Body>
            </Toast>

            {/* Flashcards List */}
            {/* <FlashcardList flashcards={flashcards} /> */}
            {/* <Button variant="info" onClick={() => navigate("../flashcards/flashcardlist.jsx")}>
                📚 Go to Flashcards
            </Button> */}
        </div>
    );
};

export default UploadPage;
