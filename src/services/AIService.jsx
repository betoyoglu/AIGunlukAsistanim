import { API_TOKEN } from '@env';
const API_URL = 'https://router.huggingface.co/hf-inference/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english';

export const analyzeSentiment = async (text) => {
  try {
    const response = await fetch(
      API_URL,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text(); // Sunucudan gelen asıl mesajı al
      console.error(`API Hata Kodu: ${response.status}`);
      console.error(`API Hata Mesajı: ${errorBody}`);
      throw new Error('API isteği başarısız oldu.');
    }

    const jsonResponse = await response.json();

    if (jsonResponse && jsonResponse[0] && jsonResponse[0][0]) {
      const label = jsonResponse[0][0].label;
      return label; 
    } else {
      throw new Error('API cevabı beklenmedik bir formatta geldi.');
    }

  } catch (error) {
    console.error("AI Servisinde Hata:", error);
    return null; 
  }
};