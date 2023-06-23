const showMessage = (message) => {
  document
    .getElementById("log")
    .appendChild(document.createElement("div"))
    .append(message);
};

export default showMessage;
