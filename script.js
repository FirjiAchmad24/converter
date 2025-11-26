// Import configuration
import CONFIG from './config.js';

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
const uploadTitle = document.getElementById('uploadTitle');
const mdModeBtn = document.getElementById('mdModeBtn');
const pdfModeBtn = document.getElementById('pdfModeBtn');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');
const loadingText = document.getElementById('loadingText');
const loadingTip = document.getElementById('loadingTip');
const themeToggle = document.getElementById('themeToggle');

let currentFile = null;
let markdownContent = '';
let currentMode = 'md';

// Theme Toggle
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.checked = true;
}

// Load configuration
const CONVERTAPI_SECRET = CONFIG?.convertAPI?.secret || '5x4j8g7KaYLKjj5LbzpqIa2oe48ipgjk';
const USE_API_CONVERSION = CONFIG?.convertAPI?.enabled || true;

// Event Listeners
browseBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);
uploadArea.addEventListener('click', (e) => {
    if (e.target !== browseBtn) {
        fileInput.click();
    }
});

// Mode selection
mdModeBtn.addEventListener('click', () => switchMode('md'));
pdfModeBtn.addEventListener('click', () => switchMode('pdf'));

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

// Switch between MD and PDF mode
function switchMode(mode) {
    currentMode = mode;
    
    // Update button states
    if (mode === 'md') {
        mdModeBtn.classList.add('active');
        pdfModeBtn.classList.remove('active');
        fileInput.setAttribute('accept', '.md,.markdown,.txt');
        uploadTitle.textContent = 'Drop your Markdown file here';
        ocrOption.style.display = 'none';
        ocrToggle.checked = false;
    } else {
        pdfModeBtn.classList.add('active');
        mdModeBtn.classList.remove('active');
        fileInput.setAttribute('accept', '.pdf');
        uploadTitle.textContent = 'Drop your PDF file here';
        ocrOption.style.display = 'block';
    }
    
    // Reset if file was already uploaded
    if (currentFile) {
        resetAll();
    }
}

// Handle file selection
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

// Handle file
function handleFile(file) {
    if (currentMode === 'md') {
        handleMarkdownFile(file);
    } else {
        handlePDFFile(file);
    }
}

// Handle Markdown file
function handleMarkdownFile(file) {
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
        displayMarkdownPreview(markdownContent);
        actionSection.style.display = 'block';
        uploadArea.style.display = 'none';
    };
    reader.readAsText(file);
}

// Handle PDF file
function handlePDFFile(file) {
    // Check if file is PDF
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (fileExtension !== '.pdf') {
        alert('Please upload a valid PDF file');
        return;
    }

    currentFile = file;
    
    // Display file info
    fileName.textContent = file.name;
    const sizeInKB = (file.size / 1024).toFixed(2);
    fileSize.textContent = `Size: ${sizeInKB} KB`;
    fileInfo.style.display = 'block';
    
    // Read and preview PDF
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            await displayPDFPreview(e.target.result);
            actionSection.style.display = 'block';
            uploadArea.style.display = 'none';
        } catch (error) {
            console.error('PDF preview error:', error);
            alert('Error loading PDF preview');
        }
    };
    reader.readAsArrayBuffer(file);
}

// Display markdown preview
function displayMarkdownPreview(markdown) {
    const html = marked.parse(markdown);
    previewContent.innerHTML = html;
    
    // Apply syntax highlighting to code blocks
    previewContent.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
    
    previewSection.style.display = 'block';
}

// Display PDF preview
async function displayPDFPreview(arrayBuffer) {
    try {
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        
        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;
        
        previewContent.innerHTML = `
            <div style="text-align: center;">
                <p style="margin-bottom: 15px; color: #6b7280;">Preview (Page 1 of ${pdf.numPages})</p>
                <img src="${canvas.toDataURL()}" style="max-width: 100%; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
                ${pdf.numPages > 1 ? `<p style="margin-top: 15px; color: #6b7280; font-style: italic;">+ ${pdf.numPages - 1} more pages</p>` : ''}
            </div>
        `;
        
        previewSection.style.display = 'block';
    } catch (error) {
        console.error('PDF preview error:', error);
        throw error;
    }
}

