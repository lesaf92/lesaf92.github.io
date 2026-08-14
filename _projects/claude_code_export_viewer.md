---
layout: page-with-script
title: Claude Code Export Viewer
description: A tool to easily inspect session exports from cloud code.
img: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIeNTucM3P0SQ0QZrWew3doyjegcCBk1jsmk9gJxsC6ZGoJwuRvweJuqE&s=10
importance: 1
category: tools
related_publications: false
giscus_comments: true
_scripts: assets/js/book_extractor.js
_styles: >
    :root {
            --bg-color: #12161f;
            --bg-card: rgba(30, 34, 45, 0.6);
            --border-color: rgba(255, 255, 255, 0.1);
            --text-main: #e5e7eb;
            --text-muted: #9ca3af;
            --accent-blue: #4facfe;
            --accent-green: #10b981;
            --accent-red: #f43f5e;
            --accent-purple: #a855f7;
        }

        body {
            margin: 0;
            padding: 20px;
            background-color: var(--bg-color);
            color: var(--text-main);
            font-family: 'Inter', system-ui, sans-serif;
        }

        /* Glassmorphism Upload Box */
        .upload-container {
            max-width: 800px;
            margin: 0 auto 20px auto;
            padding: 30px;
            background: var(--bg-card);
            backdrop-filter: blur(12px);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            text-align: center;
            transition: border-color 0.3s;
        }

        .upload-container.dragover {
            border-color: var(--accent-blue);
            background: rgba(79, 172, 254, 0.1);
        }

        input[type="file"] {
            display: none;
        }

        .custom-file-upload {
            display: inline-block;
            padding: 10px 20px;
            cursor: pointer;
            background: rgba(79, 172, 254, 0.15);
            color: var(--accent-blue);
            border: 1px solid rgba(79, 172, 254, 0.3);
            border-radius: 8px;
            font-family: 'JetBrains Mono', monospace;
            font-weight: 600;
            transition: background 0.2s;
        }

        .custom-file-upload:hover {
            background: rgba(79, 172, 254, 0.25);
        }

        /* Terminal Output Styles */
        #output-container {
            max-width: 1400px;
            margin: 0 auto;
            background: #0d0d0d;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 20px;
            overflow-x: hidden; /* Prevent horizontal scroll, let text wrap */
            display: none;
        }

        .line {
            font-family: 'JetBrains Mono', Consolas, monospace;
            font-size: 13.5px;
            line-height: 1.5;
            white-space: pre-wrap; /* Allows stitched lines to wrap naturally to page width */
            word-break: break-word;
            padding: 0 10px;
            border-radius: 3px;
        }

        /* Syntax Highlighting */
        .prompt { color: var(--accent-blue); font-weight: bold; margin-top: 10px; }
        .system { color: var(--text-muted); }
        .tree-line { color: var(--text-muted); }
        .meta { color: var(--accent-purple); }
        
        .diff-del { 
            background-color: rgba(244, 63, 94, 0.15); 
        }
        .diff-add { 
            background-color: rgba(16, 185, 129, 0.15); 
        }
        .del-prefix { color: var(--accent-red); font-weight: bold; }
        .add-prefix { color: var(--accent-green); font-weight: bold; }
        .line-num { color: #555; }
---
{% include figure.liquid loading="eager" path="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIeNTucM3P0SQ0QZrWew3doyjegcCBk1jsmk9gJxsC6ZGoJwuRvweJuqE&s=10" title="claudecode" class="img-fluid rounded z-depth-1" zoomable=true %}

<div class="upload-container" id="drop-zone">
    <p style="color: var(--text-muted); margin-top: 0;">Drag and drop your exported .txt session here</p>
    <label for="fileInput" class="custom-file-upload">
        📂 Choose File
    </label>
    <input type="file" id="fileInput" accept=".txt,.md">
</div>

<div id="output-container"></div>
