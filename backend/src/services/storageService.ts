export const storageService = {
  async upload(file?: Express.Multer.File) {
    if (!file) {
      return null;
    }

    return {
      url: `local://uploads/${Date.now()}-${file.originalname}`,
      mimeType: file.mimetype,
      filename: file.originalname,
      mediaBase64: file.buffer.toString('base64'),
    };
  },
};
