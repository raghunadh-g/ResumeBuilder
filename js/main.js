/**
 * Resume Builder - Main JavaScript
 * Handles the core functionality of the Resume Builder application
 */

// Import modules
import {
    addExperienceItem,
    addAchievementItem,
    addEducationItem,
    addSkillCategory,
    addSkillItem,
    addCertificationItem,
    addProjectItem,
    addLanguageItem,
    addReferenceItem
} from './form-handlers.js';

import {
    initResumePreview,
    updateResumePreview
} from './preview.js';

import {
    exportToPdf,
    exportToDocx
} from './export-handlers.js';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

/**
 * Initialize the application
 */
function initApp() {
    // Set up navigation
    setupNavigation();
    
    // Set up section tabs
    setupSectionTabs();

    // Set up change template
    setupChangeTemplate();
    
    // Set up form interactions
    setupFormInteractions();
    
    // Set up template selection
    setupTemplateSelection();
    
    // Set up export functionality
    setupExportFunctionality();
    
    // Set up mobile menu toggle
    setupMobileMenu();
    
    // Initialize the resume preview
    initResumePreview();
    
    // Set up form change listeners
    setupFormChangeListeners();
}

/**
 * Set up navigation between main sections
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('main > section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(link => link.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

/**
 * Set up tabs for resume sections in the sidebar
 */
function setupSectionTabs() {
    const sectionTabs = document.querySelectorAll('.section-tabs li');
    const sectionContents = document.querySelectorAll('.section-content');
    
    sectionTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and content sections
            sectionTabs.forEach(tab => tab.classList.remove('active'));
            sectionContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(`${sectionId}-content`).classList.add('active');
        });
    });
}


/**
 * Set up tabs for resume sections in the sidebar
 */
function setupChangeTemplate() {
    const sidebarButtons = document.querySelectorAll('.sidebar-footer button');
    
    sidebarButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Switch to templates section
            document.querySelector('nav a[data-section="templates"]').click();
        });
    });
}

/**
 * Set up form interactions (add/remove items, etc.)
 */
function setupFormInteractions() {
    // Set up add experience button
    const addExperienceBtn = document.getElementById('add-experience');
    if (addExperienceBtn) {
        addExperienceBtn.addEventListener('click', addExperienceItem);
    }
    
    // Set up add education button
    const addEducationBtn = document.getElementById('add-education');
    if (addEducationBtn) {
        addEducationBtn.addEventListener('click', addEducationItem);
    }
    
    // Set up add skill category button
    const addSkillCategoryBtn = document.getElementById('add-skill-category');
    if (addSkillCategoryBtn) {
        addSkillCategoryBtn.addEventListener('click', addSkillCategory);
    }
    
    // Set up add certification button
    const addCertificationBtn = document.getElementById('add-certification');
    if (addCertificationBtn) {
        addCertificationBtn.addEventListener('click', addCertificationItem);
    }
    
    // Set up add project button
    const addProjectBtn = document.getElementById('add-project');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', addProjectItem);
    }
    
    // Set up add language button
    const addLanguageBtn = document.getElementById('add-language');
    if (addLanguageBtn) {
        addLanguageBtn.addEventListener('click', addLanguageItem);
    }
    
    // Set up add reference button
    const addReferenceBtn = document.getElementById('add-reference');
    if (addReferenceBtn) {
        addReferenceBtn.addEventListener('click', addReferenceItem);
    }
    
    // Set up references available checkbox
    const referencesAvailableCheckbox = document.getElementById('referencesAvailable');
    if (referencesAvailableCheckbox) {
        referencesAvailableCheckbox.addEventListener('change', function() {
            const referenceItems = document.getElementById('reference-items');
            if (referenceItems) {
                referenceItems.style.display = this.checked ? 'none' : 'block';
                document.getElementById('add-reference').style.display = this.checked ? 'none' : 'inline-flex';
            }
            
            // Update preview
            updateResumePreview();
        });
    }
    
    // Set up event delegation for remove buttons
    document.addEventListener('click', function(e) {
        // Check if the click was on the remove button or its icon
        if (e.target && (e.target.classList.contains('btn-remove') || e.target.closest('.btn-remove'))) {
            // Find the closest parent item
            const item = e.target.closest('.experience-item, .education-item, .skill-category, .certification-item, .project-item, .language-item, .reference-item, .achievement-item, .skill-item');
            
            if (item) {    
                // Remove the item
                item.remove();
                
                // Update the preview
                updateResumePreview();
            }
        }
        
        if (e.target && e.target.classList.contains('btn-add-achievement')) {
            // Find the closest parent that contains the achievements container
            const parent = e.target.parentElement;
            const achievementsContainer = parent.querySelector('.achievements-container');
            if (achievementsContainer) {
                addAchievementItem(achievementsContainer);
            }
        }
        
        if (e.target && e.target.classList.contains('btn-add-skill')) {
            // Find the closest parent that contains the skill items
            const parent = e.target.parentElement;
            const skillItems = parent.querySelector('.skill-items');
            if (skillItems) {
                addSkillItem(skillItems);
            }
        }
    });
}

