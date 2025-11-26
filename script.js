// Element references
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const previewSection = document.getElementById('previewSection');
const previewContent = document.getElementById('previewContent');
const actionSection = document.getElementById('actionSection');
const convertBtn = document.getElementById('convertBtn');
const resetBtn = document.getElementById('resetBtn');
const loading = document.getElementById('loading');
const successMessage = document.getElementById('successMessage');

let currentFile = null;
let markdownContent = '';

// Event Listeners
browseBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);
uploadArea.addEventListener('click', (e) => {
    if (e.target !== browseBtn) {
        fileInput.click();
    }
});

// Drag and Drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

// Convert button
convertBtn.addEventListener('click', convertToWord);

// Reset button
resetBtn.addEventListener('click', resetAll);

// Handle file selection
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

// Handle file
function handleFile(file) {
    // Check if file is markdown
    const validExtensions = ['.md', '.markdown', '.txt'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
        alert('Please upload a valid Markdown file (.md, .markdown, or .txt)');
        return;
    }

    currentFile = file;
    
    // Display file info
    fileName.textContent = file.name;
    const sizeInKB = (file.size / 1024).toFixed(2);
    fileSize.textContent = `Size: ${sizeInKB} KB`;
    fileInfo.style.display = 'block';
    
    // Read and preview file
    const reader = new FileReader();
    reader.onload = (e) => {
        markdownContent = e.target.result;
        displayPreview(markdownContent);
        actionSection.style.display = 'block';
        uploadArea.style.display = 'none';
    };
    reader.readAsText(file);
}

// Display markdown preview
function displayPreview(markdown) {
    const html = marked.parse(markdown);
    previewContent.innerHTML = html;
    
    // Apply syntax highlighting to code blocks
    previewContent.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
    
    previewSection.style.display = 'block';
}

// Convert to Word
async function convertToWord() {
    loading.style.display = 'block';
    actionSection.style.display = 'none';
    successMessage.style.display = 'none';

    try {
        // Parse markdown to HTML
        const html = marked.parse(markdownContent);
        
        // Create a complete HTML document for Word conversion
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Calibri', 'Arial', sans-serif;
            line-height: 1.6;
            color: #000000;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
        }
        h1 {
            font-size: 28px;
            font-weight: bold;
            margin-top: 24px;
            margin-bottom: 12px;
            border-bottom: 2px solid #000000;
            padding-bottom: 8px;
        }
        h2 {
            font-size: 24px;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        h3 {
            font-size: 20px;
            font-weight: bold;
            margin-top: 16px;
            margin-bottom: 8px;
        }
        h4, h5, h6 {
            font-size: 16px;
            font-weight: bold;
            margin-top: 12px;
            margin-bottom: 6px;
        }
        p {
            margin-bottom: 12px;
            text-align: justify;
        }
        strong, b {
            font-weight: bold;
        }
        em, i {
            font-style: italic;
        }
        code {
            background-color: #f5f5f5;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            color: #c7254e;
        }
        pre {
            background-color: #f5f5f5;
            border: 1px solid #cccccc;
            border-radius: 4px;
            padding: 16px;
            overflow-x: auto;
            margin: 16px 0;
        }
        pre code {
            background-color: transparent;
            padding: 0;
            color: #000000;
            font-size: 13px;
            line-height: 1.5;
        }
        ul, ol {
            margin-left: 30px;
            margin-bottom: 12px;
        }
        li {
            margin-bottom: 6px;
        }
        blockquote {
            border-left: 4px solid #cccccc;
            padding-left: 16px;
            margin-left: 0;
            margin-right: 0;
            font-style: italic;
            color: #666666;
        }
        a {
            color: #0066cc;
            text-decoration: underline;
        }
        hr {
            border: none;
            border-top: 1px solid #cccccc;
            margin: 20px 0;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 16px 0;
        }
        th, td {
            border: 1px solid #cccccc;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
    </style>
</head>
<body>
${html}
</body>
</html>`;

        // Convert HTML to Word document
        const converted = htmlDocx.asBlob(htmlContent);
        
        // Save the document
        const originalName = currentFile.name.replace(/\.[^/.]+$/, '');
        saveAs(converted, `${originalName}.docx`);
        
        loading.style.display = 'none';
        successMessage.style.display = 'block';
        
        setTimeout(() => {
            successMessage.style.display = 'none';
            actionSection.style.display = 'block';
        }, 3000);
        
    } catch (error) {
        console.error('Conversion error:', error);
        loading.style.display = 'none';
        alert('An error occurred during conversion. Please try again.');
        actionSection.style.display = 'block';
    }
}

// Reset all
function resetAll() {
    currentFile = null;
    markdownContent = '';
    fileInput.value = '';
    fileInfo.style.display = 'none';
    previewSection.style.display = 'none';
    actionSection.style.display = 'none';
    uploadArea.style.display = 'block';
    successMessage.style.display = 'none';
}
