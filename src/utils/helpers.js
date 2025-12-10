export const generateGroupCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const copyToClipboard = (text, onSuccess, onError) => {
  // Navigator clipboard is more reliable in modern browsers than execCommand
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => onSuccess())
      .catch(() => onError());
  } else {
    // Fallback
    let textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      onSuccess();
    } catch (err) {
      onError();
    }
    document.body.removeChild(textArea);
  }
};
