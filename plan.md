# UniNode — LLM Implementation Plan

> Bu doküman, MVP_Kapsam.md ve PRD.md temel alınarak LLM coding asistanlarının
> (Claude Code, Cursor, Copilot vb.) adım adım takip edebileceği şekilde hazırlanmıştır.
> Her adım bağımsız, doğrulanabilir ve sıralı olarak uygulanabilir.

---

## Teknoloji Kararları

| Katman | Teknoloji | Neden |
|---|---|---|
| Backend | Node.js + Express + TypeScript | Hızlı prototipleme, WebSocket desteği kolay |
| Veritabanı | PostgreSQL + Prisma ORM | İlişkisel veri, tip güvenliği |
| Gerçek Zamanlı | Socket.io | WebSocket abstraction, kolay entegrasyon |
| Frontend | React Native + Expo + TypeScript | iOS + Android tek codebase |
| Kimlik Doğrulama | JWT (access + refresh token) | Stateless, mobil uyumlu |
| Dosya Depolama | Cloudinary (kart + profil fotoğrafları) | Ücretsiz tier, kolay entegrasyon |
| Ortam Yönetimi | dotenv | .env dosyası ile config |

---

## Dizin Yapısı

```
uninode/
├── backend/          ← Express + TypeScript servisi
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/       (Prisma schema)
│   │   ├── sockets/
│   │   └── utils/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env.example
│   └── package.json
│
├── frontend/         ← React Native + Expo servisi
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── navigation/
│   │   ├── services/     (API calls)
│   │   ├── store/        (state management)
│   │   └── utils/
│   ├── .env.example
│   └── package.json
│
├── plan.md           ← bu dosya
├── PRD.md
└── MVP_Kapsam.md
```

---

## Uygulama Adımları

---

### ADIM 1 — Backend Kurulumu

**Hedef:** Çalışan, boş bir Express + TypeScript sunucusu ayağa kaldırmak.

**Yapılacaklar:**

```bash
mkdir uninode && cd uninode
mkdir backend && cd backend
npm init -y
npm install express cors dotenv helmet
npm install -D typescript ts-node nodemon @types/express @types/cors @types/node
npx tsc --init
```

**Dosyalar:**

- `backend/src/index.ts` → Express app, port dinleme
- `backend/tsconfig.json` → `"outDir": "./dist"`, `"rootDir": "./src"`
- `backend/nodemon.json` → `ts-node` ile watch config
- `backend/.env.example`:
  ```
  PORT=3001
  DATABASE_URL=postgresql://user:password@localhost:5432/uninode
  JWT_SECRET=supersecretkey
  CLOUDINARY_URL=cloudinary://...
  ```

**Doğrulama:**
```bash
npm run dev
# GET http://localhost:3001/health → { "status": "ok" }
```

---

### ADIM 2 — Frontend Kurulumu

**Hedef:** Çalışan, boş bir React Native + Expo uygulaması başlatmak.

**Yapılacaklar:**

```bash
cd ..  # uninode/ kökünde
npx create-expo-app frontend --template blank-typescript
cd frontend
npx expo install expo-router react-native-safe-area-context react-native-screens
npm install axios @tanstack/react-query zustand
```

**Dosyalar:**

- `frontend/src/screens/HomeScreen.tsx` → "UniNode çalışıyor" placeholder
- `frontend/.env.example`:
  ```
  EXPO_PUBLIC_API_URL=http://localhost:3001
  EXPO_PUBLIC_SOCKET_URL=http://localhost:3001
  ```

**Doğrulama:**
```bash
npx expo start
# Simulator veya Expo Go'da uygulama açılıyor
```

---

### ADIM 3 — Veritabanı Şeması (Prisma)

**Hedef:** Tüm MVP veri modellerini tanımlamak.

**Kurulum:**
```bash
cd backend
npm install prisma @prisma/client
npx prisma init
```

**`prisma/schema.prisma` içeriği:**

