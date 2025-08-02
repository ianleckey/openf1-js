/**
 * Converts an SVG string to a PNG data URL using an offscreen canvas.
 * Note: must be run in a browser environment.
 */
export async function svgToPng(svgString: string, width: number, height: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/png"));
      } else {
        reject(new Error("Canvas context not available"));
      }
    };
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}
