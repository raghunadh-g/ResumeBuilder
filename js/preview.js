/**
 * Resume Builder - Preview Module
 * Handles the resume preview functionality
 */

import { generateTemplateHTML } from './templates.js';

/**
 * Initialize the resume preview
 */
function initResumePreview() {
    // Get the preview iframe
    const iframe = document.getElementById('resume-preview');
    
    if (iframe) {
        // Set the iframe source
        iframe.src = 'preview.html';
        
        // Wait for the iframe to load
        iframe.onload = function() {
            // Update the preview
            updateResumePreview();
        };
    }
}

/**
 * Update the resume preview
 */
function updateResumePreview() {
    // Get the preview iframe
    const iframe = document.getElementById('resume-preview');
    
    if (iframe && iframe.contentWindow) {
        // Get the selected template
        const template = localStorage.getItem('selectedTemplate') || 'professional-classic';
        
        // Collect resume data
        const resumeData = collectResumeData();
        
        // Generate the resume HTML
        const resumeHTML = generateTemplateHTML(template, resumeData);
        
        // Send the resume HTML to the iframe
        iframe.contentWindow.postMessage({
            type: 'updatePreview',
            content: resumeHTML
        }, '*');
    }
}

/**
 * Collect resume data from the form
 */
function collectResumeData() {
    const data = {
        firstName: document.getElementById('firstName')?.value || '',
        lastName: document.getElementById('lastName')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        city: document.getElementById('city')?.value || '',
        state: document.getElementById('state')?.value || '',
        professionalTitle: document.getElementById('professionalTitle')?.value || '',
        linkedin: document.getElementById('linkedin')?.value || '',
        website: document.getElementById('website')?.value || '',
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
 */
function collectExperienceData() {
    const experienceItems = document.querySelectorAll('.experience-item');
    const experiences = [];
    
    experienceItems.forEach(item => {
        const jobTitle = item.querySelector('input[name="jobTitle"]')?.value || '';
        const company = item.querySelector('input[name="company"]')?.value || '';
        
        if (jobTitle || company) {
            const experience = {
                jobTitle,
                company,
                location: item.querySelector('input[name="location"]')?.value || '',
                startDate: item.querySelector('input[name="startDate"]')?.value || '',
                endDate: item.querySelector('input[name="endDate"]')?.value || '',
                current: item.querySelector('input[name="currentJob"]')?.checked || false,
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
 */
function collectEducationData() {
    const educationItems = document.querySelectorAll('.education-item');
    const educations = [];
    
    educationItems.forEach(item => {
        const institution = item.querySelector('input[name="institution"]')?.value || '';
        const degree = item.querySelector('input[name="degree"]')?.value || '';
        
        if (institution || degree) {
            educations.push({
                institution,
                degree,
                fieldOfStudy: item.querySelector('input[name="fieldOfStudy"]')?.value || '',
                location: item.querySelector('input[name="location"]')?.value || '',
                startDate: item.querySelector('input[name="startDate"]')?.value || '',
                endDate: item.querySelector('input[name="endDate"]')?.value || '',
                current: item.querySelector('input[name="currentEducation"]')?.checked || false,
                gpa: item.querySelector('input[name="gpa"]')?.value || ''
            });
        }
    });
    
    return educations;
}

/**
 * Collect skills data from the form
 */
function collectSkillsData() {
    const skillCategories = document.querySelectorAll('.skill-category');
    const skills = [];
    
    skillCategories.forEach(category => {
        const categoryName = category.querySelector('input[name="categoryName"]')?.value || '';
        const skillItems = [];
        
        // Collect skills
        category.querySelectorAll('.skill-item input').forEach(input => {
            const skill = input.value.trim();
            if (skill) {
                skillItems.push(skill);
            }
        });
        
        if (categoryName || skillItems.length > 0) {
            skills.push({
                category: categoryName,
                skills: skillItems
            });
        }
    });
    
    return skills;
}

/**
 * Collect certifications data from the form
 */
function collectCertificationsData() {
    const certificationItems = document.querySelectorAll('.certification-item');
    const certifications = [];
    
    certificationItems.forEach(item => {
        const name = item.querySelector('input[name="certificationName"]')?.value || '';
        const issuer = item.querySelector('input[name="issuer"]')?.value || '';
        
        if (name || issuer) {
            certifications.push({
                name,
                issuer,
                issueDate: item.querySelector('input[name="issueDate"]')?.value || '',
                expirationDate: item.querySelector('input[name="expirationDate"]')?.value || '',
                noExpiration: item.querySelector('input[name="noExpiration"]')?.checked || false,
                credentialId: item.querySelector('input[name="credentialId"]')?.value || '',
                credentialUrl: item.querySelector('input[name="credentialUrl"]')?.value || ''
            });
        }
    });
    
    return certifications;
}

/**
 * Collect projects data from the form
 */
function collectProjectsData() {
    const projectItems = document.querySelectorAll('.project-item');
    const projects = [];
    
    projectItems.forEach(item => {
        const name = item.querySelector('input[name="projectName"]')?.value || '';
        const description = item.querySelector('textarea[name="projectDescription"]')?.value || '';
        
        if (name || description) {
            projects.push({
                name,
                url: item.querySelector('input[name="projectUrl"]')?.value || '',
                description
            });
        }
    });
    
    return projects;
}

/**
 * Collect languages data from the form
 */
function collectLanguagesData() {
    const languageItems = document.querySelectorAll('.language-item');
    const languages = [];
    
    languageItems.forEach(item => {
        const language = item.querySelector('input[name="language"]')?.value || '';
        const proficiency = item.querySelector('select[name="proficiency"]')?.value || '';
        
        if (language) {
            languages.push({
                language,
                proficiency
            });
        }
    });
    
    return languages;
}

/**
 * Collect references data from the form
 */
function collectReferencesData() {
    const referenceItems = document.querySelectorAll('.reference-item');
    const references = [];
    
    referenceItems.forEach(item => {
        const name = item.querySelector('input[name="refName"]')?.value || '';
        const position = item.querySelector('input[name="refPosition"]')?.value || '';
        
        if (name || position) {
            references.push({
                name,
                position,
                company: item.querySelector('input[name="refCompany"]')?.value || '',
                email: item.querySelector('input[name="refEmail"]')?.value || '',
                phone: item.querySelector('input[name="refPhone"]')?.value || ''
            });
        }
    });
    
    return references;
}

// Export functions
export {
    initResumePreview,
    updateResumePreview,
    collectResumeData
};
