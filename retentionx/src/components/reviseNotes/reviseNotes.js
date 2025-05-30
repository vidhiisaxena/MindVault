import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./reviseNotes.css";

const RevisedNotes = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
        setUploadedFiles(storedFiles);
    }, []);

    const updateStatus = (index, status) => {
        const updatedFiles = [...uploadedFiles];
        updatedFiles[index].status = status;
        setUploadedFiles(updatedFiles);
        localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
    };

    const deleteFile = (index) => {
        const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
        setUploadedFiles(updatedFiles);
        localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
    };

    const filteredFiles = uploadedFiles.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        file.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const toggleFavorite = (index) => {
        const updatedFiles = [...uploadedFiles];
        updatedFiles[index].favorite = !updatedFiles[index].favorite;
        setUploadedFiles(updatedFiles);
    };
    

    return (
        <div className="revised-notes">
            <Button className="back-btn" onClick={() => navigate("/uploadNotes")}>⬅️ Back to Upload</Button>
            <h2>📂 Previously Uploaded Notes</h2>
            <input 
                type="text" 
                className="search-bar"
                placeholder="🔍 Search files..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
            />

            {filteredFiles.length > 0 ? (
                <ul className="file-list">
                    {filteredFiles.map((file, index) => (
                        <li key={index} className="file-item">
                            📜 {file.name}
                            <span className={file.status === "Reviewed" ? "status-reviewed" : "status-pending"}>
                                {file.status === "Reviewed" ? "✅ Reviewed" : "⏳ To Review"}
                            </span>
                             <div className="button-group">
                                <Button 
                                    className="status-btn reviewed-btn"
                                    variant="success"
                                    onClick={() => updateStatus(index, "Reviewed")}
                                >
                                    ✅ Reviewed
                                </Button>
                                <Button 
                                    className="status-btn to-review-btn"
                                    variant="warning"
                                    onClick={() => updateStatus(index, "To Review")}
                                >
                                    ⏳ To Review
                                </Button>
                                <Button 
                                    className="status-btn delete-btn"
                                    variant="danger"
                                    onClick={() => deleteFile(index)}
                                >
                                    🗑️ Delete
                                </Button>

                                <Button 
                                className="status-btn btn btn-info"
                                onClick={() => toggleFavorite(index)}>
                                {file.favorite ? "⭐ Unstar" : "⭐ Star"}
                                </Button>

                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No notes found.</p>
            )}
        </div>
    );
};

export default RevisedNotes;
