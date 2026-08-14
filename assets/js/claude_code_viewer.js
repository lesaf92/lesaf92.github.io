const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('fileInput');
const outputContainer = document.getElementById('output-container');

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
        readFile(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        readFile(e.target.files[0]);
    }
});

function readFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const stitchedLines = unwrapLines(e.target.result);
        renderLog(stitchedLines);
    };
    reader.readAsText(file);
}

// Reconstructs terminal hard-wraps into continuous lines
function unwrapLines(text) {
    const rawLines = text.split('\n');
    const lines = [];
    let i = 0;

    const isTreeLine = (l) => l.match(/^\s*[⎿├│]/);

    while (i < rawLines.length) {
        let line = rawLines[i].trimEnd();
        
        // 1. Diff Added/Deleted Lines
        const diffMatch = line.match(/^(\s*\d+\s+)([-+])(.*)/);
        if (diffMatch) {
            let type = diffMatch[2];
            let current = line;
            i++;
            while (i < rawLines.length) {
                let nextLine = rawLines[i].trimEnd();
                // Claude pads wrapped diff lines with spaces followed by the exact same sign
                let contRegex = type === '+' ? /^(\s+)\+(.*)/ : /^(\s+)\-(.*)/;
                let match = nextLine.match(contRegex);
                if (match) {
                    current += match[2];
                    i++;
                } else {
                    break;
                }
            }
            lines.push(current);
            continue;
        }

        // 2. Diff Context Lines (numbers but no + or - sign)
        const ctxMatch = line.match(/^(\s*\d+\s{2,})(.*)/);
        if (ctxMatch) {
            let current = line;
            i++;
            while (i < rawLines.length) {
                let nextLine = rawLines[i].trimEnd();
                // Context continuations are deeply indented and lack leading digits
                if (nextLine.match(/^\s{8,}(?!\d)[^\s]/) && !isTreeLine(nextLine)) {
                    current += nextLine.replace(/^\s+/, '');
                    i++;
                } else {
                    break;
                }
            }
            lines.push(current);
            continue;
        }

        // 3. User Prompts (❯ ...)
        if (line.match(/^❯ /)) {
            let current = line;
            i++;
            while (i < rawLines.length) {
                let nextLine = rawLines[i].trimEnd();
                if (nextLine.match(/^  [^\s]/) && !isTreeLine(nextLine)) {
                    current += " " + nextLine.trimStart();
                    i++;
                } else {
                    break;
                }
            }
            lines.push(current);
            continue;
        }

        // 4. System Messages (● ...)
        if (line.match(/^● /)) {
            let current = line;
            i++;
            while (i < rawLines.length) {
                let nextLine = rawLines[i].trimEnd();
                if (nextLine.match(/^  [^\s]/) && !isTreeLine(nextLine)) {
                    current += " " + nextLine.trimStart();
                    i++;
                } else {
                    break;
                }
            }
            lines.push(current);
            continue;
        }

        // 5. Generic indented text paragraphs (e.g., inside system blocks)
        if (line.match(/^  [^\s]/) && !line.match(/^  \d/) && !isTreeLine(line)) {
            let current = line;
            i++;
            while (i < rawLines.length) {
                let nextLine = rawLines[i].trimEnd();
                if (nextLine.match(/^  [^\s]/) && !nextLine.match(/^  \d/) && !isTreeLine(nextLine)) {
                    current += " " + nextLine.trimStart();
                    i++;
                } else {
                    break;
                }
            }
            lines.push(current);
            continue;
        }

        // Default pass-through
        lines.push(line);
        i++;
    }
    return lines;
}

function renderLog(lines) {
    let html = '';

    for (let line of lines) {
        // Escape HTML tags to prevent code rendering as elements
        let safeLine = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        let className = 'line';

        // Parsing Logic
        if (safeLine.trim().startsWith('❯')) {
            className += ' prompt';
        } 
        else if (safeLine.match(/^(\s*\d+\s+-)/)) {
            className += ' diff-del';
            safeLine = safeLine.replace(/^(\s*\d+\s+-)/, '<span class="del-prefix">$1</span>');
        } 
        else if (safeLine.match(/^(\s*\d+\s+\+)/)) {
            className += ' diff-add';
            safeLine = safeLine.replace(/^(\s*\d+\s+\+)/, '<span class="add-prefix">$1</span>');
        } 
        else if (safeLine.match(/^(\s*\d+\s\s)/)) {
            safeLine = safeLine.replace(/^(\s*\d+\s\s)/, '<span class="line-num">$1</span>');
        }
        else if (safeLine.trim().startsWith('●')) {
            className += ' system';
        }
        else if (safeLine.trim().startsWith('⎿') || safeLine.trim().startsWith('├') || safeLine.trim().startsWith('│')) {
            className += ' tree-line';
        }
        else if (safeLine.trim().startsWith('✻') || safeLine.trim().startsWith('※')) {
            className += ' meta';
        }

        // Ensure empty lines keep their vertical space
        if (safeLine === '') safeLine = ' ';
        
        html += `<div class="${className}">${safeLine}</div>`;
    }

    outputContainer.innerHTML = html;
    outputContainer.style.display = 'block';
}