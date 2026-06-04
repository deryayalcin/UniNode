# Progress

## Hafta 1-2: Planlama
- PRD yazıldı
- MVP kapsamı belirlendi
- Design System oluşturuldu
- User Flow diyagramı çizildi

## Hafta 3-4: Backend
- Express + TypeScript kurulumu
- PostgreSQL + Prisma şema
- JWT authentication
- Post CRUD endpoints
- Başvuru akışı
- Socket.io chat

## Hafta 5-6: AI Entegrasyonu
- Google Gemini 2.5 Flash entegrasyonu
- Kimlik kartı doğrulama servisi
- AI onaylı / manuel review / reddedildi akışı
- Cloudinary fotoğraf yükleme

## Alınan Kararlar
- Gemini seçildi: ücretsiz tier, vision desteği, kolay entegrasyon
- Manuel review kuyruğu: AI düşük güvenle reddederse admin onayına düşer
- JWT 7 günlük token: mobil için yeterli

## Karşılaşılan Sorunlar
- gemini-1.5-flash ve gemini-2.0-flash model adı hatası → gemini-2.5-flash ile çözüldü
- PostgreSQL PATH sorunu → .zprofile'a eklenerek çözüldü
