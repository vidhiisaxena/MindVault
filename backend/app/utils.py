# utils.py
from youtube_transcript_api import YouTubeTranscriptApi
import re
import google.generativeai as genai

# For PDF extraction
def extract_text_from_pdf(pdf_path):
    import fitz  # PyMuPDF
    text = ""
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            text += page.get_text()
        doc.close()
    except Exception as e:
        print(f"❌ Failed to extract text from PDF: {e}")
    return text

# For YouTube video to text
def extract_video_id(video_url):
    """Extracts the video ID from a YouTube URL."""
    match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11})", video_url)
    return match.group(1) if match else None

def generate_notes_from_youtube(video_url):
    """Extracts the transcript and summarizes it using Gemini API."""
    video_id = extract_video_id(video_url)
    if not video_id:
        raise ValueError("Invalid YouTube URL.")
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        transcript_text = " ".join([entry["text"] for entry in transcript])
    except Exception as e:
        raise Exception(f"Error fetching transcript: {str(e)}")
    return transcript_text
