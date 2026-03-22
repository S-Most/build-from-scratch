# Converting Video with FFmpeg

FFmpeg is the Swiss Army knife of multimedia. It is a free, open-source command-line tool that can decode, encode, transcode, mux, demux, stream, filter, and play almost any media format. If you have ever needed to convert a video, compress a clip, or extract audio from a file, FFmpeg is the tool for the job.

## Understanding Video Formats

Before diving into commands, it helps to know the common players:

- **MP4** — The universal format. Works everywhere: browsers, phones, TVs. Uses the H.264 or H.265 codec.
- **WebM** — Google's open format, optimized for the web. Uses VP8, VP9, or AV1. Smaller files at similar quality.
- **AVI** — A legacy container from the '90s. Large files, wide compatibility with older software.
- **MKV** — The power-user's format. Supports virtually every codec, multiple audio tracks, and subtitles. Not great for web playback.
- **MOV** — Apple's format. High quality, often used in video editing workflows.
- **GIF** — Not a true video format, but FFmpeg can generate them from video clips.

## The Core Command

Every FFmpeg conversion follows a beautifully simple pattern:

`ffmpeg -i input.mp4 output.webm`

That is it. FFmpeg detects the input format, picks a sensible codec for the output container, and transcodes. But the real power comes from the flags.

## Essential Flags

- **`-c:v <codec>`** — Video codec. Common values: `libx264`, `libx265`, `libvpx-vp9`, `libaom-av1`.
- **`-c:a <codec>`** — Audio codec. Common values: `aac`, `libopus`, `libvorbis`, `mp3`.
- **`-crf <0-51>`** — Constant Rate Factor (quality). Lower is better. `18` is visually lossless, `23` is default, `28+` gets noticeably compressed.
- **`-preset <speed>`** — Encoding speed/compression tradeoff. Options from fast (big file) to slow (small file): `ultrafast`, `superfast`, `veryfast`, `faster`, `fast`, `medium`, `slow`, `slower`, `veryslow`.
- **`-b:v <rate>`** — Target video bitrate, e.g. `2M` for 2 Mbps.
- **`-r <fps>`** — Output framerate, e.g. `30` or `24`.
- **`-s <WxH>`** — Output resolution, e.g. `1920x1080` or `1280x720`.
- **`-an`** — Strip all audio.
- **`-vn`** — Strip all video (extract audio only).
- **`-ss <time>`** — Start time for trimming, e.g. `00:01:30`.
- **`-t <duration>`** — Duration of the clip, e.g. `00:00:10`.

## Real-World Recipes

Here are some copy-paste-ready commands for everyday tasks:

**Compress an MP4 for the web (H.264, good quality, small file):**
`ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4`

**Convert MP4 to WebM (VP9 for modern browsers):**
`ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus output.webm`

**Extract audio as MP3:**
`ffmpeg -i input.mp4 -vn -c:a libmp3lame -b:a 192k output.mp3`

**Convert a clip to GIF (10 seconds starting at 1:30):**
`ffmpeg -i input.mp4 -ss 00:01:30 -t 10 -vf "fps=15,scale=480:-1" output.gif`

**Trim a video without re-encoding (instant, lossless):**
`ffmpeg -i input.mp4 -ss 00:00:30 -t 00:01:00 -c copy trimmed.mp4`

**Change resolution to 720p:**
`ffmpeg -i input.mp4 -s 1280x720 -c:a copy output_720p.mp4`

**Batch convert all AVI files to MP4 (PowerShell):**
`Get-ChildItem *.avi | ForEach-Object { ffmpeg -i $_.Name "$($_.BaseName).mp4" }`

## The Codec vs. Container Mental Model

A common source of confusion: the **container** (`.mp4`, `.mkv`, `.webm`) is just a wrapper. The **codec** (H.264, VP9, AAC) is the actual compression algorithm inside. Think of the container as a shipping box and the codec as the item packed inside. Not every item fits in every box — for example, VP9 video works in `.webm` and `.mkv` but not in `.avi`.

### Interactive Command Builder
Try the interactive demo below. Pick your input format, output format, codec, and quality settings, and see the FFmpeg command generated in real time. Hit **Run** to see simulated terminal output!

[code files="index.html,style.css,script.js" path="/demos/ffmpeg-video-conversion/"]
