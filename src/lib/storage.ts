/**
 * Storage Service for bijokdev.com storage API
 * Handles file uploads and deletions to the custom storage service
 */

const STORAGE_BASE_URL = "https://storage.bijokdev.com";
const API_KEY = "my-secret-key-123";
const BUCKET_NAME = "car-rental";

export interface StorageResponse {
  success: boolean;
  url?: string;
  relativePath?: string;
  filename?: string;
  originalName?: string;
  size?: number;
  mimetype?: string;
  error?: string;
}

/**
 * Upload a file to the storage service
 * @param file - The file to upload
 * @param onProgress - Optional callback for upload progress (0-100)
 * @returns Returns object with success status and file data
 */
export async function uploadFile(file: File, onProgress?: (progress: number) => void): Promise<StorageResponse> {
  try {
    // Validate file
    if (!file) {
      throw new Error("No file provided");
    }

    // Validate file type (images only)
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!validTypes.includes(file.type)) {
      throw new Error(
        "Invalid file type. Only images are allowed (JPEG, PNG, WebP, GIF)"
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error("File size exceeds 10MB limit");
    }

    // Create XMLHttpRequest for progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            onProgress(percentComplete);
          }
        });
      }

      // Handle completion
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              // Return full URL
              const fullUrl = `${STORAGE_BASE_URL}${response.file.url}`;
              resolve({
                success: true,
                url: fullUrl,
                relativePath: response.file.url,
                filename: response.file.filename,
                originalName: response.file.originalName,
                size: response.file.size,
                mimetype: response.file.mimetype,
              });
            } else {
              reject(new Error(response.error || "Upload failed"));
            }
          } catch (e) {
            reject(new Error("Failed to parse server response"));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      // Handle errors
      xhr.addEventListener("error", () => {
        reject(new Error("Network error during upload"));
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("Upload cancelled"));
      });

      // Configure and send request
      xhr.open("PUT", `${STORAGE_BASE_URL}/upload/${BUCKET_NAME}`);
      xhr.setRequestHeader("x-api-key", API_KEY);
      xhr.setRequestHeader("Content-Type", "application/octet-stream");
      xhr.send(file);
    });
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Delete a file from the storage service
 * @param fileUrl - The full URL or relative path of the file to delete
 * @returns Returns object with success status
 */
export async function deleteFile(fileUrl: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    // Extract relative path if full URL is provided
    let relativePath = fileUrl;
    if (fileUrl.startsWith(STORAGE_BASE_URL)) {
      relativePath = fileUrl.replace(STORAGE_BASE_URL, "");
    }

    // Make DELETE request
    const response = await fetch(`${STORAGE_BASE_URL}${relativePath}`, {
      method: "DELETE",
      headers: {
        "x-api-key": API_KEY,
      },
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        success: true,
        message: data.message || "File deleted successfully",
      };
    } else {
      throw new Error(data.error || "Failed to delete file");
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get full URL from relative path
 * @param relativePath - The relative path (e.g., /file/car-rental/2026/01/image.webp)
 * @returns Full URL
 */
export function getFileUrl(relativePath: string): string {
  if (relativePath.startsWith("http")) {
    return relativePath;
  }
  return `${STORAGE_BASE_URL}${relativePath}`;
}

/**
 * Validate image file before upload
 * @param file - The file to validate
 * @returns Returns object with valid status and error message if invalid
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: "No file selected" };
  }

  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error:
        "Invalid file type. Only images are allowed (JPEG, PNG, WebP, GIF)",
    };
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: "File size exceeds 10MB limit" };
  }

  return { valid: true };
}
