// REPLACE WITH YOUR IP ADDRESS:
// On Windows: Open Command Prompt, run 'ipconfig', and use the "IPv4 Address".
// On Linux/WSL: Open terminal, run 'hostname -I', and use the first IP address.
const DEV_IP = '192.168.1.240'; // <--- Put your IP here

export const API_URL = `http://${DEV_IP}:8080/api`;
export default { API_URL };