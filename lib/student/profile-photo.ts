export const studentProfilePhotoStorageKey = "usal:student-profile-photo:v1";
export const studentProfilePhotoUpdatedEvent = "usal:student-profile-photo-updated";

const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const maxUploadSize = 5 * 1024 * 1024;
const outputSize = 640;

export function getStudentProfilePhoto() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(studentProfilePhotoStorageKey);
}

export function saveStudentProfilePhoto(photo: string) {
  window.localStorage.setItem(studentProfilePhotoStorageKey, photo);
  window.dispatchEvent(new CustomEvent(studentProfilePhotoUpdatedEvent));
}

export function removeStudentProfilePhoto() {
  window.localStorage.removeItem(studentProfilePhotoStorageKey);
  window.dispatchEvent(new CustomEvent(studentProfilePhotoUpdatedEvent));
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No pudimos leer la imagen seleccionada."));
    };
    image.src = objectUrl;
  });
}

export async function prepareStudentProfilePhoto(file: File) {
  if (!acceptedImageTypes.includes(file.type)) {
    throw new Error("Selecciona una imagen JPG, PNG o WEBP.");
  }
  if (file.size > maxUploadSize) {
    throw new Error("La imagen debe pesar menos de 5 MB.");
  }

  const image = await loadImage(file);
  const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
  const sourceX = (image.naturalWidth - sourceSize) / 2;
  const sourceY = (image.naturalHeight - sourceSize) / 2;
  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("No pudimos procesar la imagen seleccionada.");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, outputSize, outputSize);
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceSize,
    sourceSize,
    0,
    0,
    outputSize,
    outputSize,
  );

  return canvas.toDataURL("image/jpeg", 0.86);
}
