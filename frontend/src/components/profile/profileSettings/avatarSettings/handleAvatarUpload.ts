/**
 * Converts the passed file to a Base64 string while applying some
 * validations to it.
 * @param file
 * @returns a Promise that resolves to a Base64 string. If the uploaded
 * file is not an image, is over 2MB, or the upload fails for any reason,
 * this function will reject with a corresponding error message (a string).
 */
export const handleAvatarUpload = async (file: File) =>
  new Promise<string>((resolve, reject) => {
    if (!file.type.startsWith('image')) {
      return reject(errorMessages.invalidFileExtension);
    }

    if (toMegabytes(file.size) > megaBytesLimit) {
      return reject(errorMessages.fileTooLarge);
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      const result = fileReader.result;
      if (result) {
        return resolve(result.toString());
      } else {
        return reject(errorMessages.uploadFailed);
      }
    };

    fileReader.onerror = () => {
      return reject(errorMessages.uploadFailed);
    };
  });

const megaBytesLimit = 2;

const errorMessages = {
  fileTooLarge: `Your image is too large (the limit is ${megaBytesLimit}MB)!`,
  uploadFailed: 'Image upload failed, please try again!',
  invalidFileExtension: 'Please upload an image file!',
};

function toMegabytes(bytes: number) {
  return Number((bytes / 1024 / 1024).toFixed(4));
}
