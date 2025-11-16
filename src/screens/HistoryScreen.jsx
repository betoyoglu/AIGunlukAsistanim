import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList, 
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getEntries } from '../services/StorageService';

import { useNavigation, useFocusEffect } from '@react-navigation/native';


const EntryCard = ({ item }) => {
  const isPositive = item.sentiment === 'POSITIVE';
  const barColor = isPositive ? '#34D399' : '#3B82F6'; 

  return (
    <View style={styles.card}>
      <View style={[styles.sentimentBar, { backgroundColor: barColor }]} />
      
      <View style={styles.cardContent}>
        <Text style={styles.cardDate}>{item.date}</Text>
        <Text style={styles.cardText} numberOfLines={2}> 
          {item.originalText}
        </Text>
      </View>
    </View>
  );
};

const HistoryScreen = () => {
  const navigation = useNavigation();
  const [entries, setEntries] = useState([]);

  
  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        const storedEntries = await getEntries();
        setEntries(storedEntries);
      };
      
      loadData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
      </View>

      <FlatList
        data={entries} 
        renderItem={({ item }) => <EntryCard item={item} />} 
        keyExtractor={(item) => item.id} 
        ListEmptyComponent={
          <Text style={styles.emptyText}>There are no entries yet.</Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }} 
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
    backgroundColor: '#1E2A2D', 
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2A3B3F', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  emptyText: {
    color: '#AAA',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#2A3B3F', 
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 15,
    flexDirection: 'row', 
    overflow: 'hidden', 
    elevation: 3, 
  },
  sentimentBar: {
    width: 6,
  },
  cardContent: {
    padding: 15,
    flex: 1, 
  },
  cardDate: {
    fontSize: 12,
    color: '#AAA', 
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    color: '#FFF',
    lineHeight: 22, 
  },
  backButton: {
    backgroundColor: '#FFD700', 
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    margin: 20,
  },
  backButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HistoryScreen;