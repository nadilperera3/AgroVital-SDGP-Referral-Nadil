const bluetoothService = {
  connect: async () => true,
  disconnect: async () => true,
  sendData: async () => true,
  readData: async () => ({
    moisture: 0,
    ph: 0,
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
  }),
};

export default bluetoothService;