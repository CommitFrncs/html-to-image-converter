/**
 * HTML to Image Converter - Frontend Logic
 * 
 * Handles user interactions, communicates with backend API,
 * and displays results. No API keys are stored here.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const htmlInput = document.getElementById('html-input');
    const cssInput = document.getElementById('css-input');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const generateBtn = document.getElementById('generate-btn');
    const btnText = generateBtn.querySelector('.btn-text');
    const btnLoader = generateBtn.querySelector('.btn-loader');
    const resultSection = document.getElementById('result-section');
    const resultImage = document.getElementById('result-image');
    const downloadBtn = document.getElementById('download-btn');
    const newBtn = document.getElementById('new-btn');
    const errorMessage = document.getElementById('error-message');

    // API endpoint (relative URL - works both locally and deployed)
    const API_URL = '/api/generate';

    // Generate Image Handler
    generateBtn.addEventListener('click', async () => {
        // Get input values
        const html = htmlInput.value.trim();
        const css = cssInput.value.trim();
        const width = parseInt(widthInput.value) || 800;
        const height = parseInt(heightInput.value) || 600;

        // Validation
        if (!html) {
            showError('Please enter some HTML code');
            return;
        }

        // Clear previous errors
        hideError();

        // Show loading state
        setLoading(true);

        try {
            // Send request to our backend (not directly to external API)
            // This keeps the API key secure
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    html: html,
                    css: css,
                    width: width,
                    height: height
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate image');
            }

            // Display result
            displayResult(data.imageUrl);

        } catch (error) {
            console.error('Error:', error);
            showError(error.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    });

    // Create New Button Handler
    newBtn.addEventListener('click', () => {
        // Hide result section
        resultSection.classList.add('hidden');
        
        // Clear inputs
        htmlInput.value = '';
        cssInput.value = '';
        widthInput.value = '800';
        heightInput.value = '600';
        
        // Focus on HTML input
        htmlInput.focus();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Display generated image
    function displayResult(imageUrl) {
        resultImage.src = imageUrl;
        downloadBtn.href = imageUrl;
        
        // Generate filename based on timestamp
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        downloadBtn.download = `generated-image-${timestamp}.png`;
        
        // Show result section with animation
        resultSection.classList.remove('hidden');
        
        // Scroll to result
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Loading state management
    function setLoading(isLoading) {
        generateBtn.disabled = isLoading;
        btnText.classList.toggle('hidden', isLoading);
        btnLoader.classList.toggle('hidden', !isLoading);
    }

    // Error handling
    function showError(message) {
        errorMessage.textContent = `⚠️ ${message}`;
        errorMessage.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(hideError, 5000);
    }

    function hideError() {
        errorMessage.classList.add('hidden');
    }

    // Add example code on first load (optional helper)
    function loadExample() {
        if (!htmlInput.value && !cssInput.value) {
            htmlInput.value = `<div class="card">
  <h1>Hello World! 🌍</h1>
  <p>This is a sample card generated from HTML/CSS</p>
  <button>Click me!</button>
</div>`;
            
            cssInput.value = `.card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

h1 {
  margin: 0 0 10px 0;
  font-size: 2.5em;
}

p {
  font-size: 1.2em;
  opacity: 0.9;
  margin-bottom: 20px;
}

button {
  background: white;
  color: #667eea;
  border: none;
  padding: 12px 30px;
  font-size: 1em;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
}`;
        }
    }

    // Uncomment to load example on startup
    // loadExample();
});