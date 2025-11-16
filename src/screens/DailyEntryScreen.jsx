import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { useNavigation } from '@react-navigation/native';

import { analyzeSentiment } from '../services/AIService';
import { saveEntry } from '../services/StorageService';


const AnalysisResultScreen = ({ sentiment, summary, suggestion, onReset }) => {

  const isPositive = sentiment === 'POSITIVE';

  const containerStyle = {
    ...styles.resultsContainer, 
    backgroundColor: isPositive ? '#F8F3CE' : '#7A7A73' //pozitifse sarı
  };

  const titleStyle = {
    ...styles.resultsTitle,
    color: isPositive ? '#000' : '#FFF' // Sarı zeminse siyah, gri zeminse beyaz
  };

  const chipStyle = {
    ...styles.chip,
    backgroundColor: isPositive ? '#E0E0E0' : '#4A4A4A' // Sarı zeminse açık gri, gri zeminse koyu gri
  };

  const chipTextStyle = {
    ...styles.chipText,
    color: isPositive ? '#000' : '#E0E0E0' // Metin renkleri
  };

  const buttonStyle = {
    ...styles.actionButton,
    backgroundColor: isPositive ? '#222' : '#FFD700' 
  };

  const buttonTextStyle = {
     ...styles.actionButtonText,
     color: isPositive ? '#FFF' : '#000' 
  };

  return (
    <View style={containerStyle}>
      <Icon 
        name={isPositive ? "sentiment-very-satisfied" : "sentiment-very-dissatisfied"} 
        size={100} 
        color={isPositive ? '#000' : '#AAA'} 
      />

      <Text style={titleStyle}>
        {isPositive ? 'It is a positive day!' : 'It looks like you are feeling a bit down.'}
      </Text>

      <View style={styles.chipContainer}>
        <View style={chipStyle}>
          <Text style={chipTextStyle}>{summary}</Text>
        </View>
        <View style={chipStyle}>
          <Text style={chipTextStyle}>{suggestion}</Text>
        </View>
      </View>

      <TouchableOpacity style={buttonStyle} onPress={onReset}>
        <Text style={buttonTextStyle}>Done!</Text>
      </TouchableOpacity>
    </View>
  );
};

const DailyEntryScreen = () => {
  const [text, setText] = useState('');
  const [sentiment, setSentiment] = useState(null); // null ise giriş ekranı, doluysa sonuç ekranı
  const [summary, setSummary] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 

  const navigation = useNavigation();

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };


  const handleAnalyzePress = async () => {
    if (text.trim().length === 0) {
      Alert.alert('Error', 'Please enter some text for analysis.');
      return;
    }
    setIsLoading(true);

    try {
      const sentimentResult = await analyzeSentiment(text);

      if (sentimentResult) {
        let localSummary = '';
        let localSuggestion = '';

        if (sentimentResult === 'POSITIVE') {
          localSummary = 'It looks like you had a generally positive day.';
          localSuggestion = 'Keep up this great energy!';
        } else if (sentimentResult === 'NEGATIVE') {
          localSummary = 'It seems like today was a bit challenging.';
          localSuggestion = 'You could take a 10-minute break for yourself.';
        } else {
          localSummary = 'Your feelings seem quite balanced today.';
          localSuggestion = 'A calm walk might feel good.';
        }
        
        setSentiment(sentimentResult);
        setSummary(localSummary);
        setSuggestion(localSuggestion);

        const entryToSave = {
          id: new Date().toISOString(),
          date: new Date().toLocaleDateString('tr-TR'),
          originalText: text,
          sentiment: sentimentResult,
          summary: localSummary,
          suggestion: localSuggestion,
        };
        await saveEntry(entryToSave);

      } else {
        Alert.alert('Error', 'An error occurred during analysis. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'API connection error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setText('');
    setSentiment(null);
    setSummary(null);
    setSuggestion(null);
    setIsLoading(false);
    
    navigation.navigate('History');
  };


  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </SafeAreaView>
    );
  }

  if (sentiment) {
    return (
      <SafeAreaView style={styles.container}>
        <AnalysisResultScreen
          sentiment={sentiment}
          summary={summary}
          suggestion={suggestion}
          onReset={handleReset}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Icon name="close" size={28} color="#FFF" />
        </TouchableOpacity>
        
        <Text style={styles.headerDate}>{getFormattedDate()}</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          style={styles.image}
          source={require('../../assets/images/bird.png')}
        />
        <Text style={styles.title}>How's your day going?</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Write down what's on your mind today..."
          placeholderTextColor="#888"
          value={text}
          onChangeText={setText}
          multiline={true}
        />

        <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyzePress}>
          <Text style={styles.analyzeButtonText}>Analyze</Text>
        </TouchableOpacity>
      </ScrollView>

    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2A2D', 
    justifyContent: 'center', 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  headerDate: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  scrollContainer: {
    flexGrow: 1, 
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Inconsolata-Regular',
    textAlign: 'center',
    marginBottom: 30, 
  },
   image: {
    width: 80, 
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    minHeight: 150,
    maxHeight: 250,
    color: '#FFF',
    fontSize: 16,
    textAlignVertical: 'top',
    backgroundColor: '#2A3B3F', 
    borderRadius: 12,
    padding: 15,
    width: '100%',
    marginBottom: 20, 
  },

  analyzeButton: {
    backgroundColor: '#FFD700', 
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  analyzeButtonText: {
    color: '#000', 
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 40,
  },
  chip: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,
  },
  chipText: {
    fontSize: 14,
  },
  actionButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DailyEntryScreen;