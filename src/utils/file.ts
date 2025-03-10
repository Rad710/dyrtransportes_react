/**
 * Downloads a file from a blob with filename extracted from Content-Disposition header
 * or falls back to the provided default filename
 *
 * @param blob - The blob data to download
 * @param defaultFilename - Fallback filename if not provided in headers
 * @param headers - Response headers that may contain Content-Disposition
 */
export const downloadFile = (
    blob: Blob,
    defaultFilename: string,
    contentDisposition?: string,
): void => {
    // Try to extract filename from Content-Disposition header
    const match = contentDisposition?.match(/filename="(.+)"/);
    const filename = match?.at(1) ?? defaultFilename;

    // Create download link and trigger it
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Clean up
    setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
    }, 100);
};
