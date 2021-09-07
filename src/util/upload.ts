export const getUploadedTextContent = ({
  target: { files = [] } = {}
} = {}): Promise<[string | null, string | null, Error | null]> => {
  const file = (files as File[])[0];
  if (!file) {
    return Promise.resolve([null, null, new Error("No file")]);
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target) {
        resolve([file.name, evt.target.result as string, null]);
      } else {
        resolve([null, null, new Error("No target")]);
      }
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
