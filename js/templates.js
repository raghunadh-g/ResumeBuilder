/**
 * Resume Builder - Templates JavaScript
 * Handles the template-specific functionality
 */

// Template data
const templates = {
    // Professional Templates
    'professional-classic': {
        name: 'Professional Classic',
        category: 'professional',
        description: 'Traditional layout with clean typography and formal structure.',
        className: 'professional-classic'
    },
    'professional-executive': {
        name: 'Professional Executive',
        category: 'professional',
        description: 'Sophisticated design for senior positions with emphasis on achievements.',
        className: 'professional-executive'
    },
    'professional-corporate': {
        name: 'Professional Corporate',
        category: 'professional',
        description: 'Structured layout with subtle color accents for corporate environments.',
        className: 'professional-corporate'
    },
    
    // Modern Templates
    'modern-clean': {
        name: 'Modern Clean',
        category: 'modern',
        description: 'Minimalist design with ample white space and contemporary typography.',
        className: 'modern-clean'
    },
    'modern-sidebar': {
        name: 'Modern Sidebar',
        category: 'modern',
        description: 'Contemporary layout with a functional sidebar for skills and contact info.',
        className: 'modern-sidebar'
    },
    'modern-tech': {
        name: 'Modern Tech',
        category: 'modern',
        description: 'Clean design with skill visualizations ideal for tech professionals.',
        className: 'modern-tech'
    },
    
    // Creative Templates
    'creative-designer': {
        name: 'Creative Designer',
        category: 'creative',
        description: 'Visually striking layout for design professionals with portfolio highlights.',
        className: 'creative-designer'
    },
    'creative-colorful': {
        name: 'Creative Colorful',
        category: 'creative',
        description: 'Bold, colorful design that stands out while maintaining professional structure.',
        className: 'creative-colorful'
    },
    'creative-minimal': {
        name: 'Creative Minimal',
        category: 'creative',
        description: 'Artistic minimalist design with unique layout for creative professionals.',
        className: 'creative-minimal'
    }
};

// Generate HTML for a specific template
function generateTemplateHTML(templateId, data) {
    const template = templates[templateId];
    if (!template) {
        return generateDefaultTemplateHTML(data);
    }
    
    // Get the template-specific HTML generator if it exists
    const templateGenerator = templateGenerators[templateId] || generateDefaultTemplateHTML;
    
    return templateGenerator(data, template);
}

// Default template HTML generator
function generateDefaultTemplateHTML(data, template = { className: 'professional-classic' }) {
    return `
        <div class="resume-template ${template.className}">
            <div class="header">
                <div class="name">${data.firstName || ''} ${data.lastName || ''}</div>
                <div class="title">${data.professionalTitle || ''}</div>
                <div class="contact-info">
                    ${data.email ? `<div class="contact-item"><i class="fas fa-envelope"></i> ${data.email}</div>` : ''}
                    ${data.phone ? `<div class="contact-item"><i class="fas fa-phone"></i> ${data.phone}</div>` : ''}
                    ${data.city ? `<div class="contact-item"><i class="fas fa-map-marker-alt"></i> ${data.city}${data.state ? ', ' + data.state : ''}</div>` : ''}
                    ${data.linkedin ? `<div class="contact-item"><i class="fab fa-linkedin"></i> ${data.linkedin}</div>` : ''}
                    ${data.website ? `<div class="contact-item"><i class="fas fa-globe"></i> ${data.website}</div>` : ''}
                </div>
            </div>
            
            ${data.summary ? `
                <div class="section">
                    <div class="section-title">Professional Summary</div>
                    <div class="item-content">${data.summary}</div>
                </div>
            ` : ''}
            
            ${generateExperienceSection(data.experience)}
            ${generateEducationSection(data.education)}
            ${generateSkillsSection(data.skills)}
            ${generateProjectsSection(data.projects)}
            ${generateCertificationsSection(data.certifications)}
            ${generateLanguagesSection(data.languages)}
            ${generateInterestsSection(data.interests)}
            ${generateReferencesSection(data.references, data.referencesAvailable)}
        </div>
    `;
}

