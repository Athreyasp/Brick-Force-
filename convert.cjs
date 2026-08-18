const sharp = require('sharp');

sharp('./src/assets/manjunath.avif')
  .png()
  .toFile('./src/assets/manjunath.png')
  .then(info => {
    console.log('Conversion successful:', info);
  })
  .catch(err => {
    console.error('Error during conversion:', err);
  });
