# ATS-Friendly Resume Builder

A comprehensive web application for creating professional, ATS-friendly resumes with job description analysis and smart suggestions.

## Features

### Core Functionality
- Input and manage professional data:
  - Personal details (name, contact, professional summary)
  - Education history with detailed academic credentials
  - Work experience with accomplishment-focused descriptions
  - Skills categorized by type (technical, soft skills, tools)
  - Certifications and additional qualifications
  - Projects and achievements

### Template System
- Multiple resume template categories:
  - Professional (traditional, corporate-focused)
  - Modern (clean, minimalist designs)
  - Creative (for design/creative industries)
- Each template is:
  - Fully ATS-compliant with proper HTML markup
  - Supports custom color schemes and fonts
  - Maintains consistent spacing and formatting
  - Allows section reordering
  - Exports to PDF and Word formats

### Smart Features
- Job description analysis:
  - Extract key requirements and skills
  - Suggest relevant keywords to include
  - Provide section-specific optimization tips
  - Score resume match against job description
- Smart suggestions:
  - Action verb recommendations
  - Bullet point phrasing improvements
  - Skills gap analysis
  - Industry-specific keyword recommendations

### ATS Optimization
- Proper formatting:
  - Clean, parseable text
  - Standard section headings
  - Proper heading hierarchy
  - No tables or complex formatting
- Keyword optimization:
  - Industry-standard terminology
  - Role-specific skill matching
  - Proper keyword density
  - Format verification

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/resume-builder.git
   cd resume-builder
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

1. **Editor**: Fill in your personal details, work experience, education, skills, and other sections.
2. **Templates**: Choose from various ATS-friendly resume templates.
3. **ATS Analyzer**: Paste a job description to analyze how well your resume matches the requirements.
4. **ATS Tips**: Learn best practices for creating ATS-friendly resumes.
5. **Export**: Download your resume as PDF or DOCX.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- External Libraries:
  - html2canvas (for PDF export)
  - jsPDF (for PDF generation)
  - docx (for DOCX generation)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
