import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; // Adjust if needed

export const uploadPDF = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    
    return axios.post(`${API_BASE_URL}/upload-pdf`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const generateFlashcards = async () => {
    return axios.post(`${API_BASE_URL}/generate-flashcards`);
};

export const rateFlashcard = async (flashcardId, difficulty) => {
    return axios.post(`${API_BASE_URL}/rate-flashcard`, { 
        flashcard_id: flashcardId, 
        difficulty 
    });
};

export const getFlashcards = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/get-flashcards`); // Ensure backend route exists
        return response.data; // Assuming the backend returns an array of flashcards
    } catch (error) {
        console.error("Error fetching flashcards:", error);
        return []; // Return empty array to prevent crashes
    }
};
