export interface IFixedImage {
  orientation: number,
  src: string
}

/**
 * Convert image as blob to the base64 with exif orientation info or create new base64 image depends on the exif orientation
 * @param image is File object as blob 
 * @param resetBase64 is flag which describes does it should be generated new image
 * @param observer 
 */
export const fixImageOrientation = (image: Blob, resetBase64: boolean, observer, maxDimension = 0) => {
  imageOrientation(image, (imageAsBase64, imageOrientation) => {

      if (resetBase64) {
          resetOrientation(imageAsBase64, imageOrientation, (resetImageAsBase64) => {
              observer.next({
                  orientation: imageOrientation,
                  src: resetImageAsBase64
              })
              observer.complete()
          }, maxDimension)

      } else {
          observer.next({
              orientation: imageOrientation,
              src: imageAsBase64
          })
          observer.complete()
      }
      
  })
};


/**
 * Convert array buffer to the base64
 * @param buffer is array of bytes
 */
const _arrayBufferToBase64 = ( buffer ) => {
  let binary = ''
  const bytes = new Uint8Array( buffer )
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode( bytes[ i ] )
  }
  return window.btoa( binary )
}

/**
 * Detect exif orientation
 * @param file is file object
 * @param callback returns image as base64 encoded and it's exif orientation
 */
const imageOrientation = (file, callback) => {
  const fileReader = new FileReader();
  fileReader.onloadend = () => {
      const base64img = `data:${file.type};base64,${_arrayBufferToBase64(fileReader.result)}`;
      // @ts-ignore: Type 'string' is not assignable to type 'ArrayBuffer | SharedArrayBuffer'
      const scanner = new DataView(fileReader.result);
      let idx = 0;
      let value = 1; // Non-rotated is the default
      // @ts-ignore: Property 'length' does not exist on type 'string | ArrayBuffer'
      if (fileReader.result.length < 2 || scanner.getUint16(idx) != 0xFFD8) {
          // Not a JPEG
          if (callback) {
              callback(base64img, value);
          }
          return;
      }
      idx += 2;
      let maxBytes = scanner.byteLength;
      let littleEndian = false;
      while (idx < maxBytes - 2) {
          const uint16 = scanner.getUint16(idx, littleEndian);
          idx += 2;
          switch (uint16) {
              case 0xFFE1: // Start of EXIF
                  const endianNess = scanner.getUint16(idx + 8);
                  // II (0x4949) Indicates Intel format - Little Endian
                  // MM (0x4D4D) Indicates Motorola format - Big Endian
                  if (endianNess === 0x4949) {
                      littleEndian = true;
                  }
                  const exifLength = scanner.getUint16(idx, littleEndian);
                  maxBytes = exifLength - idx;
                  idx += 2;
                  break;
              case 0x0112: // Orientation tag
                  // Read the value, its 6 bytes further out
                  // See page 102 at the following URL
                  // http://www.kodak.com/global/plugins/acrobat/en/service/digCam/exifStandard2.pdf
                  value = scanner.getUint16(idx + 6, littleEndian);
                  maxBytes = 0; // Stop scanning
                  break;
          }
      }
      if (callback) {
          callback(base64img, value);
      }
  }
  fileReader.readAsArrayBuffer(file);
};

/**
 * Convert existing image as base64 + exif orientation over HTML canvas to the new base64 
 * @param srcBase64 is base64 encoded original image
 * @param srcOrientation is original exif orientation
 * @param callback returns new image as base64 encoded
 */
const resetOrientation = (srcBase64, srcOrientation, callback, maxDimension = 0) => {
    var img = new Image();	

    img.onload = function() {
        var width = img.width,
            height = img.height,            
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext("2d");
        const aspectRatio = width / height

        if (maxDimension > 0) {
            if (width > height) {
                if (width > maxDimension) {
                    width = maxDimension
                    height = width / aspectRatio
                }
            } else {
                if (height > maxDimension) {
                    height = maxDimension
                    width = height * aspectRatio
                }
            }
        }
        
        // set proper canvas dimensions before transform & export
        if (4 < srcOrientation && srcOrientation < 9) {
            canvas.width = height;
            canvas.height = width;
        } else {
            canvas.width = width;
            canvas.height = height;
        }

        // transform context before drawing image
        switch (srcOrientation) {
            case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
            case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
            case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
            case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
            case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
            case 7: ctx.transform(0, -1, -1, 0, height , width); break;
            case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
            default: break;
        }

        // draw image
        ctx.drawImage(img, 0, 0, width, height);

        // export base64
        callback(canvas.toDataURL());
    };   
    img.src = srcBase64;
}