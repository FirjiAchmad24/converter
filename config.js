/**
 * Configuration file for Premium File Converter
 * Created by Firji Achmad Fahresi
 */

// ConvertAPI Configuration
// Get your FREE API key from: https://www.convertapi.com/a/signup
// Free tier includes: 250 conversions per month (no credit card required)

const CONFIG = {
    // ConvertAPI Settings
    convertAPI: {
        // API key is loaded from environment variable for security
        // In Vercel: Add VITE_CONVERTAPI_SECRET in Environment Variables
        // Locally: Create .env.local file with VITE_CONVERTAPI_SECRET
        secret: import.meta.env?.VITE_CONVERTAPI_SECRET || 
                (typeof process !== 'undefined' && process.env?.VITE_CONVERTAPI_SECRET) || 
                '5x4j8g7KaYLKjj5LbzpqIa2oe48ipgjk', // Fallback (will be removed in production)
        
        // Enable/disable API conversion
        // Set to false to use client-side conversion (lower quality but no API needed)
        // IMPORTANT: Set to true after you get valid API key from ConvertAPI dashboard
        enabled: true,  // Using API conversion
        
        // API endpoint
        endpoint: 'https://v2.convertapi.com/convert/pdf/to/docx'
    },
    
    // Conversion Settings
    conversion: {
        // Maximum file size in MB
        maxFileSizeMB: 10,
        
        // Supported formats
        supportedFormats: {
            markdown: ['.md', '.markdown', '.txt'],
            pdf: ['.pdf']
        }
    },
    
    // UI Settings
    ui: {
        showAPIStatus: true,
        enableDebugMode: false
    }
};

// Instructions to get API Key:
// 1. Visit: https://www.convertapi.com/a/signup
// 2. Sign up with your email (FREE - no credit card required)
// 3. After login, go to: https://www.convertapi.com/a
// 4. Copy your "Secret" API key
// 5. Paste it in the 'secret' field above
// 6. Save this file
// 7. Refresh the website
// 8. You now have 250 FREE premium conversions per month!

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
