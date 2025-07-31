// Simple test script to verify the upload endpoint
// Run this after starting your server with: node test-upload.js

const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

async function testImageUpload() {
  try {
    // You'll need to replace these with actual values
    const projectId = 'your-project-id';
    const token = 'your-jwt-token';
    const imagePath = './test-image.jpg'; // Path to a test image
    
    // Check if test image exists
    if (!fs.existsSync(imagePath)) {
      console.log('Please create a test image file at:', imagePath);
      return;
    }

    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));
    formData.append('type', 'EXTERIOR');
    formData.append('caption', 'Test image upload');

    const response = await fetch(`http://localhost:3000/projects/${projectId}/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Upload successful!');
      console.log('Image URL:', result.url);
      console.log('File size:', result.fileSize);
      console.log('MIME type:', result.mimeType);
    } else {
      const error = await response.text();
      console.log('❌ Upload failed:', response.status, error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Uncomment to run the test
// testImageUpload();

console.log('Test script ready. Update the variables and uncomment the function call to test.');