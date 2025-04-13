/**
 * Resume Builder - Form Handlers
 * Handles form interactions like adding/removing items
 */

// Import functions
import { updateResumePreview } from './preview.js';

// Create a wrapper function for updateResumePreview
function updatePreview() {
    // Check if updateResumePreview is available globally
    if (typeof window.updateResumePreview === 'function') {
        window.updateResumePreview();
    } else if (typeof updateResumePreview === 'function') {
        updateResumePreview();
    } else {
        console.error('updateResumePreview function not found');
    }
}

/**
 * Add an experience item
 */
function addExperienceItem() {
    const experienceItems = document.getElementById('experience-items');
    const itemId = 'experience-' + Date.now();
    
    const experienceItem = document.createElement('div');
    experienceItem.className = 'experience-item';
    experienceItem.innerHTML = `
        <div class="experience-item-header">
            <div class="experience-item-title">New Experience</div>
            <div class="experience-item-actions">
                <button type="button" class="btn btn-danger btn-sm btn-remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="form-group">
            <div class="form-row">
                <div class="form-field">
                    <label for="${itemId}-job-title">Job Title</label>
                    <input type="text" id="${itemId}-job-title" name="jobTitle" placeholder="e.g. Software Engineer">
                </div>
                <div class="form-field">
                    <label for="${itemId}-company">Company</label>
                    <input type="text" id="${itemId}-company" name="company" placeholder="e.g. Acme Inc.">
                </div>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label for="${itemId}-location">Location</label>
                    <input type="text" id="${itemId}-location" name="location" placeholder="e.g. New York, NY">
                </div>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label for="${itemId}-start-date">Start Date</label>
                    <input type="date" id="${itemId}-start-date" name="startDate">
                </div>
                <div class="form-field">
                    <label for="${itemId}-end-date">End Date</label>
                    <input type="date" id="${itemId}-end-date" name="endDate">
                </div>
                <div class="form-field" style="flex: 0.5;">
                    <div class="checkbox-field" style="margin-top: 25px;">
                        <input type="checkbox" id="${itemId}-current-job" name="currentJob">
                        <label for="${itemId}-current-job">Current Job</label>
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-field full-width">
                    <label>Achievements</label>
                    <div class="achievements-container">
                        <!-- Achievement items will be added here -->
                    </div>
                    <button type="button" class="btn btn-secondary btn-sm btn-add-achievement" style="margin-top: 10px;">
                        <i class="fas fa-plus"></i> Add Achievement
                    </button>
                </div>
            </div>
        </div>
    `;
    
    experienceItems.appendChild(experienceItem);
    
    // Add first achievement
    const achievementsContainer = experienceItem.querySelector('.achievements-container');
    addAchievementItem(achievementsContainer);
    
    // Set up current job checkbox
    const currentJobCheckbox = experienceItem.querySelector(`#${itemId}-current-job`);
    const endDateInput = experienceItem.querySelector(`#${itemId}-end-date`);
    
    currentJobCheckbox.addEventListener('change', function() {
        endDateInput.disabled = this.checked;
        if (this.checked) {
            endDateInput.value = '';
        }
    });
    
    // Update preview
    updatePreview();
}

/**
 * Add an achievement item
 */
