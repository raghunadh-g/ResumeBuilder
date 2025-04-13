/**
 * Resume Builder - Analyzer JavaScript
 * Handles job description analysis and smart suggestions
 */

import { collectResumeData } from './preview.js';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up analyzer functionality
    setupAnalyzer();
});

/**
 * Set up analyzer functionality
 */
function setupAnalyzer() {
    // Set up job description analysis
    setupJobDescriptionAnalysis();
    
    // Set up smart suggestions
    setupSmartSuggestions();
}

/**
 * Set up job description analysis
 */
function setupJobDescriptionAnalysis() {
    const analyzeButton = document.getElementById('analyze-job-description');
    const jobDescriptionTextarea = document.getElementById('job-description');
    
    if (analyzeButton && jobDescriptionTextarea) {
        analyzeButton.addEventListener('click', function() {
            const jobDescription = jobDescriptionTextarea.value.trim();
            
            if (jobDescription) {
                analyzeJobDescription(jobDescription);
            } else {
                alert('Please enter a job description to analyze.');
            }
        });
    }
}

/**
 * Analyze job description
 * @param {string} jobDescription - The job description to analyze
 */
function analyzeJobDescription(jobDescription) {
    // Show loading indicator
    showLoadingIndicator('Analyzing job description...');
    
    try {
        // Extract keywords from job description
        const keywords = extractKeywords(jobDescription);
        
        // Extract skills from job description
        const skills = extractSkills(jobDescription);
        
        // Extract requirements from job description
        const requirements = extractRequirements(jobDescription);
        
        // Calculate resume match score
        const resumeData = collectResumeData();
        const matchScore = calculateMatchScore(resumeData, keywords, skills, requirements);
        
        // Generate optimization tips
        const optimizationTips = generateOptimizationTips(resumeData, keywords, skills, requirements);
        
        // Display analysis results
        displayAnalysisResults(keywords, skills, requirements, matchScore, optimizationTips);
        
        // Hide loading indicator
        hideLoadingIndicator();
    } catch (error) {
        console.error('Error analyzing job description:', error);
        hideLoadingIndicator();
        alert('There was an error analyzing the job description. Please try again.');
    }
}

/**
 * Extract keywords from job description
 * @param {string} jobDescription - The job description
 * @returns {Array} - The extracted keywords
 */
