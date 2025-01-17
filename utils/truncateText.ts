// utils/truncateText.ts
export function truncateText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "…";
  }
  return text;
}