/**
 * Set up form change listeners
 */
function setupFormChangeListeners() {
    // Listen for changes in form fields
    document.addEventListener('input', debounce(function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            updateResumePreview();
        }
    }, 500));
    
    // Listen for checkbox changes
    document.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox') {
            updateResumePreview();
        }
    });
}

/**
 * Set up template selection
 */
function setupTemplateSelection() {
    // Template category buttons
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter templates
            const category = this.getAttribute('data-category');
            filterTemplates(category);
        });
    });
    
    // Template selection buttons
    const selectButtons = document.querySelectorAll('.btn-select-template');
    selectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const template = this.getAttribute('data-template');
            selectTemplate(template);
            
            // Switch to editor section
            document.querySelector('nav a[data-section="editor"]').click();
        });
    });
    
    // Template preview buttons
    const previewButtons = document.querySelectorAll('.btn-preview-template');
    previewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const templateId = this.getAttribute('data-template');
            previewTemplate(templateId);
        });
    });
}

/**
 * Filter templates by category
 */
function filterTemplates(category) {
    const templateCards = document.querySelectorAll('.template-card');
    
    templateCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Select a template
 */
function selectTemplate(template) {
    // Save the selected template
    localStorage.setItem('selectedTemplate', template);
    
    // Update the preview
    updateResumePreview();
}

/**
 * Preview a template in a new window
 */
function previewTemplate(templateId) {
    // Import the necessary functions
    import('./templates.js').then(({ generateTemplateHTML }) => {
        import('./preview.js').then(({ collectResumeData }) => {
            // Get the resume data
            const resumeData = collectResumeData();
            
            // Generate HTML for the selected template
            const templateHTML = generateTemplateHTML(templateId, resumeData);
            
            // Create a new window for the preview
            const previewWindow = window.open('', '_blank');
            if (previewWindow) {
                // Create the HTML content
                const htmlContent = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Template Preview - ${templateId}</title>
                        
                        <!-- Google Fonts -->
                        <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
                        
                        <!-- Custom CSS -->
                        <link rel="stylesheet" href="css/templates.css">
                        
                        <style>
                            body {
                                margin: 0;
                                padding: 20px;
                                font-family: 'Open Sans', sans-serif;
                                background-color: #f5f5f5;
                            }
                            
                            .resume-container {
                                width: 100%;
                                display: flex;
                                justify-content: center;
                                padding: 20px;
                                box-sizing: border-box;
                            }
                            
                            .resume-template {
                                background-color: #fff;
                                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                                width: 100%;
                                max-width: 800px;
                                margin: 0 auto;
                                padding: 40px;
                                box-sizing: border-box;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="resume-container">
                            ${templateHTML}
                        </div>
                    </body>
                    </html>
                `;
                
                // Write the content to the new window
                previewWindow.document.open();
                previewWindow.document.write(htmlContent);
                previewWindow.document.close();
            }
        });
    });
}

/**
 * Set up export functionality
 */
function setupExportFunctionality() {
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
 * Set up mobile menu toggle
 */
function setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }
}

/**
 * Debounce function to limit how often a function is called
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// Make updateResumePreview available globally
window.updateResumePreview = updateResumePreview;