function extractKeywords(jobDescription) {
    // Common keywords to ignore
    const commonWords = [
        'a', 'an', 'the', 'and', 'or', 'but', 'for', 'nor', 'on', 'at', 'to', 'from', 'by',
        'about', 'as', 'in', 'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'may',
        'might', 'must', 'can', 'could', 'this', 'that', 'these', 'those', 'we', 'you', 'they',
        'he', 'she', 'it', 'i', 'me', 'my', 'mine', 'your', 'yours', 'his', 'her', 'hers', 'its',
        'our', 'ours', 'their', 'theirs'
    ];
    
    // Split job description into words
    const words = jobDescription.toLowerCase()
        .replace(/[^\w\s]/g, ' ')  // Replace punctuation with spaces
        .split(/\s+/)              // Split by whitespace
        .filter(word => word.length > 2 && !commonWords.includes(word));  // Filter out common words and short words
    
    // Count word frequency
    const wordFrequency = {};
    words.forEach(word => {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
    
    // Sort words by frequency
    const sortedWords = Object.keys(wordFrequency).sort((a, b) => wordFrequency[b] - wordFrequency[a]);
    
    // Return top keywords (up to 20)
    return sortedWords.slice(0, 20);
}

/**
 * Extract skills from job description
 * @param {string} jobDescription - The job description
 * @returns {Object} - The extracted skills by category
 */
function extractSkills(jobDescription) {
    const jobDescLower = jobDescription.toLowerCase();
    
    // Define skill categories and their keywords
    const skillCategories = {
        'Technical Skills': [
            'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'go',
            'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring', 'laravel',
            'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind', 'jquery', 'typescript',
            'sql', 'mysql', 'postgresql', 'mongodb', 'firebase', 'redis', 'oracle', 'nosql',
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'github', 'gitlab',
            'ci/cd', 'rest', 'graphql', 'api', 'microservices', 'serverless', 'cloud'
        ],
        'Soft Skills': [
            'communication', 'teamwork', 'collaboration', 'leadership', 'problem solving',
            'critical thinking', 'analytical', 'creativity', 'innovation', 'adaptability',
            'flexibility', 'time management', 'organization', 'attention to detail', 'multitasking',
            'decision making', 'conflict resolution', 'negotiation', 'persuasion', 'presentation'
        ],
        'Tools & Software': [
            'microsoft office', 'word', 'excel', 'powerpoint', 'outlook', 'access', 'visio',
            'adobe', 'photoshop', 'illustrator', 'indesign', 'xd', 'figma', 'sketch', 'invision',
            'jira', 'confluence', 'trello', 'asana', 'monday', 'notion', 'slack', 'teams', 'zoom'
        ]
    };
    
    // Find skills in job description
    const foundSkills = {};
    
    Object.keys(skillCategories).forEach(category => {
        const skills = skillCategories[category].filter(skill => 
            jobDescLower.includes(skill) || 
            jobDescLower.includes(skill.replace(' ', '-')) || 
            jobDescLower.includes(skill.replace(' ', ''))
        );
        
        if (skills.length > 0) {
            foundSkills[category] = skills;
        }
    });
    
    return foundSkills;
}

/**
 * Extract requirements from job description
 * @param {string} jobDescription - The job description
 * @returns {Object} - The extracted requirements
 */
function extractRequirements(jobDescription) {
    const requirements = {
        education: [],
        experience: [],
        skills: []
    };
    
    // Extract education requirements
    const educationKeywords = ['degree', 'bachelor', 'master', 'phd', 'mba', 'diploma', 'certificate'];
    const educationRegex = new RegExp(`(${educationKeywords.join('|')})\\s+(?:in|of|\\w+\\s+in)\\s+([\\w\\s]+)`, 'gi');
    let match;
    
    while ((match = educationRegex.exec(jobDescription)) !== null) {
        requirements.education.push(match[0]);
    }
    
    // Extract experience requirements
    const experienceRegex = /(\d+)[\+]?\s+(?:years?|yrs?)(?:\s+of)?\s+experience/gi;
    while ((match = experienceRegex.exec(jobDescription)) !== null) {
        requirements.experience.push(match[0]);
    }
    
    return requirements;
}

/**
 * Calculate resume match score
 * @param {Object} resumeData - The resume data
 * @param {Array} keywords - The extracted keywords
 * @param {Object} skills - The extracted skills
 * @param {Object} requirements - The extracted requirements
 * @returns {Object} - The match score
 */
function calculateMatchScore(resumeData, keywords, skills, requirements) {
    let keywordMatches = 0;
    let skillMatches = 0;
    let requirementMatches = 0;
    
    // Check keyword matches
    const resumeText = JSON.stringify(resumeData).toLowerCase();
    keywords.forEach(keyword => {
        if (resumeText.includes(keyword.toLowerCase())) {
            keywordMatches++;
        }
    });
    
    // Check skill matches
    let totalSkills = 0;
    Object.values(skills).forEach(skillList => {
        totalSkills += skillList.length;
        
        skillList.forEach(skill => {
            if (resumeText.includes(skill.toLowerCase())) {
                skillMatches++;
            }
        });
    });
    
    // Calculate scores
    const keywordScore = keywords.length > 0 ? (keywordMatches / keywords.length) * 100 : 100;
    const skillScore = totalSkills > 0 ? (skillMatches / totalSkills) * 100 : 100;
    const requirementScore = (requirements.education.length + requirements.experience.length) > 0 ? 
        (requirementMatches / (requirements.education.length + requirements.experience.length)) * 100 : 100;
    
    // Calculate overall score
    const overallScore = (keywordScore * 0.3) + (skillScore * 0.4) + (requirementScore * 0.3);
    
    return {
        overall: Math.round(overallScore),
        keywords: Math.round(keywordScore),
        skills: Math.round(skillScore),
        requirements: Math.round(requirementScore)
    };
}

/**
 * Generate optimization tips
 * @param {Object} resumeData - The resume data
 * @param {Array} keywords - The extracted keywords
 * @param {Object} skills - The extracted skills
 * @param {Object} requirements - The extracted requirements
 * @returns {Object} - The optimization tips
 */
function generateOptimizationTips(resumeData, keywords, skills, requirements) {
    const tips = {
        summary: [],
        experience: [],
        skills: [],
        education: [],
        general: []
    };
    
    // Resume text for checking
    const resumeText = JSON.stringify(resumeData).toLowerCase();
    
    // Check for missing keywords
    const missingKeywords = keywords.filter(keyword => !resumeText.includes(keyword.toLowerCase()));
    if (missingKeywords.length > 0) {
        tips.general.push(`Consider adding these keywords to your resume: ${missingKeywords.join(', ')}`);
    }
    
    // Check for missing skills
    const missingSkills = {};
    Object.keys(skills).forEach(category => {
        const missing = skills[category].filter(skill => !resumeText.includes(skill.toLowerCase()));
        if (missing.length > 0) {
            missingSkills[category] = missing;
        }
    });
    
    if (Object.keys(missingSkills).length > 0) {
        Object.keys(missingSkills).forEach(category => {
            tips.skills.push(`Add these ${category}: ${missingSkills[category].join(', ')}`);
        });
    }
    
    // General tips
    tips.general.push('Ensure your resume is ATS-friendly by using standard section headings and avoiding complex formatting');
    tips.general.push('Tailor your resume for each job application to match the specific requirements');
    
    return tips;
}

/**
 * Display analysis results
 * @param {Array} keywords - The extracted keywords
 * @param {Object} skills - The extracted skills
 * @param {Object} requirements - The extracted requirements
 * @param {Object} matchScore - The match score
 * @param {Object} optimizationTips - The optimization tips
 */
function displayAnalysisResults(keywords, skills, requirements, matchScore, optimizationTips) {
    // Get results container
    const resultsContainer = document.getElementById('analysis-results');
    if (!resultsContainer) return;
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Create results HTML
    let html = `
        <div class="analysis-section">
            <h3>Match Score</h3>
            <div class="match-score">
                <div class="score-circle" style="--score: ${matchScore.overall}%">
                    <span class="score-value">${matchScore.overall}%</span>
                </div>
                <div class="score-details">
                    <div class="score-item">
                        <span class="score-label">Keywords:</span>
                        <span class="score-value">${matchScore.keywords}%</span>
                        <div class="score-bar">
                            <div class="score-bar-fill" style="width: ${matchScore.keywords}%"></div>
                        </div>
                    </div>
                    <div class="score-item">
                        <span class="score-label">Skills:</span>
                        <span class="score-value">${matchScore.skills}%</span>
                        <div class="score-bar">
                            <div class="score-bar-fill" style="width: ${matchScore.skills}%"></div>
                        </div>
                    </div>
                    <div class="score-item">
                        <span class="score-label">Requirements:</span>
                        <span class="score-value">${matchScore.requirements}%</span>
                        <div class="score-bar">
                            <div class="score-bar-fill" style="width: ${matchScore.requirements}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="analysis-section">
            <h3>Key Requirements</h3>
            <div class="requirements-list">
    `;
    
    // Add skills
    if (Object.keys(skills).length > 0) {
        html += `<h4>Skills</h4><ul>`;
        Object.keys(skills).forEach(category => {
            html += `<li><strong>${category}:</strong> ${skills[category].join(', ')}</li>`;
        });
        html += `</ul>`;
    }
    
    // Add education requirements
    if (requirements.education.length > 0) {
        html += `<h4>Education</h4><ul>`;
        requirements.education.forEach(edu => {
            html += `<li>${edu}</li>`;
        });
        html += `</ul>`;
    }
    
    // Add experience requirements
    if (requirements.experience.length > 0) {
        html += `<h4>Experience</h4><ul>`;
        requirements.experience.forEach(exp => {
            html += `<li>${exp}</li>`;
        });
        html += `</ul>`;
    }
    
    html += `
            </div>
        </div>
        
        <div class="analysis-section">
            <h3>Important Keywords</h3>
            <div class="keywords-cloud">
    `;
    
    // Add keywords
    keywords.forEach(keyword => {
        const resumeText = JSON.stringify(collectResumeData()).toLowerCase();
        const isMatched = resumeText.includes(keyword.toLowerCase());
        html += `<span class="keyword ${isMatched ? 'matched' : ''}">${keyword}</span>`;
    });
    
    html += `
            </div>
        </div>
        
        <div class="analysis-section">
            <h3>Optimization Tips</h3>
            <div class="tips-list">
    `;
    
    // Add summary tips
    if (optimizationTips.summary.length > 0) {
        html += `<h4>Summary</h4><ul>`;
        optimizationTips.summary.forEach(tip => {
            html += `<li>${tip}</li>`;
        });
        html += `</ul>`;
    }
    
    // Add experience tips
    if (optimizationTips.experience.length > 0) {
        html += `<h4>Experience</h4><ul>`;
        optimizationTips.experience.forEach(tip => {
            html += `<li>${tip}</li>`;
        });
        html += `</ul>`;
    }
    
    // Add skills tips
    if (optimizationTips.skills.length > 0) {
        html += `<h4>Skills</h4><ul>`;
        optimizationTips.skills.forEach(tip => {
            html += `<li>${tip}</li>`;
        });
        html += `</ul>`;
    }
    
    // Add education tips
    if (optimizationTips.education.length > 0) {
        html += `<h4>Education</h4><ul>`;
        optimizationTips.education.forEach(tip => {
            html += `<li>${tip}</li>`;
        });
        html += `</ul>`;
    }
    
    // Add general tips
    if (optimizationTips.general.length > 0) {
        html += `<h4>General</h4><ul>`;
        optimizationTips.general.forEach(tip => {
            html += `<li>${tip}</li>`;
        });
        html += `</ul>`;
    }
    
    html += `
            </div>
        </div>
    `;
    
    // Set results HTML
    resultsContainer.innerHTML = html;
    
    // Show results container
    resultsContainer.style.display = 'block';
}

/**
 * Set up smart suggestions
 */
function setupSmartSuggestions() {
    // Action verb categories
    const actionVerbs = {
        'Leadership': [
            'Led', 'Managed', 'Directed', 'Supervised', 'Coordinated', 'Oversaw', 'Guided',
            'Mentored', 'Trained', 'Coached', 'Delegated', 'Facilitated', 'Chaired'
        ],
        'Achievement': [
            'Achieved', 'Attained', 'Completed', 'Delivered', 'Earned', 'Exceeded', 'Outperformed',
            'Surpassed', 'Won', 'Secured', 'Qualified', 'Produced', 'Reduced', 'Increased'
        ],
        'Communication': [
            'Communicated', 'Presented', 'Articulated', 'Authored', 'Corresponded', 'Documented',
            'Edited', 'Interpreted', 'Negotiated', 'Persuaded', 'Promoted', 'Publicized'
        ],
        'Analysis': [
            'Analyzed', 'Assessed', 'Calculated', 'Diagnosed', 'Evaluated', 'Examined',
            'Identified', 'Investigated', 'Measured', 'Researched', 'Reviewed', 'Studied'
        ],
        'Creation': [
            'Created', 'Built', 'Constructed', 'Designed', 'Developed', 'Engineered', 'Established',
            'Formulated', 'Founded', 'Implemented', 'Initiated', 'Introduced', 'Launched'
        ],
        'Improvement': [
            'Improved', 'Advanced', 'Boosted', 'Enhanced', 'Expanded', 'Optimized', 'Refined',
            'Revamped', 'Revitalized', 'Simplified', 'Streamlined', 'Strengthened', 'Transformed'
        ]
    };
    
    // Add action verb suggestions to achievement textareas
    document.addEventListener('click', function(e) {
        if (e.target && e.target.tagName === 'TEXTAREA' && e.target.closest('.achievement-item')) {
            // Show action verb suggestions
            console.log('Show action verb suggestions');
        }
    });
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
