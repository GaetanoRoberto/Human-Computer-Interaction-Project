const os = require('os');
const SERVER_PORT = '3001'; // Port number as a string

//INDIRIZZO SCHEDA ETHERNET
function getLocalExternalIP() {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];

    for (const alias of iface) {
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return `http://${alias.address}:${SERVER_PORT}`; // Concatenating the protocol and port number
      }
    }
  }
  return `http://0.0.0.0:${SERVER_PORT}`; // Default return address with protocol and port number
}
// IP_ADDRESS will be in the format "http://192.168.0.100:3001"

//INDIRIZZO SCHEDA WIFI --> CI SERVE QUESTO PER RUNNARE DA SMARTPHONE
function getLocalWirelessIP() {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];

    for (const alias of iface) {
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal && devName.includes('Wi-Fi')) {
        return `http://${alias.address}:${SERVER_PORT}`; // Concatenating the protocol and port number
      }
    }
  }
  return `http://0.0.0.0:${SERVER_PORT}`; // Default return address with protocol and port number
}

// IP_ADDRESS will be in the format "http://192.168.0.100:3001"

// IP_ADDRESS will be in the format "http://192.168.0.100:3001"

// Export the function
module.exports = { getLocalWirelessIP };

