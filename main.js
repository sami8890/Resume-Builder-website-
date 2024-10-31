"use strict";
// Get references to the form and display area
const form = document.getElementById('resumeForm');
const resumeDisplayElement = document.getElementById('resumeOutput');
const copyUrlButton = document.getElementById('copy-url-button');
const downloadPdfButton = document.getElementById('download-pdf-button');
// Make the form visible by default (remove any code that hides it)
form.style.display = 'block';
// Create an "Edit Resume" button to toggle back to editing mode
const editResumeButton = document.createElement('button');
editResumeButton.innerText = 'Edit Resume';
editResumeButton.style.display = 'none'; // Hidden initially
resumeDisplayElement.appendChild(editResumeButton);
// Function to generate a unique ID (for use in the URL)
function generateUniqueId() {
    return 'resume_' + Date.now();
}
// Handle form submission
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent page reload
    // Collect input values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const degree = document.getElementById('degree').value.trim();
    const institution = document.getElementById('institution').value.trim();
    const jobTitle = document.getElementById('jobTitle').value.trim();
    const company = document.getElementById('company').value.trim();
    const skills = document.getElementById('skills').value.trim();
    if (!name || !email || !degree || !institution || !jobTitle || !company || !skills) {
        alert('Please fill in all fields');
        return;
    }
    // Save form data in localStorage with a unique ID as the key
    const resumeData = {
        name,
        email,
        degree,
        institution,
        jobTitle,
        company,
        skills
    };
    const uniqueId = generateUniqueId();
    localStorage.setItem(uniqueId, JSON.stringify(resumeData));
    // Generate the resume content dynamically
    const resumeHTML = `
        <h2>Your Resume</h2><br>
        <p><b>Name:</b> ${name}</p><br>
        <p><b>Email:</b> ${email}</p><br>
        <h3>Education</h3><br>
        <p><b>Degree:</b> ${degree}</p><br>
        <p><b>Institution:</b> ${institution}</p><br>
        <h3>Work Experience</h3><br>
        <p><b>Job Title:</b> ${jobTitle}</p>
        <p><b>Company:</b> ${company}</p><br>
        <h3>Skills</h3>
        <p>${skills}</p>
    `;
    // Display the generated resume and show the "Edit Resume" button
    resumeDisplayElement.innerHTML = resumeHTML;
    editResumeButton.style.display = 'block';
    resumeDisplayElement.style.display = 'block'; // Show resume output
    form.style.display = 'none'; // Hide the form
    // Generate a shareable URL with the unique ID
    const shareableURL = `${window.location.origin}?id=${encodeURIComponent(uniqueId)}`;
    // Show and configure buttons
    copyUrlButton.style.display = 'block';
    downloadPdfButton.style.display = 'block';
    // Update the button event listeners
    updateButtonListeners(shareableURL);
});
// Function to update button event listeners 
function updateButtonListeners(shareableURL) {
    // Handle URL copy
    copyUrlButton.removeEventListener('click', copyUrlHandler); // Remove old listener
    copyUrlButton.addEventListener('click', copyUrlHandler);
    // Handle PDF download
    downloadPdfButton.removeEventListener('click', downloadPdfHandler); // Remove old listener
    downloadPdfButton.addEventListener('click', downloadPdfHandler);
    function copyUrlHandler() {
        navigator.clipboard.writeText(shareableURL).then(() => {
            alert('URL copied to clipboard');
        }).catch((err) => {
            console.error('Failed to copy URL: ', err);
        });
    }
    function downloadPdfHandler() {
        html2pdf().from(resumeDisplayElement).save('resume.pdf');
    }
}
// Event listener for editing the resume
editResumeButton.addEventListener('click', () => {
    // Show the form and hide the displayed resume
    form.style.display = 'block';
    resumeDisplayElement.style.display = 'none';
    editResumeButton.style.display = 'none';
    // Populate the form fields with the saved data
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
        const savedResumeData = localStorage.getItem(id);
        if (savedResumeData) {
            const resumeData = JSON.parse(savedResumeData);
            document.getElementById('name').value = resumeData.name;
            document.getElementById('email').value = resumeData.email;
            document.getElementById('degree').value = resumeData.degree;
            document.getElementById('institution').value = resumeData.institution;
            document.getElementById('jobTitle').value = resumeData.jobTitle;
            document.getElementById('company').value = resumeData.company;
            document.getElementById('skills').value = resumeData.skills;
        }
    }
});
// Prefill the form based on the unique ID in the URL
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
        // Autofill form if data is found in localStorage
        const savedResumeData = localStorage.getItem(id);
        if (savedResumeData) {
            const resumeData = JSON.parse(savedResumeData);
            document.getElementById('name').value = resumeData.name;
            document.getElementById('email').value = resumeData.email;
            document.getElementById('degree').value = resumeData.degree;
            document.getElementById('institution').value = resumeData.institution;
            document.getElementById('jobTitle').value = resumeData.jobTitle;
            document.getElementById('company').value = resumeData.company;
            document.getElementById('skills').value = resumeData.skills;
        }
    }
});
