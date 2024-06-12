import QRCode from 'qrcode';

export const GenerateQRCodeWithLogo = async (qrData: string): Promise<string> => {
  try {
    // Generate QR code as a base64 string
    const qrCodeBase64 = await QRCode.toDataURL(qrData);
    return qrCodeBase64;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};
