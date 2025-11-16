# AI Günlük Asistanım

> Kullanıcının yazdığı günlük girdileri AI ile analiz eden, duygu durumunu belirleyen ve bu girdileri lokal olarak saklayan bir React Native mobil uygulamasıdır. Bu proje, 3 günlük bir mini proje kapsamında geliştirilmiştir.

## Özellikler

* Duygu Analizi: Kullanıcının girdiği metnin POSITIVE veya NEGATIVE olduğunu belirler.

* Lokal Depolama: Tüm girdiler ve analizler, AsyncStorage kullanılarak güvenli bir şekilde cihazda saklanır.

* Geçmiş Ekranı: "History" ekranında tüm geçmiş girdiler, duygu durumunu belirten renkli çubuklarla listelenir. (Yeşil "Pozitif", mavi "Negatif)

* Offline Desteği: Kaydedilen girdilere internet bağlantısı olmaksızın "History" ekranından erişilebilir.

<img width="1920" height="1080" alt="1" src="https://github.com/user-attachments/assets/37704618-433d-4d8a-9f73-0f4b44ba8335" />

<img width="1920" height="1080" alt="2" src="https://github.com/user-attachments/assets/8ba7cf11-79a1-4710-ade7-78ef115c28dc" />


## Kullanılan AI Modeli ve API

Ana Model (Duygu Analizi): distilbert/distilbert-base-uncased-finetuned-sst-2-english (https://huggingface.co/distilbert/distilbert-base-uncased-finetuned-sst-2-english)
* Bu model, girilen metni analiz ederek POSITIVE (Pozitif) veya NEGATIVE (Negatif) olarak sınıflandıran bir duygu analizi modelidir.
* Uygulama, distilbert modelinden POSITIVE veya NEGATIVE sonucunu aldıktan sonra, bu sonuca bağlı olarak önceden tanımlanmış (if/else) bir özet ve öneri metnini kullanıcıya gösterir.

## Kullanılan Teknolojiler

* Platform: React Native CLI
* Navigasyon: React Navigation (Native Stack)
* Lokal Depolama: @react-native-async-storage/async-storage
* UI/UX: react-native-vector-icons (İkonlar için)
* API İsteği: fetch
* Güvenlik: react-native-dotenv (API anahtarını gizlemek için)

## Kurulum ve Çalıştırma Adımları
1. Projeyi klonlayın:
```sh
git clone https://github.com/kullanici-adiniz/AIGunlukAsistanim.git
cd AIGunlukAsistanim
```

2. Gerekli paketleri yükleyin:
```sh
npm install
```

3. API Anahtarını (Token) Ayarlayın:
```sh
# .env adında yeni bir dosya oluşturun. .env dosyasının içine Hugging Face "Access Token"ınızı (Rol: read) ekleyin.
# API_TOKEN=hf_...TOKENINIZI_BURAYA_YAPISTIRIN...
```

4. Uygulamayı Çalıştırın:
```sh
npx react-native run-android
```

