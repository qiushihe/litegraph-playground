export const sendAsTextDownload = (
  filename: string,
  textContent: string
): void => {
  const elm = document.createElement("a");
  elm.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(textContent)
  );
  elm.setAttribute("download", filename);

  elm.style.display = "none";
  document.body.appendChild(elm);

  elm.click();

  setTimeout(() => {
    document.body.removeChild(elm);
  }, 1);
};
