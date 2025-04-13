/**
 * Resume Builder - Export JavaScript
 * Handles the export functionality for PDF and DOCX formats
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up export buttons
    setupExportButtons();
});

/**
 * Set up export buttons
 */
function setupExportButtons() {
    // Export to PDF button
    const exportPdfButton = document.getElementById('btn-export-pdf');
    if (exportPdfButton) {
        exportPdfButton.addEventListener('click', exportToPdf);
    }
    
    // Export to DOCX button
    const exportDocxButton = document.getElementById('btn-export-docx');
    if (exportDocxButton) {
        exportDocxButton.addEventListener('click', exportToDocx);
    }
}

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
    
    // Get the resume content
    const resumeContent = iframe.contentWindow.document.body.querySelector('.resume-template');
    
    // Use html2canvas to capture the resume as an image
    html2canvas(resumeContent).then(canvas => {
        try {
            // Create a new jsPDF instance
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            // Get the dimensions
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            // Add the image to the PDF
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            
            // Save the PDF
            const firstName = document.getElementById('firstName').value || 'Resume';
            const lastName = document.getElementById('lastName').value || '';
            const filename = `${firstName}${lastName ? '_' + lastName : ''}_Resume.pdf`;
            
            pdf.save(filename);
            
            // Hide loading indicator
            hideLoadingIndicator();
        } catch (error) {
            console.error('Error generating PDF:', error);
            hideLoadingIndicator();
            alert('There was an error generating the PDF. Please try again.');
        }
    }).catch(error => {
        console.error('Error capturing canvas:', error);
        hideLoadingIndicator();
        alert('There was an error generating the PDF. Please try again.');
    });
}

/**
 * Export resume to DOCX
 */
function exportToDocx() {
    // Show loading indicator
    showLoadingIndicator('Generating DOCX...');
    
    try {
        // Get the resume data
        const resumeData = collectResumeData();
        
        // Create a new Document
        const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } = window.docx;
        
        const doc = new Document({
            sections: [{
                properties: {},
                children: generateDocxContent(resumeData)
            }]
        });
        
        // Create a blob from the document
        window.docx.Packer.toBlob(doc).then(blob => {
            // Save the blob as a file
            const firstName = resumeData.firstName || 'Resume';
            const lastName = resumeData.lastName || '';
            const filename = `${firstName}${lastName ? '_' + lastName : ''}_Resume.docx`;
            
            // Create a download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            // Hide loading indicator
            hideLoadingIndicator();
        }).catch(error => {
            console.error('Error creating DOCX blob:', error);
            hideLoadingIndicator();
            alert('There was an error generating the DOCX file. Please try again.');
        });
    } catch (error) {
        console.error('Error generating DOCX:', error);
        hideLoadingIndicator();
        alert('There was an error generating the DOCX file. Please try again.');
    }
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
 * Collect resume data from the form
 * @returns {Object} - The resume data
 */
function collectResumeData() {
    const data = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        professionalTitle: document.getElementById('professionalTitle')?.value || '',
        linkedin: document.getElementById('linkedin').value,
        website: document.getElementById('website').value,
        summary: document.getElementById('summary')?.value || '',
        experience: collectExperienceData(),
        education: collectEducationData(),
        skills: collectSkillsData(),
        certifications: collectCertificationsData(),
        projects: collectProjectsData(),
        languages: collectLanguagesData(),
        interests: document.getElementById('interests')?.value.split(',').map(item => item.trim()).filter(Boolean) || [],
        references: collectReferencesData(),
        referencesAvailable: document.getElementById('referencesAvailable')?.checked || false
    };
    
    return data;
}

/**
 * Collect experience data from the form
 * @returns {Array} - The experience data
 */
function collectExperienceData() {
    const experienceItems = document.querySelectorAll('.experience-item');
    const experiences = [];
    
    experienceItems.forEach(item => {
        const jobTitle = item.querySelector('input[name="jobTitle"]').value;
        const company = item.querySelector('input[name="company"]').value;
        
        if (jobTitle && company) {
            const experience = {
                jobTitle,
                company,
                location: item.querySelector('input[name="location"]').value,
                startDate: item.querySelector('input[name="startDate"]').value,
                endDate: item.querySelector('input[name="endDate"]').value,
                current: item.querySelector('input[name="currentJob"]').checked,
                achievements: []
            };
            
            // Collect achievements
            const achievementItems = item.querySelectorAll('.achievement-item textarea');
            achievementItems.forEach(textarea => {
                const text = textarea.value.trim();
                if (text) {
                    experience.achievements.push(text);
                }
            });
            
            experiences.push(experience);
        }
    });
    
    return experiences;
}

/**
 * Collect education data from the form
 * @returns {Array} - The education data
 */
