# LLaMA Setup for Video Analysis

## Option 1: Local Ollama (Recommended)

1. **Install Ollama**:
   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Start Ollama**:
   ```bash
   ollama serve
   ```

3. **Pull LLaMA model**:
   ```bash
   ollama pull llama2
   ```

4. **Test API**:
   ```bash
   curl http://localhost:11434/api/generate -d '{
     "model": "llama2",
     "prompt": "Hello",
     "stream": false
   }'
   ```

## Option 2: Hugging Face LLaMA

1. Get free API token from [Hugging Face](https://huggingface.co/settings/tokens)
2. Update `.env`:
   ```
   LLAMA_API_URL=https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf
   HUGGINGFACE_API_KEY=your_token_here
   ```

## Option 3: Use Existing Gemini

The system will automatically fallback to Gemini if LLaMA is not available.

## Current Configuration

The system tries APIs in this order:
1. **LLaMA** (local Ollama or Hugging Face)
2. **Gemini** (fallback)
3. **Basic analysis** (final fallback)

## Usage

Just upload your video - the system will automatically use the best available AI model!