function addAchievementItem(container) {
    const achievementItem = document.createElement('div');
    achievementItem.className = 'achievement-item';
    achievementItem.innerHTML = `
        <textarea rows="2" placeholder="e.g. Increased sales by 20% through implementation of new marketing strategy"></textarea>
        <button type="button" class="btn btn-danger btn-sm btn-remove">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(achievementItem);
    
    // Update preview
    updatePreview();
}

/**
 * Add an education item
 */
function addEducationItem() {
    const educationItems = document.getElementById('education-items');
    const itemId = 'education-' + Date.now();
    
    const educationItem = document.createElement('div');
    educationItem.className = 'education-item';
    educationItem.innerHTML = `
        <div class="education-item-header">
            <div class="education-item-title">New Education</div>
            <div class="education-item-actions">
                <button type="button" class="btn btn-danger btn-sm btn-remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="form-group">
            <div class="form-row">
                <div class="form-field">
                    <label for="${itemId}-institution">Institution</label>
                    <input type="text" id="${itemId}-institution" name="institution" placeholder="e.g. University of California">
                </div>
                <div class="form-field">
                    <label for="${itemId}-location">Location</label>
                    <input type="text" id="${itemId}-location" name="location" placeholder="e.g. Berkeley, CA">
                </div>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label for="${itemId}-degree">Degree</label>
                    <input type="text" id="${itemId}-degree" name="degree" placeholder="e.g. Bachelor of Science">
                </div>
                <div class="form-field">
                    <label for="${itemId}-field">Field of Study</label>
                    <input type="text" id="${itemId}-field" name="fieldOfStudy" placeholder="e.g. Computer Science">
                </div>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label for="${itemId}-start-date">Start Date</label>
                    <input type="date" id="${itemId}-start-date" name="startDate">
                </div>
                <div class="form-field">
                    <label for="${itemId}-end-date">End Date</label>
                    <input type="date" id="${itemId}-end-date" name="endDate">
                </div>
                <div class="form-field" style="flex: 0.5;">
                    <div class="checkbox-field" style="margin-top: 25px;">
                        <input type="checkbox" id="${itemId}-current-education" name="currentEducation">
                        <label for="${itemId}-current-education">Current</label>
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label for="${itemId}-gpa">GPA</label>
                    <input type="text" id="${itemId}-gpa" name="gpa" placeholder="e.g. 3.8">
                </div>
            </div>
        </div>
    `;
    
    educationItems.appendChild(educationItem);
    
    // Set up current education checkbox
    const currentEducationCheckbox = educationItem.querySelector(`#${itemId}-current-education`);
    const endDateInput = educationItem.querySelector(`#${itemId}-end-date`);
    
    currentEducationCheckbox.addEventListener('change', function() {
        endDateInput.disabled = this.checked;
        if (this.checked) {
            endDateInput.value = '';
        }
    });
    
    // Update preview
    updatePreview();
}

/**
 * Add a skill category
 */
function addSkillCategory() {
    const skillCategories = document.getElementById('skill-categories');
    const itemId = 'skill-category-' + Date.now();
    
    const skillCategory = document.createElement('div');
    skillCategory.className = 'skill-category';
    skillCategory.innerHTML = `
        <div class="skill-category-header">
            <div class="skill-category-title">New Skill Category</div>
            <div class="skill-category-actions">
                <button type="button" class="btn btn-danger btn-sm btn-remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="form-group">
            <div class="form-row">
                <div class="form-field">
                    <label for="${itemId}-name">Category Name</label>
                    <input type="text" id="${itemId}-name" name="categoryName" placeholder="e.g. Technical Skills">
                </div>
            </div>
            <div class="form-row">
                <div class="form-field full-width">
                    <label>Skills</label>
                    <div class="skill-items">
                        <!-- Skill items will be added here -->
                    </div>
                    <button type="button" class="btn btn-secondary btn-sm btn-add-skill" style="margin-top: 10px;">
                        <i class="fas fa-plus"></i> Add Skill
                    </button>
                </div>
            </div>
        </div>
    `;
    
    skillCategories.appendChild(skillCategory);
    
    // Add first skill
    const skillItems = skillCategory.querySelector('.skill-items');
    addSkillItem(skillItems);
    
    // Update preview
    updatePreview();
}

/**
 * Add a skill item
 */
function addSkillItem(container) {
    const skillItem = document.createElement('div');
    skillItem.className = 'skill-item';
    skillItem.innerHTML = `
        <input type="text" placeholder="e.g. JavaScript">
        <button type="button" class="btn btn-danger btn-sm btn-remove">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(skillItem);
    
    // Update preview
    updatePreview();
}

/**
 * Add a certification item
 */
function addCertificationItem() {
    const certificationItems = document.getElementById('certification-items');
    const itemId = 'certification-' + Date.now();
    
    const certificationItem = document.createElement('div');
    certificationItem.className = 'certification-item';
    certificationItem.innerHTML = `
        <div class="certification-item-header">
            <div class="certification-item-title">New Certification</div>
            <div class="certification-item-actions">
                <button type="button" class="btn btn-danger btn-sm btn-remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="form-group">
            <div class="form-row">
                <div class="form-field">
                    <label for="${itemId}-name">Certification Name</label>
                    <input type="text" id="${itemId}-name" name="certificationName" placeholder="e.g. AWS Certified Solutions Architect">
                </div>
                <div class="form-field">
                    <label for="${itemId}-issuer">Issuer</label>
                    <input type="text" id="${itemId}-issuer" name="issuer" placeholder="e.g. Amazon Web Services">
                </div>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label for="${itemId}-issue-date">Issue Date</label>
                    <input type="date" id="${itemId}-issue-date" name="issueDate">
                </div>
                <div class="form-field">
                    <label for="${itemId}-expiration-date">Expiration Date</label>
                    <input type="date" id="${itemId}-expiration-date" name="expirationDate">
                </div>
                <div class="form-field" style="flex: 0.5;">
                    <div class="checkbox-field" style="margin-top: 25px;">
                        <input type="checkbox" id="${itemId}-no-expiration" name="noExpiration">
                        <label for="${itemId}-no-expiration">No Expiration</label>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    certificationItems.appendChild(certificationItem);
    
    // Set up no expiration checkbox
    const noExpirationCheckbox = certificationItem.querySelector(`#${itemId}-no-expiration`);
    const expirationDateInput = certificationItem.querySelector(`#${itemId}-expiration-date`);
    
    noExpirationCheckbox.addEventListener('change', function() {
        expirationDateInput.disabled = this.checked;
        if (this.checked) {
            expirationDateInput.value = '';
        }
    });
    
    // Update preview
    updatePreview();
}

