export const getUploadedTextContent = ({
  target: { files = [] } = {}
} = {}) => {
  const file = files[0];
  if (!file) {
    return Promise.resolve([null, new Error("No file")]);
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = ({ target: { result: content } = {} } = {}) => {
      resolve([file.name, content, null]);
    };
    reader.onerror = () => {
      resolve([null, null, reader.error]);
    };
    reader.onabort = () => {
      resolve([null, null, new Error("Aborted")]);
    };
    reader.readAsText(file);
  });
};
