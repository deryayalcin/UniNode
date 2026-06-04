# Tech Stack

## Kullanılan Teknolojiler

| Katman | Teknoloji | Neden |
|---|---|---|
| Backend | Node.js + Express + TypeScript | Hızlı prototipleme, WebSocket desteği |
| Veritabanı | PostgreSQL + Prisma ORM | İlişkisel veri, tip güvenliği |
| Gerçek Zamanlı | Socket.io | WebSocket abstraction |
| Frontend | React Native + Expo | iOS + Android tek codebase |
| AI | Google Gemini 2.5 Flash | Görsel analiz, kimlik kartı doğrulama |
| Kimlik Doğrulama | JWT | Stateless, mobil uyumlu |
| Depolama | Cloudinary | Fotoğraf yükleme, ücretsiz tier |

## AI Kullanımı

Gemini 2.5 Flash, kayıt sırasında yüklenen kimlik kartı fotoğrafını analiz eder:
- Fotoğrafın gerçek bir öğrenci kimlik kartı olup olmadığını belirler
- Yüksek güven skoru ile reddedilen kartlar anında engellenir
- Düşük güven skoru ile şüpheli kartlar manuel review kuyruğuna düşer

## Geliştirme Sürecinde AI Kullanımı

- Claude ile proje mimarisi tasarlandı
- Kod tabanı Claude yardımıyla oluşturuldu
- Gemini API entegrasyonu Claude rehberliğinde yapıldı
