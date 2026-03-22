#include <ModbusMaster.h>
#include <HardwareSerial.h>
#include "BluetoothSerial.h"  // Built-in!

// RS485 Setup
#define RXD2 16
#define TXD2 17
#define RS485_DE_RE 4
HardwareSerial RS485Serial(2);
ModbusMaster node;

// Bluetooth Setup
BluetoothSerial SerialBT;

// RS485 Control
void preTransmission() { digitalWrite(RS485_DE_RE, HIGH); }
void postTransmission() { digitalWrite(RS485_DE_RE, LOW); }

// Flexible Reading Function
uint16_t readSensorRegister(uint16_t regAddress) {
  uint8_t result = node.readHoldingRegisters(regAddress, 1);
  if (result == node.ku8MBSuccess) {
    return node.getResponseBuffer(0);
  } else {
    Serial.print("Failed reading register: 0x");
    Serial.println(regAddress, HEX);
    return 0;
  }
}

void setup() {
  Serial.begin(115200);

  // RS485 Setup
  pinMode(RS485_DE_RE, OUTPUT);
  digitalWrite(RS485_DE_RE, LOW);
  RS485Serial.begin(9600, SERIAL_8N1, RXD2, TXD2);
  node.begin(1, RS485Serial);
  node.preTransmission(preTransmission);
  node.postTransmission(postTransmission);

  // Bluetooth Classic Setup
  if (!SerialBT.begin("AgroVital_SoilMonitor_BT")) { // Device name
    Serial.println("Bluetooth failed to start");
  } else {
    Serial.println("Bluetooth Classic Started: AgroVital_SoilMonitor_BT");
  }
}

void loop() {
  Serial.println("Reading Soil Sensor:");

  uint16_t nitrogen = readSensorRegister(0x001E);
  uint16_t phosphorus = readSensorRegister(0x001F);
  uint16_t potassium = readSensorRegister(0x0020);
  uint16_t ph = readSensorRegister(0x0006);
  uint16_t moisture = readSensorRegister(0x0012);

  Serial.printf("Nitrogen: %d mg/kg\n", nitrogen);
  Serial.printf("Phosphorus: %d mg/kg\n", phosphorus);
  Serial.printf("Potassium: %d mg/kg\n", potassium);
  Serial.printf("pH: %.2f\n", ph / 100.0);
  Serial.printf("Moisture: %.1f%%\n", moisture / 10.0);

  // Send readings over Bluetooth Serial
  SerialBT.printf("Nitrogen: %d mg/kg\n", nitrogen);
  SerialBT.printf("Phosphorus: %d mg/kg\n", phosphorus);
  SerialBT.printf("Potassium: %d mg/kg\n", potassium);
  SerialBT.printf("pH: %.2f\n", ph / 100.0);
  SerialBT.printf("Moisture: %.1f%%\n", moisture / 10.0);
  SerialBT.println("-----------------------------");

  delay(5000); // Update every 5 sec
}