// Generate experience section
function generateExperienceSection(experience) {
    if (!experience || experience.length === 0) return '';
    
    let html = `
        <div class="section">
            <div class="section-title">Experience</div>
    `;
    
    experience.forEach(exp => {
        html += `
            <div class="item">
                <div class="item-header">
                    <div>
                        <div class="item-title">${exp.jobTitle || ''}</div>
                        <div class="item-subtitle">${exp.company || ''}${exp.location ? ` | ${exp.location}` : ''}</div>
                    </div>
                    <div class="item-date">${formatDate(exp.startDate) || ''} - ${exp.current ? 'Present' : formatDate(exp.endDate) || ''}</div>
                </div>
                ${exp.achievements && exp.achievements.length > 0 ? `
                    <div class="item-content">
                        <ul>
                            ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    html += `</div>`;
    return html;
}

// Generate education section
function generateEducationSection(education) {
    if (!education || education.length === 0) return '';
    
    let html = `
        <div class="section">
            <div class="section-title">Education</div>
    `;
    
    education.forEach(edu => {
        html += `
            <div class="item">
                <div class="item-header">
                    <div>
                        <div class="item-title">${edu.degree || ''}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</div>
                        <div class="item-subtitle">${edu.institution || ''}${edu.location ? ` | ${edu.location}` : ''}</div>
                    </div>
                    <div class="item-date">${formatDate(edu.startDate) || ''} - ${edu.current ? 'Present' : formatDate(edu.endDate) || ''}</div>
                </div>
                ${edu.gpa ? `<div class="item-content">GPA: ${edu.gpa}</div>` : ''}
            </div>
        `;
    });
    
    html += `</div>`;
    return html;
}

// Generate skills section
function generateSkillsSection(skills) {
    if (!skills || skills.length === 0) return '';
    
    let html = `
        <div class="section">
            <div class="section-title">Skills</div>
    `;
    
    skills.forEach(category => {
        html += `
            <div class="item">
                <div class="item-title">${category.category || ''}</div>
                <div class="skills-list">
                    ${category.skills.map(skill => `<div class="skill-item">${skill}</div>`).join('')}
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    return html;
}

// Generate projects section
function generateProjectsSection(projects) {
    if (!projects || projects.length === 0) return '';
    
    let html = `
        <div class="section">
            <div class="section-title">Projects</div>
    `;
    
    projects.forEach(project => {
        html += `
            <div class="item">
                <div class="item-header">
                    <div>
                        <div class="item-title">${project.name || ''}</div>
                        ${project.technologies ? `
                            <div class="item-subtitle">Technologies: ${project.technologies}</div>
                        ` : ''}
                    </div>
                </div>
                ${project.description ? `<div class="item-content">${project.description}</div>` : ''}
                ${project.url ? `<div class="item-content"><a href="${project.url}" target="_blank">${project.url}</a></div>` : ''}
            </div>
        `;
    });
    
    html += `</div>`;
    return html;
}

// Generate certifications section
function generateCertificationsSection(certifications) {
    if (!certifications || certifications.length === 0) return '';
    
    let html = `
        <div class="section">
            <div class="section-title">Certifications</div>
    `;
    
    certifications.forEach(cert => {
        html += `
            <div class="item">
                <div class="item-header">
                    <div>
                        <div class="item-title">${cert.name || ''}</div>
                        <div class="item-subtitle">${cert.issuer || ''}</div>
                    </div>
                    <div class="item-date">
                        ${formatDate(cert.issueDate) || ''}
                        ${!cert.noExpiration && cert.expirationDate ? ` - ${formatDate(cert.expirationDate)}` : ''}
                    </div>
                </div>
                ${cert.credentialId ? `<div class="item-content">Credential ID: ${cert.credentialId}</div>` : ''}
                ${cert.credentialUrl ? `<div class="item-content"><a href="${cert.credentialUrl}" target="_blank">Verify</a></div>` : ''}
            </div>
        `;
    });
    
    html += `</div>`;
    return html;
}

// Generate languages section
function generateLanguagesSection(languages) {
    if (!languages || languages.length === 0) return '';
    
    let html = `
        <div class="section">
            <div class="section-title">Languages</div>
            <div class="skills-list">
                ${languages.map(lang => `
                    <div class="skill-item">${lang.language || ''} (${lang.proficiency || ''})</div>
                `).join('')}
            </div>
        </div>
    `;
    
    return html;
}

// Generate interests section
function generateInterestsSection(interests) {
    if (!interests || interests.length === 0) return '';
    
    let html = `
        <div class="section">
            <div class="section-title">Interests</div>
            <div class="item-content">${interests.join(', ')}</div>
        </div>
    `;
    
    return html;
}

// Generate references section
function generateReferencesSection(references, referencesAvailable) {
    if ((!references || references.length === 0) && !referencesAvailable) return '';
    
    let html = `
        <div class="section">
            <div class="section-title">References</div>
    `;
    
    if (referencesAvailable) {
        html += `<div class="item-content">References available upon request</div>`;
    } else if (references && references.length > 0) {
        references.forEach(ref => {
            html += `
                <div class="item">
                    <div class="item-title">${ref.name || ''}</div>
                    <div class="item-subtitle">${ref.position || ''}${ref.company ? ` at ${ref.company}` : ''}</div>
                    <div class="item-content">
                        ${ref.email ? `Email: ${ref.email}<br>` : ''}
                        ${ref.phone ? `Phone: ${ref.phone}` : ''}
                    </div>
                </div>
            `;
        });
    }
    
    html += `</div>`;
    return html;
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    
    return `${month} ${year}`;
}

// Template-specific HTML generators
const templateGenerators = {
    'modern-sidebar': function(data, template) {
        return `
            <div class="resume-template ${template.className}">
                <div class="modern-sidebar-left">
                    <div class="header">
                        <div class="name">${data.firstName || ''} ${data.lastName || ''}</div>
                        <div class="title">${data.professionalTitle || ''}</div>
                        <div class="contact-info">
                            ${data.email ? `<div class="contact-item"><i class="fas fa-envelope"></i> ${data.email}</div>` : ''}
                            ${data.phone ? `<div class="contact-item"><i class="fas fa-phone"></i> ${data.phone}</div>` : ''}
                            ${data.city ? `<div class="contact-item"><i class="fas fa-map-marker-alt"></i> ${data.city}${data.state ? ', ' + data.state : ''}</div>` : ''}
                            ${data.linkedin ? `<div class="contact-item"><i class="fab fa-linkedin"></i> ${data.linkedin}</div>` : ''}
                            ${data.website ? `<div class="contact-item"><i class="fas fa-globe"></i> ${data.website}</div>` : ''}
                        </div>
                    </div>
                    
                    ${generateSkillsSection(data.skills)}
                    ${generateLanguagesSection(data.languages)}
                    ${generateInterestsSection(data.interests)}
                </div>
                
                <div class="modern-sidebar-right">
                    ${data.summary ? `
                        <div class="section">
                            <div class="section-title">Professional Summary</div>
                            <div class="item-content">${data.summary}</div>
                        </div>
                    ` : ''}
                    
                    ${generateExperienceSection(data.experience)}
                    ${generateEducationSection(data.education)}
                    ${generateProjectsSection(data.projects)}
                    ${generateCertificationsSection(data.certifications)}
                    ${generateReferencesSection(data.references, data.referencesAvailable)}
                </div>
            </div>
        `;
    }
};

// Export functions
export {
    templates,
    generateTemplateHTML
};
