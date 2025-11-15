import React, { useState } from 'react';
import {
  View, 
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { analyzeSentiment } from '../services/AIService';
import { saveEntry } from '../services/StorageService';

const DailyEntryScreen = () => {
  const [text, setText] = useState('');
  
  // analiz sonuçları
  const [sentiment, setSentiment] = useState(null); 
  const [summary, setSummary] = useState(null);
  const [suggestion, setSuggestion] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  // analiz butonu
  const handleAnalyzePress = async () => {
    if (text.trim().length === 0) {
      Alert.alert('Hata', 'Lütfen analiz için bir metin girin.');
      return;
    }

    setIsLoading(true);

   try {
      // apiden gelen duygu analizi
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

        //girdiyi kaydet
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
        Alert.alert('Hata', 'Analiz yapılırken bir sorun oluştu. Lütfen tekrar deneyin.');
      }

    } catch (error) {
      Alert.alert('Hata', 'API bağlantı hatası.');
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
  };

  const getBackgroundColor = () => {
    if (!sentiment) return '#f5f5f5';
    switch (sentiment.toLowerCase()) {
      case 'pozitif': return '#FFFBEB';
      case 'negatif': return '#F5F5F5';
      default: return '#f5f5f5';
    }
  };

  const renderContent = () => {
    
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{color: '#fff'}}>Analyzing...</Text>
        </View>
      );
    }

    if (sentiment) {
      return (
        <View style={styles.resultsContainer}>
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Duygu Analizi</Text>
            <Text style={styles.resultText}>{sentiment}</Text>
          </View>

          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Basit Özet</Text>
            <Text style={styles.resultText}>{summary}</Text>
          </View>

          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Öneri</Text>
            <Text style={styles.resultText}>{suggestion}</Text>
          </View>

          <TouchableOpacity onPress={handleReset} style={styles.button}>
            <Text style={styles.buttonText}> New Analysis </Text>
        </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        <View style={styles.headerContainer}>
        <Image
          style={styles.image}
          source={require('../../assets/images/bird.png')}
        />
        <View style={styles.headerTextContainer}>
            <Text style={styles.titleLine1}>What have you been up to?</Text>
            <Text style={styles.titleLine2}>How are you feeling today?</Text>
        </View>
      </View>
        <TextInput
          style={styles.input}
          placeholder="How was your day?"
          value={text}
          onChangeText={setText}
          multiline={true}
        />
        <TouchableOpacity onPress={handleAnalyzePress} style={styles.button}>
            <Text style={styles.buttonText}> Analyze It </Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1, 
    padding: 20,
    backgroundColor: '#000000',
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',     
    alignItems: 'center',     
    justifyContent: 'center', 
    marginBottom: 20,        
  },
  headerTextContainer: {
    marginLeft: 15, 
    alignItems: 'flex-start',
  },
  image: {
    width: 80, 
    height: 80,
    resizeMode: 'contain',
  },
  titleLine1: {
    fontSize: 20, 
    fontWeight: 'bold',
    fontFamily: 'Inconsolata-Regular',
    color: '#FFFFFF', 
  },
  titleLine2: {
    fontSize: 18, 
    fontFamily: 'ShadowsIntoLightTwo-Regular',
    color: '#FFFFFF', 
  },
  input: {
    minHeight: 120,    
    maxHeight: 250,    
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    textAlignVertical: 'top',
    fontSize: 16,
    width: '100%', 
  },
  button: {
    borderRadius: 10, 
    borderWidth:1, 
    borderColor:'#000', 
    backgroundColor:'#be7734ff',
    padding:10, 
    alignItems:'center', 
    marginBottom:10
  },
  buttonText: {
    color:'#fff', 
    fontFamily: 'Inconsolata-Regular',
    fontSize:16, 
    fontWeight:'bold'
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsContainer: {
    width: '100%', 
  },
  resultBox: {
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  resultText: {
    fontSize: 16,
  },
});

export default DailyEntryScreen;