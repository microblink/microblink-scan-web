import jsQR from 'jsqr';

// TODO: for better erformance decode files with UPNG.js and jpeg-js
export const blobQRCodeReader = (blob) => {
  return new Promise((resolve, reject) => {

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext("2d");

    const img = new Image;
    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, img.width, img.height)
        console.log('started qr')
        const code = jsQR(imageData.data, img.width, img.height)
        console.log('finished qr')

        console.log(code)

        if (code) {
          resolve(code)
        } else {
          reject(new Error('QR code decode failed'))
        }
    }
    img.onerror = () => {
      reject(new Error('Image load failed'))
    }
    img.src = URL.createObjectURL(blob);

  });
}