# UniNode 🎓

Doğrulanmış öğrencilerin buluştuğu güvenli sosyal platform.

## Ne Yapar?

- Öğrenci kimlik kartı ile kayıt (AI doğrulama)
- Etkinlik postu atma ve başvurma
- Gerçek zamanlı mesajlaşma (WebSocket)

## Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL 16+

### Backend

```bash
cd backend
npm install
cp .env.example .env
# .env dosyasını doldurun
npx prisma migrate dev
npm run dev
```

### Ortam Değişkenleri

`.env.example` dosyasına bakın.

## Canlı URL

Coming soon.

## Mimari

- **Frontend:** React Native + Expo
- **Backend:** Node.js + Express + TypeScript
- **Veritabanı:** PostgreSQL + Prisma
- **AI:** Google Gemini 2.5 Flash (kimlik kartı doğrulama)
- **Gerçek Zamanlı:** Socket.io
- **Depolama:** Cloudinary
