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
        
        // Get the resume data
        const resumeData = collectResumeData();
        
        // Check if docx library is available
        if (!window.docx) {
            console.error('docx library not found');
            hideLoadingIndicator();
            alert('The document generation library is not loaded. Please refresh the page and try again.');
            return;
        }
        
        // Create a new Document using the docx library
        const doc = new window.docx.Document({
            sections: [{
                properties: {},
                children: generateDocxContent(resumeData)
            }]
        });
        
        // Use the docx library to create a blob
        window.docx.Packer.toBlob(doc).then(blob => {
            // Create a download link
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `${resumeData.firstName || 'Resume'}_${resumeData.lastName || ''}.docx`.trim();
            
            // Append the link to the body
            document.body.appendChild(downloadLink);
            
            // Hide loading indicator
            hideLoadingIndicator();
            
            // Click the link to download the file
            downloadLink.click();
            
            // Remove the link
            document.body.removeChild(downloadLink);
        }).catch(error => {
            console.error('Error creating DOCX blob:', error);
            hideLoadingIndicator();
            alert('There was an error generating the DOCX file. Please try again.');
        });
    } catch (error) {
        console.error('DOCX generation error:', error);
        hideLoadingIndicator();
        alert('An error occurred while generating the DOCX: ' + error.message);
    }
}

/**
 * Create DOCX content from resume data
 */
function createDocxContent(resumeData) {
    // Use the docx library to create a proper DOCX file
    const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } = window.docx;
    
    // Create a new Document
    const doc = new Document({
        sections: [{
            properties: {},
            children: generateDocxContent(resumeData)
        }]
    });
    
    return doc;
}

/**
 * Generate DOCX content from resume data
 * @param {Object} data - The resume data
 * @returns {Array} - Array of DOCX content elements
 */
function generateDocxContent(data) {
    const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } = window.docx;
    
    const content = [];
    
    // Add name and title
    content.push(
        new Paragraph({
            text: `${data.firstName || ''} ${data.lastName || ''}`,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER
        })
    );
    
    if (data.professionalTitle) {
        content.push(
            new Paragraph({
                text: data.professionalTitle,
                alignment: AlignmentType.CENTER
            })
        );
    }
    
    // Add contact info
    const contactInfo = [];
    if (data.email) contactInfo.push(data.email);
    if (data.phone) contactInfo.push(data.phone);
    if (data.city) {
        const location = data.city + (data.state ? ', ' + data.state : '');
        contactInfo.push(location);
    }
    
    content.push(
        new Paragraph({
            text: contactInfo.join(' | '),
            alignment: AlignmentType.CENTER
        })
    );
    
    // Add summary
    if (data.summary) {
        content.push(
            new Paragraph({
                text: 'Professional Summary',
                heading: HeadingLevel.HEADING_2
            }),
            new Paragraph({
                text: data.summary
            })
        );
    }
    
    // Add experience
    if (data.experience && data.experience.length > 0) {
        content.push(
            new Paragraph({
                text: 'Experience',
                heading: HeadingLevel.HEADING_2
            })
        );
        
        data.experience.forEach(exp => {
            content.push(
                new Paragraph({
                    text: exp.jobTitle,
                    bold: true
                }),
                new Paragraph({
                    text: `${exp.company}${exp.location ? ' | ' + exp.location : ''}`
                }),
                new Paragraph({
                    text: `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`
                })
            );
            
            if (exp.achievements && exp.achievements.length > 0) {
                exp.achievements.forEach(achievement => {
                    content.push(
                        new Paragraph({
                            text: achievement,
                            bullet: {
                                level: 0
                            }
                        })
                    );
                });
            }
            
            // Add spacing after each experience
            content.push(new Paragraph({}));
        });
    }
    
    // Add education
    if (data.education && data.education.length > 0) {
        content.push(
            new Paragraph({
                text: 'Education',
                heading: HeadingLevel.HEADING_2
            })
        );
        
        data.education.forEach(edu => {
            content.push(
                new Paragraph({
                    text: `${edu.degree}${edu.fieldOfStudy ? ' in ' + edu.fieldOfStudy : ''}`,
                    bold: true
                }),
                new Paragraph({
                    text: `${edu.institution}${edu.location ? ' | ' + edu.location : ''}`
                }),
                new Paragraph({
                    text: `${formatDate(edu.startDate)} - ${edu.current ? 'Present' : formatDate(edu.endDate)}`
                })
            );
            
            // Add spacing after each education
            content.push(new Paragraph({}));
        });
    }
    
    // Add skills
    if (data.skills && data.skills.length > 0) {
        content.push(
            new Paragraph({
                text: 'Skills',
                heading: HeadingLevel.HEADING_2
            })
        );
        
        data.skills.forEach(category => {
            content.push(
                new Paragraph({
                    text: category.name,
                    bold: true
                }),
                new Paragraph({
                    text: category.skills.join(', ')
                })
            );
        });
    }
    
    return content;
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
