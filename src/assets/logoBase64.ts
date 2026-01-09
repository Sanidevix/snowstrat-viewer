// This file provides the logo for PDF embedding
// Using a simple approach that works with jsPDF

export const getLogoBase64 = async (): Promise<string> => {
  try {
    const response = await fetch('/icons/icon-192.png');
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return '';
  }
};

export default '';
