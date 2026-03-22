import React from "react";
import { View, Text } from "react-native";

export default function RecentSoilRecords({ records }) {
  return (
    <View style={{ marginTop: 20, marginBottom: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Recent Soil Records
      </Text>

      {records && records.length > 0 ? (
        records.map((record, index) => (
          <View
            key={index}
            style={{
              backgroundColor: "#eef8e5",
              borderColor: "#004d1a",
              borderWidth: 1.5,
              borderRadius: 12,
              padding: 12,
              marginBottom: 10,
            }}
          >
            <Text>Date: {record.date}</Text>
            <Text>Moisture: {record.moisture}</Text>
            <Text>pH: {record.ph}</Text>
            <Text>Nitrogen: {record.nitrogen}</Text>
            <Text>Phosphorus: {record.phosphorus}</Text>
            <Text>Potassium: {record.potassium}</Text>
          </View>
        ))
      ) : (
        <Text>No records yet</Text>
      )}
    </View>
  );
}