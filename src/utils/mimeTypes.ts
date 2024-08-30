const mimeTypes: { [key: string]: string } = {
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    heic: "image/heic",
    heif: "image/heif",
  };
  
  export function getMimeType(extension: string | undefined): string {
    if (!extension) {
      const mimeType = mimeTypes.jpeg;
      return mimeType;
    } else {
      const mimeType = mimeTypes[extension.toLowerCase()];
      if (!mimeType) {
        throw new Error(`Unsupported file type: ${extension}`);
      }
      return mimeType;
    } 
  }
  