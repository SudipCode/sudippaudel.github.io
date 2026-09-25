# TruDrop

A small Node.js YouTube downloader with MP4 download and MP3 conversion modes.

## Requirements

- Node.js 18 or newer
- Python 3.10 or newer
- A YouTube URL for a video you own or have permission to save

## Run locally

```bash
npm install
python -m pip install yt-dlp
npm start
```

Open <http://localhost:3000> in a browser.

The app uses Express and a Python `yt-dlp` worker. Node supplies the HTTP API while Python handles YouTube extraction. The FFmpeg binary supplied by `ffmpeg-static` is used for MP3 conversion at 192 kbps.

Only download content when you have the right to do so and follow YouTube's terms and applicable law. Live streams are not supported.
