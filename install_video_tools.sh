#!/bin/bash

echo "Installing video analysis tools in project folder..."

# Create tools directory
mkdir -p tools

# Install tesseract for OCR
echo "Installing tesseract OCR..."
sudo apt update
sudo apt install -y tesseract-ocr tesseract-ocr-eng

# Install ffmpeg if not present
echo "Checking ffmpeg..."
if ! command -v ffmpeg &> /dev/null; then
    echo "Installing ffmpeg..."
    sudo apt install -y ffmpeg
fi

# Install Python speech recognition
echo "Installing Python speech recognition..."
pip3 install --user SpeechRecognition pydub

# Install ollama (optional local AI)
echo "Installing Ollama (local AI)..."
curl -fsSL https://ollama.ai/install.sh | sh

# Pull llama2 model
echo "Downloading llama2 model..."
ollama pull llama2

echo "Installation complete!"
echo "Video analysis tools are now ready."