/** @format */

function Checkenv(port) {
  if (port === 4000) {
    return "http://localhost:4000";
  } else {
    return "https://busy-gold-buffalo-veil.cyclic.app";
  }
}
export default Checkenv;
