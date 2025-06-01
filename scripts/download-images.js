const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  { name: 'hero-bg.jpg', width: 1920, height: 1080 },
  { name: 'jazz.jpg', width: 800, height: 600 },
  { name: 'theater.jpg', width: 800, height: 600 },
  { name: 'festival.jpg', width: 800, height: 600 },
  { name: 'rock.jpg', width: 800, height: 600 },
  { name: 'symphony.jpg', width: 800, height: 600 },
  { name: 'acoustic.jpg', width: 800, height: 600 }
];

const imagesDir = path.join(__dirname, '../src/assets/images');

// Create images directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Download images from Picsum
images.forEach((image, index) => {
  const imageUrl = `https://picsum.photos/${image.width}/${image.height}?random=${index}`;
  const filePath = path.join(imagesDir, image.name);
  
  https.get(imageUrl, (response) => {
    const fileStream = fs.createWriteStream(filePath);
    response.pipe(fileStream);
    
    fileStream.on('finish', () => {
      console.log(`Downloaded ${image.name}`);
      fileStream.close();
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${image.name}:`, err.message);
  });
}); 