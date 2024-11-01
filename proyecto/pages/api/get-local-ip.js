// pages/api/get-local-ip.js

import { networkInterfaces } from 'os';

export default function handler(req, res) {
  const nets = networkInterfaces();
  let localIp = null;

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal addresses
      if (net.family === 'IPv4' && !net.internal) {
        localIp = net.address;
        break;
      }
    }
    if (localIp) break;
  }

  res.status(200).json({ localIp });
}
