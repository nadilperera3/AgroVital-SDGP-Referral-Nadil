const db = require('../config/firebaseConfig');

exports.saveSensorData = async (req, res) => {
  const { pH, nitrogen, phosphorus, potassium, moisture } = req.body;

  try {
    const sensorRef = db.collection('sensorData').doc();
    await sensorRef.set({
      pH,
      nitrogen,
      phosphorus,
      potassium,
      moisture,
      timestamp: new Date(),
    });

    res.status(200).json({ message: 'Sensor data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving data: ' + error.message });
  }
};

exports.getSensorData = async (req, res) => {
  try {
    const snapshot = await db.collection('sensorData').get();
    const sensorRecords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({ sensorData: sensorRecords });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sensor data: ' + error.message });
  }
};
