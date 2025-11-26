# Premium File Converter 🚀

Website converter profesional untuk mengubah file Markdown dan PDF ke format Word (.docx) dengan kualitas tinggi.

**Created by: Firji Achmad Fahresi**

## ✨ Fitur Utama

### 1. **Markdown to Word** ✅
- Konversi MD/Markdown/TXT ke DOCX
- Support syntax highlighting untuk code blocks
- Preserves formatting (headings, bold, italic, lists, tables, dll)
- Preview real-time sebelum convert
- **100% Client-side** - No API needed

### 2. **PDF to Word** 👑 PREMIUM
- Konversi PDF ke DOCX dengan kualitas tinggi
- **Menggunakan ConvertAPI Premium**
- Preserves layout, images, tables, formatting
- Preview halaman pertama PDF
- Hasil 99% identik dengan file asli
- **Gratis 250 konversi/bulan**

## 🔧 Setup API Key (Untuk PDF Conversion)

### Langkah 1: Dapatkan API Key Gratis
1. Kunjungi: [https://www.convertapi.com/a/signup](https://www.convertapi.com/a/signup)
2. Sign up dengan email Anda (GRATIS, tanpa kartu kredit)
3. Setelah login, buka: [https://www.convertapi.com/a](https://www.convertapi.com/a)
4. Copy **Secret API Key** Anda

### Langkah 2: Konfigurasi
1. Buka file `config.js`
2. Ganti `'your_api_key_here'` dengan API key Anda:
   ```javascript
   secret: 'abc123xyz456', // Paste your API key here
   ```
3. Save file
4. Refresh website

### Langkah 3: Selesai! 🎉
- Anda sekarang punya **250 konversi GRATIS per bulan**
- Konversi PDF akan menggunakan Premium API
- Hasil berkualitas tinggi seperti Adobe Acrobat DC

## 📦 File Structure

```
Converter/
├── index.html          # Main HTML file
├── styles.css          # Styling & design
├── script.js           # Main JavaScript logic
├── config.js           # API configuration (EDIT THIS)
├── sample.md           # Sample Markdown file for testing
└── README.md           # Documentation (this file)
```

## 🎨 Technology Stack

- **HTML5** - Structure
- **CSS3** - Modern gradient design with animations
- **JavaScript** - Core functionality
- **Libraries:**
  - Marked.js - Markdown parsing
  - Highlight.js - Code syntax highlighting
  - PDF.js - PDF rendering & text extraction
  - html-docx.js - HTML to Word conversion
  - FileSaver.js - File download
  - ConvertAPI - Premium PDF conversion

## 🌟 Premium Features

| Feature | Free Tools | This Converter |
|---------|-----------|----------------|
| MD to Word | ❌ Limited | ✅ Full Support |
| PDF Preview | ❌ | ✅ |
| Code Highlighting | ❌ | ✅ |
| Premium PDF Conversion | ❌ | ✅ (250/month) |
| Preserve Images | ❌ | ✅ (PDF mode) |
| Preserve Tables | ❌ | ✅ (PDF mode) |
| Preserve Layout | ❌ | ✅ (PDF mode) |
| No Watermark | ❌ | ✅ |
| Client-side Privacy | ❌ | ✅ (MD mode) |

## 🚀 How to Use

### Untuk Markdown:
1. Klik tombol **"MD to Word"**
2. Upload file .md / .markdown / .txt
3. Preview akan muncul otomatis
4. Klik **"Convert to Word"**
5. File .docx akan terdownload

### Untuk PDF:
1. **Setup API key dulu** (lihat Setup API Key di atas)
2. Klik tombol **"PDF to Word"**
3. Upload file .pdf
4. Preview halaman pertama akan muncul
5. Klik **"Convert to Word"**
6. Tunggu beberapa detik (konversi di cloud)
7. File .docx premium akan terdownload

## ⚠️ Notes

- **PDF Conversion** memerlukan koneksi internet (menggunakan API)
- **MD Conversion** bekerja offline (client-side)
- API gratis limit: 250 konversi/bulan
- File size limit: 10MB (dapat dikonfigurasi di config.js)
- Untuk hasil terbaik PDF, pastikan API key sudah dikonfigurasi

## 🔒 Privacy & Security

- **Markdown files**: Diproses 100% di browser Anda (tidak dikirim ke server)
- **PDF files**: Dikirim ke ConvertAPI server (terenkripsi HTTPS)
- Tidak ada file yang disimpan di server kami
- File hasil konversi langsung ke komputer Anda

## 📝 License

Created by **Firji Achmad Fahresi** - 2025

Free to use for personal and educational purposes.

## 🆘 Troubleshooting

### PDF Conversion tidak bekerja?
- Pastikan API key sudah dikonfigurasi di `config.js`
- Check koneksi internet
- Pastikan quota API belum habis (cek di dashboard ConvertAPI)
- Jika error, akan otomatis fallback ke basic conversion

### File terlalu besar?
- Edit `maxFileSizeMB` di `config.js`
- Note: API gratis ada limit size ~10MB

### Hasil PDF tidak sempurna?
- Pastikan menggunakan API conversion (bukan client-side)
- Untuk dokumen sangat kompleks, mungkin perlu premium account API

## 📧 Contact

Created with ❤️ by Firji Achmad Fahresi

---
**Enjoy converting! 🎉**
