// Function to update the current date
function updateDate() {
    const dateElement = document.getElementById('current-date');
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    dateElement.textContent = now.toLocaleDateString('en-US', options);
}

// Function to handle bullet points
function handleBulletPoints(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const textarea = event.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        
        // Get the current line
        const beforeCursor = value.substring(0, start);
        const lastNewLine = beforeCursor.lastIndexOf('\n');
        const currentLine = beforeCursor.substring(lastNewLine + 1);
        
        // Check if current line starts with asterisk
        const hasAsterisk = currentLine.trim().startsWith('*');
        
        // Insert new line with asterisk
        textarea.value = value.substring(0, start) + '\n' + (hasAsterisk ? '* ' : '') + value.substring(end);
        
        // Move cursor to the new line
        textarea.selectionStart = textarea.selectionEnd = start + (hasAsterisk ? 3 : 1);
    }
}

// Function to save the journal entry
function saveEntry() {
    const headline = document.getElementById('headline').value;
    const entry = document.getElementById('journal-entry').value;
    const date = document.getElementById('current-date').textContent;
    
    const journalData = {
        date: date,
        headline: headline,
        entry: entry
    };
    
    // Save to localStorage
    localStorage.setItem('journalEntry', JSON.stringify(journalData));
    
    // Show save confirmation
    alert('Entry saved successfully!');
}

// Function to load saved entry
function loadSavedEntry() {
    const savedData = localStorage.getItem('journalEntry');
    if (savedData) {
        const journalData = JSON.parse(savedData);
        document.getElementById('headline').value = journalData.headline;
        document.getElementById('journal-entry').value = journalData.entry;
    }
}

// Function to export to PDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const headline = document.getElementById('headline').value;
    const entry = document.getElementById('journal-entry').value;
    const date = document.getElementById('current-date').textContent;
    
    // Add content to PDF
    doc.setFontSize(16);
    doc.text(headline || 'Untitled Entry', 20, 20);
    
    doc.setFontSize(12);
    doc.text(date, 20, 30);
    
    doc.setFontSize(11);
    const splitText = doc.splitTextToSize(entry, 170);
    doc.text(splitText, 20, 40);
    
    // Save the PDF
    doc.save('journal-entry.pdf');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    loadSavedEntry();
    
    // Update date every minute
    setInterval(updateDate, 60000);
    
    // Save button click event
    document.getElementById('save-btn').addEventListener('click', saveEntry);
    
    // PDF export button click event
    document.getElementById('pdf-btn').addEventListener('click', exportToPDF);
    
    // Bullet point functionality
    document.getElementById('journal-entry').addEventListener('keydown', handleBulletPoints);
}); 