import argparse
import glob
import json
import os
import shutil
import sys
import tempfile
from pathlib import Path

import yt_dlp


def get_info(url):
    options = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
        "noplaylist": True,
    }
    with yt_dlp.YoutubeDL(options) as ydl:
        info = ydl.extract_info(url, download=False)
    thumbnails = info.get("thumbnails") or []
    thumbnail = thumbnails[-1].get("url") if thumbnails else info.get("thumbnail")
    return {
        "id": info.get("id"),
        "title": info.get("title") or "download",
        "author": info.get("uploader") or "YouTube creator",
        "duration": info.get("duration") or 0,
        "thumbnail": thumbnail,
        "isLive": bool(info.get("is_live")),
    }


def download(url, media_type, ffmpeg_path):
    with tempfile.TemporaryDirectory(prefix="trudrop-") as temp_dir:
        output_template = os.path.join(temp_dir, "media.%(ext)s")
        options = {
            "quiet": True,
            "no_warnings": True,
            "noplaylist": True,
            "outtmpl": output_template,
            "ffmpeg_location": ffmpeg_path,
        }
        if media_type == "mp3":
            options.update({
                "format": "bestaudio/best",
                "postprocessors": [{
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": "192",
                }],
            })
        else:
            options["format"] = "best[ext=mp4]/best"

        with yt_dlp.YoutubeDL(options) as ydl:
            ydl.download([url])

        files = [item for item in glob.glob(os.path.join(temp_dir, "media.*")) if not item.endswith(".part")]
        if not files:
            raise RuntimeError("The downloader did not produce an output file.")
        with open(files[0], "rb") as source:
            shutil.copyfileobj(source, sys.stdout.buffer)


parser = argparse.ArgumentParser()
parser.add_argument("command", choices=["info", "download"])
parser.add_argument("url")
parser.add_argument("--type", choices=["mp3", "mp4"], default="mp4")
parser.add_argument("--ffmpeg-path", default="")
args = parser.parse_args()

try:
    if args.command == "info":
        print(json.dumps(get_info(args.url)))
    else:
        download(args.url, args.type, args.ffmpeg_path)
except Exception as error:
    print(str(error), file=sys.stderr)
    sys.exit(1)
