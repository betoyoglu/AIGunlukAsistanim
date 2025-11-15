import AsyncStorage from '@react-native-async-storage/async-storage';

// verilerin saklanacağı dosya adı
const STORAGE_KEY = '@AiGunlukAsistanim:entries';

// telefondaki tüm girdeleri (entries) alır
export const getEntries = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Veri okunurken hata oluştu:', e);
    return []; 
  }
};

// Yeni bir girdiyi (entry) telefona kaydeder
export const saveEntry = async (newEntry) => {
  try {
    const existingEntries = await getEntries();
    const updatedEntries = [newEntry, ...existingEntries];
    const jsonValue = JSON.stringify(updatedEntries);
    
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    
    return true; 
  } catch (e) {
    console.error('Veri kaydedilirken hata oluştu:', e);
    return false; 
  }
};