// Convert to Word
async function convertToWord() {
    loading.style.display = 'block';
    actionSection.style.display = 'none';
    successMessage.style.display = 'none';
    
    // Reset progress
    updateProgress(0, 'Initializing conversion...');

    try {
        // Simulate progress for better UX
        updateProgress(10, 'Preparing file...');
        
        if (currentMode === 'md') {
            await convertMarkdownToWord();
        } else {
            await convertPDFToWord();
        }
        
        updateProgress(100, 'Conversion complete!');
        
        // Small delay to show 100%
        await new Promise(resolve => setTimeout(resolve, 500));
        
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

// Update progress bar with requestAnimationFrame for smoother updates
function updateProgress(percent, text = null, tip = null) {
    requestAnimationFrame(() => {
        progressFill.style.width = percent + '%';
        progressPercent.textContent = percent + '%';
        
        if (text) {
            loadingText.textContent = text;
        }
        
        if (tip) {
            loadingTip.textContent = tip;
        }
    });
}

// Convert Markdown to Word
async function convertMarkdownToWord() {
    updateProgress(20, 'Parsing markdown...');
    
    // Parse markdown to HTML
    const html = marked.parse(markdownContent);
    
    updateProgress(50, 'Generating Word document...');
    
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

    updateProgress(70, 'Converting to DOCX format...');

    // Convert HTML to Word document
    const converted = htmlDocx.asBlob(htmlContent);
    
    updateProgress(90, 'Preparing download...');
    
    // Save the document
    const originalName = currentFile.name.replace(/\.[^/.]+$/, '');
    saveAs(converted, `${originalName}.docx`);
}

// Convert PDF to Word
async function convertPDFToWord() {
    // Check if API conversion is enabled and API key is set
    if (USE_API_CONVERSION && CONVERTAPI_SECRET !== 'your_api_key_here') {
        await convertPDFToWordWithAPI();
    } else {
        await convertPDFToWordClientSide();
    }
}

// Convert PDF to Word using ConvertAPI (Premium Quality)
async function convertPDFToWordWithAPI() {
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
            try {
                // Update loading message
                updateProgress(15, 'Uploading to Premium API...', 'Using high-quality conversion service');
                
                // Prepare form data for upload
                const formData = new FormData();
                formData.append('File', currentFile);
                formData.append('StoreFile', 'true');
                
                // Add OCR parameter if enabled
                if (ocrToggle.checked) {
                    formData.append('OCR', 'true');
                    updateProgress(20, 'OCR enabled - Processing scanned document...', 'Extracting text from images');
                } else {
                    updateProgress(30, 'Processing PDF...', 'Extracting content and formatting');
                }
                
                // Call ConvertAPI with correct endpoint format
                const apiUrl = `https://v2.convertapi.com/convert/pdf/to/docx?Secret=${CONVERTAPI_SECRET}`;
                
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    body: formData
                });
                
                updateProgress(60, 'Converting to Word format...', 'Preserving layout and images');
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('API Error Response:', errorText);
                    throw new Error(`API returned ${response.status}: ${errorText}`);
                }
                
                const result = await response.json();
                
                updateProgress(80, 'Finalizing document...');
                
                // Download the converted file
                if (result.Files && result.Files.length > 0) {
                    const fileUrl = result.Files[0].Url;
                    
                    updateProgress(90, 'Downloading converted file...');
                    
                    // Fetch the converted file
                    const fileResponse = await fetch(fileUrl);
                    const blob = await fileResponse.blob();
                    
                    updateProgress(95, 'Preparing download...');
                    
                    // Save the file
                    const originalName = currentFile.name.replace(/\.[^/.]+$/, '');
                    const suffix = ocrToggle.checked ? '_ocr' : '_premium';
                    saveAs(blob, `${originalName}${suffix}.docx`);
                    
                    resolve();
                } else {
                    throw new Error('No converted file received from API');
                }
                
            } catch (error) {
                console.error('API Conversion error:', error);
                
                // Show error message with option to try client-side
                const useClientSide = confirm(
                    'Premium API conversion failed. This might be due to:\n' +
                    '- Invalid or missing API key\n' +
                    '- API quota exceeded\n' +
                    '- Network issues\n\n' +
                    'Would you like to try basic client-side conversion instead?'
                );
                
                if (useClientSide) {
                    updateProgress(20, 'Switching to basic conversion...');
                    await convertPDFToWordClientSide();
                    resolve();
                } else {
                    reject(error);
                }
            }
        };
        
        reader.onerror = reject;
        reader.readAsArrayBuffer(currentFile);
    });
}

