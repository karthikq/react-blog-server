/** @format */

function Checkenv(port) {
  if (port === 4000) {
    return "http://localhost:4000";
  } else {
    return "https://shrouded-brook-23038.herokuapp.com";
  }
}
export default Checkenv;