```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  passwordHash  String
  university    String?
  bio           String?
  avatarUrl     String?
  cardImageUrl  String
  isVerified    Boolean   @default(false)
  createdAt     DateTime  @default(now())

  posts         Post[]
  applications  Application[]
  sentMessages  Message[]     @relation("sender")
  conversations ConversationParticipant[]
}

model Post {
  id           String    @id @default(cuid())
  title        String
  description  String?
  eventType    String    // konser | sinema | spor | gezi | diger
  eventDate    DateTime
  spotsNeeded  Int
  createdAt    DateTime  @default(now())

  author       User      @relation(fields: [authorId], references: [id])
  authorId     String
  applications Application[]
}

model Application {
  id        String   @id @default(cuid())
  status    String   @default("pending") // pending | accepted | rejected
  createdAt DateTime @default(now())

  post      Post     @relation(fields: [postId], references: [id])
  postId    String
  applicant User     @relation(fields: [applicantId], references: [id])
  applicantId String

  @@unique([postId, applicantId])
}

model Conversation {
  id           String    @id @default(cuid())
  createdAt    DateTime  @default(now())

  participants ConversationParticipant[]
  messages     Message[]
}

model ConversationParticipant {
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  conversationId String
  user           User         @relation(fields: [userId], references: [id])
  userId         String

  @@id([conversationId, userId])
}

model Message {
  id             String       @id @default(cuid())
  content        String
  createdAt      DateTime     @default(now())

  conversation   Conversation @relation(fields: [conversationId], references: [id])
  conversationId String
  sender         User         @relation("sender", fields: [senderId], references: [id])
  senderId       String
}
```

**Doğrulama:**
```bash
npx prisma migrate dev --name init
npx prisma studio
# Tablolar görünüyor
```

---

### ADIM 4 — Kimlik Doğrulama (Auth)

**Hedef:** Kayıt, giriş, JWT middleware.

**Kurulum:**
```bash
npm install bcryptjs jsonwebtoken multer
npm install -D @types/bcryptjs @types/jsonwebtoken @types/multer
```

**Dosyalar:**

- `src/routes/auth.ts`
  - `POST /auth/register` → isim, email, şifre, kart fotoğrafı al → Cloudinary'e yükle → User oluştur (isVerified: false)
  - `POST /auth/login` → email + şifre → JWT döndür
  - `GET /auth/me` → JWT ile mevcut kullanıcı bilgisi

- `src/middleware/authMiddleware.ts`
  - Authorization header'dan JWT doğrula
  - `req.user` olarak inject et

- `src/utils/cloudinary.ts`
  - Kart ve avatar yükleme fonksiyonları

**İş Mantığı:**
- Kayıt olan kullanıcı `isVerified: false` ile oluşturulur
- `isVerified: false` kullanıcılar post atamaz, mesajlaşamaz
- Admin (sonradan) kart fotoğrafını inceler ve `isVerified: true` yapar

**Doğrulama:**
```bash
POST /auth/register → 201, user objesi döner
POST /auth/login    → 200, { token } döner
GET  /auth/me       → 200, user objesi döner (token gerekli)
GET  /auth/me       → 401 (token olmadan)
```

---

### ADIM 5 — Doğrulama Kuyruğu (Admin Review)

**Hedef:** Kart fotoğraflarını inceleyen basit admin endpoint'leri.

**Dosyalar:**

- `src/routes/admin.ts`
  - `GET /admin/pending` → isVerified: false olan kullanıcıları listele (kart fotoğrafıyla)
  - `PATCH /admin/verify/:userId` → isVerified: true yap
  - `PATCH /admin/reject/:userId` → kullanıcıyı sil veya tekrar yükleme iste

- `src/middleware/adminMiddleware.ts`
  - JWT'de `role: "admin"` kontrolü

**Not:** V1'de admin paneli mobil uygulama değil, sadece API endpoint'idir. Postman veya basit bir web sayfasıyla yönetilir.

**Doğrulama:**
```bash
GET  /admin/pending         → bekleyen kullanıcı listesi
PATCH /admin/verify/:id     → kullanıcı verified oldu
```

---

### ADIM 6 — Post CRUD

**Hedef:** Etkinlik postu oluşturma, listeleme, görüntüleme.

**Dosyalar:**

- `src/routes/posts.ts`
  - `POST /posts` → yeni post oluştur (auth + verified gerekli)
  - `GET /posts` → tüm aktif postları listele (tarihe göre sırala)
  - `GET /posts/:id` → tek post detayı

