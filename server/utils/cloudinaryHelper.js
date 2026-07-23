import cloudinary from "../config/cloudinary.js";

export const deleteCloudinaryImage = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes("cloudinary.com")) return;
  try {
    const parts = imageUrl.split("/");
    const folderIndex = parts.findIndex((p) => p === "zhahi-events" || p === "zhahi-payments");
    if (folderIndex === -1) return;
    const folder = parts[folderIndex];
    const filename = parts[folderIndex + 1]?.split(".")[0];
    if (!filename) return;
    const publicId = `${folder}/${filename}`;
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete error:", err.message);
  }
};
