const setupProjectSelector = async () => {
  const resp = await fetch("/projectselector.html")
  console.log(resp)
  const html = await resp.text()
  document.getElementById("projectSelector").innerHTML = html

  document.getElementById("projectSelector").onclick = async function () {
    projectSelector();
  }
};

const projectSelector = () => {
  let example = document.getElementById("selectedExample").value.toString();
  console.log(example);
  switch (example) {
    case "home":
      window.location.assign("/")
      return;
    case "getStarted":
      window.location.assign("/sdk_quickstart/");
      return;
    case "authenticationWorkflow":
      window.location.assign("/authentication_workflow");
      return
    case "readWriteMetadata":
      window.location.assign("/read_write_metadata");
    default:
      return null;
  }
};

export default setupProjectSelector;
