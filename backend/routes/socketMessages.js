const WebSocket = require('ws');

let device = [];

function handleConnection(ws, wss) {
  console.log('Client connected');
  ws.send('Welcome to the WebSocket server!');

  const cleanDeviceList = device.map(dev => ({
    deviceid: dev.deviceid,
    status: dev.status
  }));

  const deviceListMessage = JSON.stringify({ type: 'DEVICE_LIST', devices: cleanDeviceList });
  ws.send(deviceListMessage);

  ws.on('message', (message) => handleMessage(message, ws, wss));

  ws.on('close', () => handleClose(ws, wss));
}

function handleMessage(message, ws, wss) {
  console.log(`Received message from client: ${message}`);

  let messageStr = (typeof message === 'string') ? message : message.toString();
  let parsedMessage;

  try {
    parsedMessage = JSON.parse(messageStr);
  } catch (error) {
    console.log('Invalid JSON message received:', messageStr);
    return;
  }

  switch (parsedMessage.type) {
    case 'DEVICE_LIST':
      handleDeviceList(parsedMessage, wss);
      break;
    case 'LIGHT_CONTROL':
      handleLightControl(parsedMessage, wss);
      break;
    case 'FAN_CONTROL':
      handleFanControl(parsedMessage, wss);
      break;
    case 'AC_CONTROL':
      handleACControl(parsedMessage, wss);
      break;
    case 'DEVICE_STATUS':
      handleDeviceStatus(parsedMessage, wss);
      break;
    default:
      console.log(`Unknown message type: ${parsedMessage.type}`);
      break;
  }
}

function handleDeviceList(parsedMessage, wss) {
  const deviceId = parsedMessage.deviceid.trim();
  const deviceIndex = device.findIndex(dev => dev.deviceid === deviceId);

  if (deviceIndex === -1) {
    device.push({ deviceid: deviceId, status: 'OFF' });
    console.log(`Device ${deviceId} added to the list.`);
  } else {
    console.log(`Device ${deviceId} is already in the list.`);
  }

  const updatedDeviceListMessage = JSON.stringify({
    type: 'DEVICE_LIST',
    devices: device.map(dev => ({
      deviceid: dev.deviceid,
      status: dev.status
    }))
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(updatedDeviceListMessage);
    }
  });
}

function handleLightControl(parsedMessage, wss) {
  console.log('Broadcasting Light Control to all clients');
  broadcastMessage(wss, 'LIGHT_CONTROL', parsedMessage.deviceid);
}

function handleFanControl(parsedMessage, wss) {
  console.log('Broadcasting Fan Control to all clients');
  broadcastMessage(wss, 'FAN_CONTROL', parsedMessage.deviceid);
}

function handleACControl(parsedMessage, wss) {
  console.log('Broadcasting AC Control to all clients');
  broadcastMessage(wss, 'AC_CONTROL', parsedMessage.deviceid);
}

function handleDeviceStatus(parsedMessage, wss) {
  console.log('Broadcasting Device Status to all clients');
  broadcastMessage(wss, 'DEVICE_STATUS', parsedMessage.deviceid, parsedMessage.status, parsedMessage.Ctype);
}

function broadcastMessage(wss, type, deviceid, status, Ctype) {
  const message = { type, deviceid, status, Ctype };
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

function handleClose(ws, wss) {
  console.log('WebSocket connection closed');
  const index = device.findIndex(dev => dev.ws === ws);
  if (index !== -1) {
    device.splice(index, 1);
  }
  const updatedDeviceListMessage = JSON.stringify({
    type: 'DEVICE_LIST',
    devices: device.map(dev => ({
      deviceid: dev.deviceid,
      status: dev.status
    }))
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(updatedDeviceListMessage);
    }
  });
}

module.exports = {
  handleConnection
};
