# Free AI API Setup for Video Analysis

## Option 1: Google Gemini API (FREE)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the API key
5. Add to `.env` file: `GEMINI_API_KEY=your_api_key_here`

**Free Limits**: 60 requests per minute, 1000 requests per day

## Option 2: Hugging Face API (FREE)

1. Go to [Hugging Face](https://huggingface.co/join)
2. Create free account
3. Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
4. Create new token with "Read" permission
5. Add to `.env` file: `HUGGINGFACE_API_KEY=your_token_here`

**Free Limits**: 1000 requests per month

## Option 3: No API Key (Basic Analysis)

If no API key is configured, the system will use:
- FFmpeg for frame extraction
- ImageMagick for basic image analysis
- Technical metrics (resolution, colors)

## Recommended Setup

1. **Start with Gemini** - Higher daily limits
2. **Fallback to Hugging Face** - Good for image captioning
3. **Basic analysis** - Always works without API keys

## Usage Priority

The system tries APIs in this order:
1. Gemini API (if configured)
2. Hugging Face API (if configured)  
3. Basic frame analysis (always available)