**İş Mantığı:**
- `isVerified: false` kullanıcılar post atamaz → 403
- Geçmiş tarihli etkinlikler listede görünmez
- `spotsNeeded` alanı kabul edilen başvuru sayısı ile karşılaştırılır

**Doğrulama:**
```bash
POST /posts          → 201, post objesi (verified user token ile)
POST /posts          → 403 (unverified user)
GET  /posts          → 200, post dizisi
GET  /posts/:id      → 200, tek post
```

---

### ADIM 7 — Başvuru Akışı

**Hedef:** Başvur, kabul et, red et; kabul sonrası konuşma oluştur.

**Dosyalar:**

- `src/routes/applications.ts`
  - `POST /posts/:postId/apply` → başvur (kendi postuna başvuramazsın)
  - `GET /posts/:postId/applications` → post sahibi başvuranları görür
  - `PATCH /applications/:id/accept` → kabul et → Conversation oluştur (post sahibi + başvuran)
  - `PATCH /applications/:id/reject` → red et

**İş Mantığı:**
- Aynı kişi aynı posta iki kez başvuramaz (`@@unique`)
- Kabul sonrası `Conversation` + 2x `ConversationParticipant` oluşturulur
- Spots dolduğunda yeni başvuru alınmaz

**Doğrulama:**
```bash
POST /posts/:id/apply              → 201
POST /posts/:id/apply (tekrar)     → 409 conflict
PATCH /applications/:id/accept     → 200, conversation oluştu
PATCH /applications/:id/reject     → 200
```

---

### ADIM 8 — Mesajlaşma REST + Socket.io

**Hedef:** Gerçek zamanlı birebir chat.

**Kurulum:**
```bash
npm install socket.io
npm install -D @types/socket.io
```

**Dosyalar:**

- `src/routes/conversations.ts`
  - `GET /conversations` → giriş yapan kullanıcının tüm konuşmaları
  - `GET /conversations/:id/messages` → belirli konuşmanın mesajları (sayfalı)

- `src/sockets/chatSocket.ts`
  - JWT ile socket bağlantısı doğrula
  - `join_conversation` → kullanıcı odaya katılır
  - `send_message` → mesajı DB'ye yaz → odadaki herkese `new_message` emit et
  - `disconnect` → temizlik

**Socket Event Sözleşmesi:**

```typescript
// Client → Server
"join_conversation"  { conversationId: string }
"send_message"       { conversationId: string, content: string }

// Server → Client
"new_message"        { id, content, senderId, createdAt, conversationId }
"error"              { message: string }
```

**Doğrulama:**
```bash
GET /conversations              → konuşma listesi
GET /conversations/:id/messages → mesaj geçmişi
# Socket.io client ile: join → send → new_message alındı
```

---

### ADIM 9 — Frontend: Auth Ekranları

**Hedef:** Kayıt ve giriş ekranları, token yönetimi.

**Kurulum:**
```bash
cd frontend
npm install @react-native-async-storage/async-storage
```

**Dosyalar:**

- `src/screens/RegisterScreen.tsx`
  - Form: isim, email, şifre, üniversite
  - Kart fotoğrafı: `expo-image-picker` ile seç
  - `POST /auth/register` çağrısı
  - Başarı → "Hesabınız doğrulama bekliyor" mesajı

- `src/screens/LoginScreen.tsx`
  - Form: email + şifre
  - `POST /auth/login` → token al → AsyncStorage'a kaydet

- `src/store/authStore.ts` (Zustand)
  - `token`, `user`, `setToken`, `logout`

- `src/services/api.ts`
  - Axios instance, baseURL, token interceptor

**Doğrulama:**
```
Kayıt ekranı → fotoğraf seç → gönder → "doğrulama bekliyor" mesajı
Giriş ekranı → token alındı → ana sayfaya yönlendirme
```

---

### ADIM 10 — Frontend: Post Listeleme & Oluşturma

**Hedef:** Etkinlik postlarını göster ve yeni post oluştur.

**Dosyalar:**

- `src/screens/FeedScreen.tsx`
  - `GET /posts` ile postları listele
  - Her kart: başlık, tarih, etkinlik türü, üniversite, kalan yer sayısı
  - Posta tıkla → `PostDetailScreen`

