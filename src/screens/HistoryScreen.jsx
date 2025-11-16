import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getEntries } from '../services/StorageService';
import { useFocusEffect } from '@react-navigation/native';

const HistoryScreen = ({ navigation }) => {
  const [entries, setEntries] = useState([]);

  //güncel olması için ekran açıldığında çalışır
  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        const storedEntries = await getEntries();
        setEntries(storedEntries);
      };
      
      loadData();
    }, [])
  );

  const renderEntry = ({ item }) => (
    <View style={styles.entryBox}>
      <Text style={styles.entryDate}>{item.date}</Text>
      <Text style={styles.entryText}>{item.originalText}</Text>
      <View style={styles.sentimentRow}>
        <Text style={[
            styles.sentimentLabel,
            item.sentiment === 'POSITIVE' ? styles.positive : styles.negative
          ]}>
          {item.sentiment === 'POSITIVE' ? 'Positive 😄' : 'Negative 😞'}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Weekly Report</Text>
      <FlatList
        data={entries} 
        renderItem={renderEntry} 
        keyExtractor={(item) => item.id} 
        ListEmptyComponent={
          <Text style={styles.emptyText}>There are no entries yet.</Text>
        }
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  entryBox: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2, 
    shadowColor: '#000', 
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  entryDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  entryText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  sentimentRow: {
    flexDirection: 'row',
  },
  sentimentLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden', 
  },
  positive: {
    backgroundColor: '#DCFCE7', 
    color: '#166534', 
  },
  negative: {
    backgroundColor: '#FEE2E2', 
    color: '#991B1B', 
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
  backButton: {
    backgroundColor: '#007AFF', 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default HistoryScreen;