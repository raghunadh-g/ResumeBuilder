/**
 * Resume Builder - Export Handlers
 * Handles exporting the resume to different formats
 */

// Import functions
import { collectResumeData } from './preview.js';

/**
 * Export resume to PDF
 */
function exportToPdf() {
    // Get the resume preview iframe
    const iframe = document.getElementById('resume-preview');
    
    // Check if iframe is loaded
    if (!iframe || !iframe.contentWindow || !iframe.contentWindow.document.body) {
        alert('Please wait for the resume preview to load completely before exporting.');
        return;
    }
    
    // Show loading indicator
    showLoadingIndicator('Generating PDF...');
    
    try {
        // Get the resume content
        const resumeContent = iframe.contentWindow.document.body.querySelector('.resume-template');
        
        if (!resumeContent) {
            hideLoadingIndicator();
            alert('No resume content found. Please make sure you have selected a template and filled in some information.');
            return;
        }
        
        // Create a new window for the PDF
        const printWindow = window.open('', '_blank');
        
        if (!printWindow) {
            hideLoadingIndicator();
            alert('Please allow pop-ups to export the resume as PDF.');
            return;
        }
        
        // Get the selected template's styles
        const templateStyles = iframe.contentWindow.document.head.querySelectorAll('style, link[rel="stylesheet"]');
        
        // Create the HTML content for the print window
        let printContent = '<!DOCTYPE html><html><head><title>Resume</title>';
        
        // Add the template styles
        templateStyles.forEach(style => {
            printContent += style.outerHTML;
        });
        
        // Add print-specific styles
        printContent += `
            <style>
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    
                    .resume-template {
                        width: 100%;
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        box-shadow: none;
                    }
                }
            </style>
        `;
        
        printContent += '</head><body>';
        printContent += resumeContent.outerHTML;
        printContent += '</body></html>';
        
        // Write the content to the print window
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // Wait for the content to load
        printWindow.onload = () => {
            printWindow.focus(); // Optional, ensures the window is in focus
            
            // Print the window
            printWindow.print();
            
            // Close the window after printing
            printWindow.onafterprint = function() {
                printWindow.close();
            };
        };
    } catch (error) {
        hideLoadingIndicator();
        alert('An error occurred while generating the PDF: ' + error.message);
    }
}

/**
 * Export resume to DOCX
 */
function exportToDocx() {
    // Get the resume preview iframe
    const iframe = document.getElementById('resume-preview');

    // Check if iframe is loaded
    if (!iframe || !iframe.contentWindow || !iframe.contentWindow.document.body) {
        alert('Please wait for the resume preview to load completely before exporting.');
        return;
    }

    // Show loading indicator
    showLoadingIndicator('Generating DOCX...');

    try {
        // Get the resume content
        const resumeContent = iframe.contentWindow.document.body.querySelector('.resume-template');

        if (!resumeContent) {
            hideLoadingIndicator();
            alert('No resume content found. Please make sure you have selected a template and filled in some information.');
            return;
        }

        //Get the styles applied to the resume (style + link elements)
        const styles = iframe.contentWindow.document.head.querySelectorAll('style');
        let collectedStyles = '';

        styles.forEach(style => {
            collectedStyles += style.outerHTML;
        });

        fetch('styles.css')
        .then(res => res.text())
        .then(cssText => {
            const styleTag = `<style>${cssText}</style>`;
            collectedStyles += styleTag;
        });

        fetch('templates.css')
        .then(res => res.text())
        .then(cssText => {
            const styleTag = `<style>${cssText}</style>`;
            collectedStyles += styleTag;
        });

        const wordHTML = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:w="urn:schemas-microsoft-com:office:word" 
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
        <meta charset="utf-8">
        <title>Resume</title>
        ${collectedStyles}
    </head>
    <body>
        ${resumeContent.outerHTML}
    </body>
    </html>
    `;

    //Create a Blob object (MIME type: application/msword)
    const blob = new Blob(['\ufeff', wordHTML], {
        type: 'application/msword'
    });

    //Create a temporary download link
    const downloadLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = 'Resume.doc'; // Filename for the download
    document.body.appendChild(downloadLink);
    downloadLink.click(); // Trigger the download
    document.body.removeChild(downloadLink); // Cleanup

    // Optional: Release the object URL
    URL.revokeObjectURL(url);

    } catch (error) {
        console.error('DOCX generation error:', error);
        hideLoadingIndicator();
        alert('An error occurred while generating the DOCX: ' + error.message);
    }
}

/**
 * Show loading indicator
 */
function showLoadingIndicator(message) {
    // Create loading indicator if it doesn't exist
    let loadingIndicator = document.getElementById('loading-indicator');
    
    if (!loadingIndicator) {
        loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'loading-indicator';
        loadingIndicator.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-message"></div>
        `;
        document.body.appendChild(loadingIndicator);
    }
    
    // Set the message
    loadingIndicator.querySelector('.loading-message').textContent = message || 'Loading...';
    
    // Show the loading indicator
    loadingIndicator.style.display = 'flex';
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('loading-indicator');
    
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

// Export functions
export {
    exportToPdf,
    exportToDocx
};
