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
    case "cloudProxy":
      window.location.assign("/cloud_proxy/");
      return;
    case "mediaEncryption":
      window.location.assign("/data_encryption/");
      return;
    case "geofencing":
      window.location.assign("/geofencing/");
      return;
    case "authenticationGuide":
      window.location.assign("/authentication_workflow");
      return;
    case "streamChannel":
      window.location.assign("/stream_channel");
      return
    case "readWriteMetadata":
      window.location.assign("/read_write_metadata");
    default:
      return null;
  }
};

export default setupProjectSelector;