/**
 * Add a project item
 */
function addProjectItem() {
    const projectItems = document.getElementById('project-items');
    const itemId = 'project-' + Date.now();
    
    const projectItem = document.createElement('div');
    projectItem.className = 'project-item';
    projectItem.innerHTML = `
        <div class="project-item-header">
            <div class="project-item-title">New Project</div>
            <div class="project-item-actions">
                <button type="button" class="btn btn-danger btn-sm btn-remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="form-group">
            <div class="form-row">
                <div class="form-field">
                    <label for="${itemId}-name">Project Name</label>
                    <input type="text" id="${itemId}-name" name="projectName" placeholder="e.g. E-commerce Website">
                </div>
                <div class="form-field">
                    <label for="${itemId}-url">Project URL</label>
                    <input type="url" id="${itemId}-url" name="projectUrl" placeholder="e.g. https://www.example.com">
                </div>
            </div>
            <div class="form-row">
                <div class="form-field full-width">
                    <label for="${itemId}-description">Description</label>
                    <textarea id="${itemId}-description" name="projectDescription" rows="3" placeholder="Describe your project..."></textarea>
                </div>
            </div>
        </div>
    `;
    
    projectItems.appendChild(projectItem);
    
    // Update preview
    updatePreview();
}

/**
 * Add a language item
 */
function addLanguageItem() {
    const languageItems = document.getElementById('language-items');
    const itemId = 'language-' + Date.now();
    
    const languageItem = document.createElement('div');
    languageItem.className = 'language-item';
    languageItem.innerHTML = `
        <div class="language-item-field">
            <label for="${itemId}-language">Language</label>
            <input type="text" id="${itemId}-language" name="language" placeholder="e.g. English">
        </div>
        <div class="language-item-field">
            <label for="${itemId}-proficiency">Proficiency</label>
            <select id="${itemId}-proficiency" name="proficiency">
                <option value="Native">Native</option>
                <option value="Fluent">Fluent</option>
                <option value="Advanced">Advanced</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Basic">Basic</option>
            </select>
        </div>
        <div class="language-item-actions">
            <button type="button" class="btn btn-danger btn-sm btn-remove">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    languageItems.appendChild(languageItem);
    
    // Update preview
    updatePreview();
}

/**
 * Add a reference item
 */
function addReferenceItem() {
    const referenceItems = document.getElementById('reference-items');
    const itemId = 'reference-' + Date.now();
    
    const referenceItem = document.createElement('div');
    referenceItem.className = 'reference-item';
    referenceItem.innerHTML = `
        <div class="reference-item-header">
            <div class="reference-item-title">New Reference</div>
            <div class="reference-item-actions">
                <button type="button" class="btn btn-danger btn-sm btn-remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="form-group">
            <div class="form-row">
                <div class="form-field">
                    <label for="${itemId}-name">Name</label>
                    <input type="text" id="${itemId}-name" name="refName" placeholder="e.g. John Smith">
                </div>
                <div class="form-field">
                    <label for="${itemId}-position">Position</label>
                    <input type="text" id="${itemId}-position" name="refPosition" placeholder="e.g. Manager">
                </div>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label for="${itemId}-email">Email</label>
                    <input type="email" id="${itemId}-email" name="refEmail" placeholder="e.g. john.smith@example.com">
                </div>
                <div class="form-field">
                    <label for="${itemId}-phone">Phone</label>
                    <input type="tel" id="${itemId}-phone" name="refPhone" placeholder="e.g. (555) 123-4567">
                </div>
            </div>
        </div>
    `;
    
    referenceItems.appendChild(referenceItem);
    
    // Update preview
    updatePreview();
}

// Export functions
export {
    addExperienceItem,
    addAchievementItem,
    addEducationItem,
    addSkillCategory,
    addSkillItem,
    addCertificationItem,
    addProjectItem,
    addLanguageItem,
    addReferenceItem
};
