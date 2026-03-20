/**
 * HTML to Image Converter - Backend Server
 * 
 * This server acts as a proxy to protect the API key.
 * All external API calls go through this backend.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve frontend files

// API endpoint to generate image from HTML/CSS
// This keeps the API key secure on the server side
app.post('/api/generate', async (req, res) => {
    try {
        const { html, css, width = 800, height = 600 } = req.body;

        // Validate input
        if (!html) {
            return res.status(400).json({ 
                error: 'HTML content is required' 
            });
        }

        // Call HTML/CSS to Image API
        // API key is safely stored in environment variable, never exposed to frontend
        const response = await fetch('https://hcti.io/v1/image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.HTML_TO_IMAGE_API_KEY}`
            },
            body: JSON.stringify({
                html: html,
                css: css || '',
                width: width,
                height: height,
                // Optional: configure device scale for retina displays
                device_scale: 2
            })
        });

        const data = await response.json();

        // Handle API errors
        if (!response.ok) {
            console.error('API Error:', data);
            return res.status(response.status).json({ 
                error: data.message || 'Failed to generate image' 
            });
        }

        // Return the image URL to the frontend
        res.json({
            success: true,
            imageUrl: data.url,
            imageId: data.id
        });

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ 
            error: 'Internal server error. Please try again.' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📁 Serving static files from /public`);
    console.log(`🔒 API key loaded: ${process.env.HTML_TO_IMAGE_API_KEY ? 'YES' : 'NO'}`);
});
