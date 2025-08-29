import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function __bodyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Body</Text>
      <Text style={styles.description}>Mobile __body component</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});