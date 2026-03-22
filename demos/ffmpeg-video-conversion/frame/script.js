const $ = (id) => document.getElementById(id);

const codecDefaults = {
  mp4:  { v: "libx264", a: "aac" },
  webm: { v: "libvpx-vp9", a: "libopus" },
  mkv:  { v: "libx264", a: "aac" },
  avi:  { v: "libx264", a: "mp3" },
  gif:  { v: null, a: null },
  mp3:  { v: null, a: "libmp3lame" },
};

function buildCommand() {
  const inputFmt  = $("inputFormat").value;
  const outputFmt = $("outputFormat").value;
  const vCodec    = $("videoCodec").value;
  const aCodec    = $("audioCodec").value;
  const crf       = $("quality").value;
  const preset    = $("preset").value;
  const res       = $("resolution").value;
  const fps       = $("framerate").value;

  let parts = ["ffmpeg", `-i input.${inputFmt}`];

  // Video codec
  if (outputFmt === "mp3") {
    parts.push("-vn");
  } else if (outputFmt === "gif") {
    parts.push(`-vf "fps=${fps || 15},scale=${res ? res.split("x")[0] : 480}:-1"`);
  } else if (vCodec && vCodec !== "auto") {
    parts.push(`-c:v ${vCodec}`);
  } else {
    const def = codecDefaults[outputFmt];
    if (def && def.v) parts.push(`-c:v ${def.v}`);
  }

  // Audio codec
  if (outputFmt !== "gif") {
    if (aCodec === "none") {
      parts.push("-an");
    } else if (aCodec && aCodec !== "auto") {
      parts.push(`-c:a ${aCodec}`);
    } else if (outputFmt !== "mp3") {
      const def = codecDefaults[outputFmt];
      if (def && def.a) parts.push(`-c:a ${def.a}`);
    } else {
      parts.push("-c:a libmp3lame -b:a 192k");
    }
  }

  // Quality (CRF) — not for copy, gif, or mp3
  if (crf && vCodec !== "copy" && outputFmt !== "gif" && outputFmt !== "mp3") {
    parts.push(`-crf ${crf}`);
  }

  // Preset — only for x264/x265
  if (preset && (vCodec === "libx264" || vCodec === "libx265" ||
    (vCodec === "auto" && (outputFmt === "mp4" || outputFmt === "mkv" || outputFmt === "avi")))) {
    parts.push(`-preset ${preset}`);
  }

  // Resolution (skip for gif — handled in -vf)
  if (res && outputFmt !== "gif") {
    parts.push(`-s ${res}`);
  }

  // Framerate (skip for gif — handled in -vf)
  if (fps && outputFmt !== "gif") {
    parts.push(`-r ${fps}`);
  }

  parts.push(`output.${outputFmt}`);
  return parts.join(" ");
}

function updateCommand() {
  $("command").textContent = buildCommand();
  $("output").innerHTML = "";
}

function simulateRun() {
  const btn = $("runBtn");
  const out = $("output");
  btn.disabled = true;
  btn.textContent = "⏳ Running...";
  out.innerHTML = "";

  const outputFmt = $("outputFormat").value;
  const vCodec = $("videoCodec").value;
  const res = $("resolution").value || "1920x1080";
  const fps = $("framerate").value || "30";
  const autoCodec = vCodec === "auto"
    ? (codecDefaults[outputFmt]?.v || "libx264")
    : vCodec;

  const fileSize = outputFmt === "gif" ? "2.4" :
                   outputFmt === "mp3" ? "4.8" :
                   vCodec === "copy" ? "48.2" : "12.6";

  const duration = "00:02:34.56";
  const lines = [
    { text: `ffmpeg version 7.1 Copyright (c) 2000-2025 the FFmpeg developers`, cls: "info" },
    { text: `  built with gcc 14.2.0`, cls: "" },
    { text: `Input #0, ${$("inputFormat").value}, from 'input.${$("inputFormat").value}':`, cls: "" },
    { text: `  Duration: ${duration}, bitrate: 3200 kb/s`, cls: "" },
    { text: `  Stream #0:0: Video: h264, yuv420p, 1920x1080, ${fps} fps`, cls: "" },
    { text: `  Stream #0:1: Audio: aac, 48000 Hz, stereo, 128 kb/s`, cls: "" },
    { text: `Stream mapping:`, cls: "info" },
    { text: `  Stream #0:0 -> #0:0 (h264 -> ${outputFmt === "gif" ? "gif" : autoCodec})`, cls: "" },
    { text: `Press [q] to stop, [?] for help`, cls: "warn" },
  ];

  // Progress frames
  const frames = [
    `frame=  120 fps= 45 time=00:00:04.00 speed=1.5x`,
    `frame=  480 fps= 52 time=00:00:16.00 speed=1.7x`,
    `frame= 1200 fps= 58 time=00:00:40.00 speed=1.9x`,
    `frame= 2400 fps= 61 time=00:01:20.00 speed=2.0x`,
    `frame= 3600 fps= 63 time=00:02:00.00 speed=2.1x`,
    `frame= 4600 fps= 64 time=00:02:34.56 speed=2.1x`,
  ];

  const endLines = [
    { text: `\nvideo:${(fileSize * 0.9).toFixed(1)}kB audio:${(fileSize * 0.1).toFixed(1)}kB global headers:0kB muxing overhead: 0.8%`, cls: "" },
    { text: `✓ output.${outputFmt} created (${fileSize} MB)`, cls: "success" },
  ];

  let i = 0;
  const allLines = [...lines, ...frames.map(f => ({ text: f, cls: "" })), ...endLines];

  function printNext() {
    if (i >= allLines.length) {
      btn.disabled = false;
      btn.textContent = "▶ Run";
      return;
    }
    const line = allLines[i];
    const span = document.createElement("div");
    span.className = line.cls || "";
    span.textContent = line.text;
    out.appendChild(span);
    out.scrollTop = out.scrollHeight;
    i++;
    setTimeout(printNext, i <= lines.length ? 60 : 120);
  }

  setTimeout(printNext, 300);
}

// Copy to clipboard
function copyCommand() {
  navigator.clipboard.writeText(buildCommand()).then(() => {
    const btn = $("copyBtn");
    btn.textContent = "✅";
    setTimeout(() => (btn.textContent = "📋"), 1500);
  });
}

// Wire up events
document.querySelectorAll("select").forEach((sel) =>
  sel.addEventListener("change", updateCommand)
);
$("runBtn").addEventListener("click", simulateRun);
$("copyBtn").addEventListener("click", copyCommand);

// Initial render
updateCommand();