function collectEducationData() {
    const educationItems = document.querySelectorAll('.education-item');
    const educations = [];
    
    educationItems.forEach(item => {
        const institution = item.querySelector('input[name="institution"]').value;
        const degree = item.querySelector('input[name="degree"]').value;
        
        if (institution && degree) {
            educations.push({
                institution,
                degree,
                fieldOfStudy: item.querySelector('input[name="fieldOfStudy"]').value,
                location: item.querySelector('input[name="location"]').value,
                startDate: item.querySelector('input[name="startDate"]').value,
                endDate: item.querySelector('input[name="endDate"]').value,
                current: item.querySelector('input[name="currentEducation"]').checked,
                gpa: item.querySelector('input[name="gpa"]').value
            });
        }
    });
    
    return educations;
}

/**
 * Collect skills data from the form
 * @returns {Array} - The skills data
 */
function collectSkillsData() {
    const skillCategories = document.querySelectorAll('.skill-category');
    const skills = [];
    
    skillCategories.forEach(category => {
        const categoryName = category.querySelector('input[name="categoryName"]').value;
        
        if (categoryName) {
            const skillItems = [];
            
            // Collect skills
            const skillInputs = category.querySelectorAll('.skill-item input');
            skillInputs.forEach(input => {
                const text = input.value.trim();
                if (text) {
                    skillItems.push(text);
                }
            });
            
            if (skillItems.length > 0) {
                skills.push({
                    name: categoryName,
                    skills: skillItems
                });
            }
        }
    });
    
    return skills;
}

/**
 * Collect certifications data from the form
 * @returns {Array} - The certifications data
 */
function collectCertificationsData() {
    const certificationItems = document.querySelectorAll('.certification-item');
    const certifications = [];
    
    certificationItems.forEach(item => {
        const name = item.querySelector('input[name="certificationName"]').value;
        const issuer = item.querySelector('input[name="issuer"]').value;
        
        if (name) {
            certifications.push({
                name,
                issuer,
                issueDate: item.querySelector('input[name="issueDate"]').value,
                expirationDate: item.querySelector('input[name="expirationDate"]').value,
                noExpiration: item.querySelector('input[name="noExpiration"]').checked,
                credentialId: item.querySelector('input[name="credentialId"]')?.value,
                credentialUrl: item.querySelector('input[name="credentialUrl"]')?.value
            });
        }
    });
    
    return certifications;
}

/**
 * Collect projects data from the form
 * @returns {Array} - The projects data
 */
function collectProjectsData() {
    const projectItems = document.querySelectorAll('.project-item');
    const projects = [];
    
    projectItems.forEach(item => {
        const name = item.querySelector('input[name="projectName"]').value;
        
        if (name) {
            projects.push({
                name,
                url: item.querySelector('input[name="projectUrl"]').value,
                startDate: item.querySelector('input[name="startDate"]')?.value,
                endDate: item.querySelector('input[name="endDate"]')?.value,
                current: item.querySelector('input[name="currentProject"]')?.checked,
                description: item.querySelector('textarea[name="projectDescription"]').value,
                technologies: item.querySelector('input[name="technologies"]').value.split(',').map(tech => tech.trim()).filter(Boolean)
            });
        }
    });
    
    return projects;
}

/**
 * Collect languages data from the form
 * @returns {Array} - The languages data
 */
function collectLanguagesData() {
    const languageItems = document.querySelectorAll('.language-item');
    const languages = [];
    
    languageItems.forEach(item => {
        const language = item.querySelector('input[name="language"]').value;
        
        if (language) {
            languages.push({
                language,
                proficiency: item.querySelector('select[name="proficiency"]').value
            });
        }
    });
    
    return languages;
}

/**
 * Collect references data from the form
 * @returns {Array} - The references data
 */
function collectReferencesData() {
    const referenceItems = document.querySelectorAll('.reference-item');
    const references = [];
    
    referenceItems.forEach(item => {
        const name = item.querySelector('input[name="refName"]').value;
        
        if (name) {
            references.push({
                name,
                position: item.querySelector('input[name="refPosition"]').value,
                company: item.querySelector('input[name="refCompany"]').value,
                email: item.querySelector('input[name="refEmail"]').value,
                phone: item.querySelector('input[name="refPhone"]').value
            });
        }
    });
    
    return references;
}

/**
 * Format a date string
 * @param {string} dateString - The date string to format
 * @returns {string} - The formatted date
 */
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    
    return `${month} ${year}`;
}

/**
 * Show loading indicator
 * @param {string} message - The loading message
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
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #loading-indicator {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }
            
            .loading-spinner {
                border: 5px solid #f3f3f3;
                border-top: 5px solid #3498db;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                animation: spin 2s linear infinite;
            }
            
            .loading-message {
                color: white;
                margin-top: 10px;
                font-size: 18px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Set message
    loadingIndicator.querySelector('.loading-message').textContent = message;
    
    // Show loading indicator
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