- `src/screens/PostDetailScreen.tsx`
  - Post detayları
  - "Katılmak İstiyorum" butonu → `POST /posts/:id/apply`
  - Kendi postuysa: başvuranlar listesi

- `src/screens/CreatePostScreen.tsx`
  - Form: başlık, açıklama, tarih seçici, etkinlik türü, kişi sayısı
  - `POST /posts`

**Doğrulama:**
```
Feed ekranı postları gösteriyor
Post oluşturma çalışıyor
Başvur butonu çalışıyor
```

---

### ADIM 11 — Frontend: Chat Ekranları

**Hedef:** Konuşma listesi ve gerçek zamanlı mesajlaşma ekranı.

**Kurulum:**
```bash
npm install socket.io-client
```

**Dosyalar:**

- `src/screens/ConversationsScreen.tsx`
  - `GET /conversations` ile konuşmaları listele
  - Her satır: karşı tarafın ismi + son mesaj + zaman

- `src/screens/ChatScreen.tsx`
  - `GET /conversations/:id/messages` ile geçmiş mesajları yükle
  - `join_conversation` emit et
  - Mesaj gönder → `send_message` emit et
  - `new_message` dinle → mesaj listesine ekle
  - Klavye açıldığında ekran kaydır (KeyboardAvoidingView)

- `src/services/socketService.ts`
  - Socket.io bağlantısı başlat/kes
  - Token ile auth handshake

**Doğrulama:**
```
Konuşmalar listesi görünüyor
Chat ekranında mesaj gönderilebiliyor
Karşı taraf gerçek zamanlı mesajı alıyor
```

---

### ADIM 12 — Frontend: Navigasyon & Profil

**Hedef:** Tab navigasyon, profil ekranı, çıkış.

**Dosyalar:**

- `src/navigation/TabNavigator.tsx`
  - Tab 1: Feed (Etkinlikler)
  - Tab 2: Post Oluştur
  - Tab 3: Konuşmalar
  - Tab 4: Profil

- `src/screens/ProfileScreen.tsx`
  - Kullanıcı bilgileri (isim, üniversite, bio, ilgi alanları)
  - Doğrulama durumu (✅ Doğrulandı / ⏳ Bekliyor)
  - Çıkış yap butonu

**Doğrulama:**
```
Tab bar çalışıyor
Profil bilgileri görünüyor
Çıkış yapılabiliyor
```

---

### ADIM 13 — Entegrasyon Testi & Temizlik

**Hedef:** Uçtan uca akışların çalıştığını doğrulamak.

**Test Edilecek Akışlar:**

1. **Kayıt → Doğrulama → Giriş**
   - Kayıt ol → admin onayı ver → giriş yap → verified rozeti görün

2. **Etkinlik Akışı**
   - Kullanıcı A post atsın → Kullanıcı B başvursun → A kabul etsin → Chat açılsın

3. **Chat Akışı**
   - İki farklı simulator/cihazda giriş yap → aynı konuşmaya gir → mesajlaş → gerçek zamanlı çalışıyor mu?

**Temizlik:**
- Tüm `console.log` debug satırlarını kaldır
- `.env.example` dosyalarını güncelle
- `README.md` yaz: kurulum talimatları, env değişkenleri

---

## Özet Tablo

| Adım | İçerik | Servis |
|---|---|---|
| 1 | Backend kurulumu | Backend |
| 2 | Frontend kurulumu | Frontend |
| 3 | Prisma şema | Backend |
| 4 | Auth (kayıt/giriş/JWT) | Backend |
| 5 | Admin doğrulama kuyruğu | Backend |
| 6 | Post CRUD | Backend |
| 7 | Başvuru akışı | Backend |
| 8 | Socket.io chat | Backend |
| 9 | Auth ekranları | Frontend |
| 10 | Post listeleme & oluşturma | Frontend |
| 11 | Chat ekranları | Frontend |
| 12 | Navigasyon & profil | Frontend |
| 13 | Entegrasyon testi | Her ikisi |

---

*Bu plan UniNode PRD.md ve MVP_Kapsam.md dokümanlarına dayanmaktadır.*
*Her adım önceki adımın tamamlanmış olmasını gerektirir.*