// Convert PDF to Word Client-Side (Basic Quality)
async function convertPDFToWordClientSide() {
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
            try {
                updateProgress(20, 'Loading PDF...', 'Reading file contents');
                
                const pdf = await pdfjsLib.getDocument({ data: e.target.result }).promise;
                let fullHTML = '';
                
                const totalPages = pdf.numPages;
                
                // Extract text from all pages with better formatting
                for (let i = 1; i <= totalPages; i++) {
                    const pageProgress = 20 + Math.floor((i / totalPages) * 50);
                    updateProgress(pageProgress, `Processing page ${i} of ${totalPages}...`);
                    
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const viewport = page.getViewport({ scale: 1.0 });
                    
                    // Group text items by vertical position (lines)
                    const lines = [];
                    let currentLine = { items: [], y: null };
                    
                    textContent.items.forEach(item => {
                        const y = Math.round(item.transform[5]);
                        
                        if (currentLine.y === null || Math.abs(y - currentLine.y) < 5) {
                            currentLine.items.push(item);
                            currentLine.y = y;
                        } else {
                            if (currentLine.items.length > 0) {
                                lines.push(currentLine);
                            }
                            currentLine = { items: [item], y: y };
                        }
                    });
                    
                    if (currentLine.items.length > 0) {
                        lines.push(currentLine);
                    }
                    
                    // Sort lines by Y position (top to bottom)
                    lines.sort((a, b) => b.y - a.y);
                    
                    // Add page break
                    if (i > 1) {
                        fullHTML += '<div style="page-break-before: always;"></div>';
                    }
                    
                    fullHTML += `<div class="pdf-page">`;
                    fullHTML += `<h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 8px; margin-top: 30px; margin-bottom: 15px;">Page ${i}</h2>`;
                    
                    // Process each line
                    lines.forEach(line => {
                        // Sort items in line by X position (left to right)
                        line.items.sort((a, b) => a.transform[4] - b.transform[4]);
                        
                        let lineText = '';
                        let maxFontSize = 0;
                        let isBold = false;
                        
                        line.items.forEach(item => {
                            const fontSize = item.transform[0];
                            maxFontSize = Math.max(maxFontSize, fontSize);
                            
                            // Detect bold (font name contains "Bold")
                            if (item.fontName && item.fontName.includes('Bold')) {
                                isBold = true;
                            }
                            
                            lineText += item.str;
                        });
                        
                        lineText = lineText.trim();
                        
                        if (lineText) {
                            // Detect headings based on font size
                            if (maxFontSize > 16) {
                                fullHTML += `<h3 style="font-size: ${Math.min(maxFontSize, 24)}px; font-weight: bold; margin-top: 20px; margin-bottom: 10px;">${lineText}</h3>`;
                            } else if (maxFontSize > 14 || isBold) {
                                fullHTML += `<h4 style="font-size: ${maxFontSize}px; font-weight: bold; margin-top: 15px; margin-bottom: 8px;">${lineText}</h4>`;
                            } else if (lineText.match(/^[\d\.\)\-\*]\s/)) {
                                // Detect bullet points or numbered lists
                                fullHTML += `<p style="margin-left: 20px; margin-bottom: 8px;">${lineText}</p>`;
                            } else {
                                fullHTML += `<p style="margin-bottom: 10px; text-align: justify; line-height: 1.6;">${lineText}</p>`;
                            }
                        }
                    });
                    
                    fullHTML += `</div>`;
                }
                
                updateProgress(75, 'Creating Word document...', 'Formatting content');
                
                // Create enhanced HTML document
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
            max-width: 850px;
            margin: 40px auto;
            padding: 30px;
        }
        .pdf-page {
            margin-bottom: 40px;
        }
        h2 {
            font-size: 20px;
            font-weight: bold;
            color: #4f46e5;
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 8px;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        h3 {
            font-size: 18px;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 10px;
            color: #1f2937;
        }
        h4 {
            font-size: 14px;
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 8px;
            color: #374151;
        }
        p {
            margin-bottom: 10px;
            text-align: justify;
            line-height: 1.6;
        }
        strong {
            font-weight: bold;
        }
        em {
            font-style: italic;
        }
    </style>
</head>
<body>
    <h1 style="text-align: center; color: #4f46e5; font-size: 28px; margin-bottom: 10px; border-bottom: 3px solid #4f46e5; padding-bottom: 15px;">Converted from PDF</h1>
    <p style="text-align: center; color: #6b7280; margin-bottom: 30px; font-style: italic;">High-Quality Conversion by Premium Converter</p>
    ${fullHTML}
    <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
        <p>Converted with Premium File Converter - Created by Firji Achmad Fahresi</p>
    </div>
</body>
</html>`;

                updateProgress(85, 'Converting to DOCX format...');

                // Convert to Word with better quality
                const converted = htmlDocx.asBlob(htmlContent);
                
                updateProgress(95, 'Preparing download...');
                
                // Save the document
                const originalName = currentFile.name.replace(/\.[^/.]+$/, '');
                saveAs(converted, `${originalName}_converted.docx`);
                
                resolve();
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = reject;
        reader.readAsArrayBuffer(currentFile);
    });
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
