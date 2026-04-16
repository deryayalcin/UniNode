# MVP Kapsam Dokümanı
## UniNode — Minimum Viable Product

**Versiyon:** 1.0  
**Tarih:** Nisan 2026

---

UniNode MVP'sinin amacı şu soruyu yanıtlamaktır:

**"Öğrenci kimlik doğrulamalı, chat ve etkinlik odaklı bir sosyal uygulamaya gerçek talep var mı?"**

---

## Temel Varsayımlar (Test Edilecek)

1. Öğrenciler fake hesaplar yüzünden mevcut uygulamalara güvenmiyor.
2. Kimlik doğrulaması güven sorununu çözerse kullanıcılar platforma geçer.
3. "Etkinliğe birlikte git" odaklı akış, genel arkadaşlık applerinden farklılaşır.
4. Chat özelliği kullanıcıları platforma bağlar ve retention'ı artırır.

---

## MVP Kapsamı

### Dahil Olan (Must-Have)

#### 1. Öğrenci Kimlik Doğrulama
- Kullanıcı kayıt sırasında öğrenci kimlik kartı fotoğrafı yükler
- Basit AI sınıflandırması: "Bu bir öğrenci kimlik kartı mı?" (binary)
- Onay kuyruğu: şüpheli görseller manuel review'a düşer
- Onaylanmayan hesaplar platforma erişemez
- **V2 notu:** CNN modeli ile tam otomatik kart tanıma

#### 2. Profil Oluşturma
- Ad soyad
- Profil fotoğrafı
- Üniversite adı (doğrulamadan çekilerek otomatik doldurulabilir)
- İlgi alanları (çoklu seçim: müzik, spor, sinema, gezi vb.)
- Kısa bio (opsiyonel)

#### 3. In-App Messaging (Chat)
- Doğrulanmış öğrenciler birebir (DM) mesajlaşabilir
- Etkinlik postu kabul sonrası chat otomatik olarak açılır
- Mesaj listesi: tüm aktif konuşmalar bir arada
- Basit, gerçek zamanlı mesajlaşma (WebSocket)
- **V2 notu:** Grup chat kanalları

#### 4. Etkinlik Postu Atma
- Başlık (örn: "Atatürk Kültür Merkezi konsere kim gelir?")
- Tarih ve saat
- Etkinlik türü (konser, sinema, spor, gezi, diğer)
- Kaç kişi aranıyor (1–5)
- Kısa açıklama (opsiyonel)

#### 5. Post Keşfetme
- Tüm aktif postları listele
- Tarihe göre sırala (yakın tarih önce)
- Temel bilgileri göster (başlık, tarih, üniversite, kişi sayısı)

#### 6. Başvur / Kabul Et Akışı
- Kullanıcı bir posta "katılmak istiyorum" ile başvurur
- Post sahibi başvuranın profilini görür
- Kabul veya red eder
- Kabul sonrası: in-app chat otomatik açılır

---

### Dahil Olmayan (Kapsam Dışı — V2+)

| Feature | Neden Dışarıda? |
|---|---|
| Grup chat | Karmaşıklığı artırır; birebir chat V1 için yeterli |
| Push bildirimler | Teknik karmaşıklık; V1'de e-posta/SMS yeterli |
| Filtreler (kategori, mesafe) | Post sayısı azken filtre gereksiz |
| Değerlendirme sistemi | Kullanıcı tabanı oluşmadan anlamsız |
| Stories / feed | Ürünü yanlış konumlandırır (Instagram değiliz) |
| Ödeme / bilet | V3+ hayali |
| CNN kart doğrulama | Manuel review V1 için yeterli |

---

## Eisenhower Matrisi — Feature Önceliklendirme

| | Acil | Acil Değil |
|---|---|---|
| **Önemli** | Kimlik doğrulama, profil, chat (DM), post atma, keşif, başvuru akışı | Grup chat, filtreler, bildirimler |
| **Önemsiz** | — | Stories, ödeme, konum eşleşme |


---

## MVP Başarı Kriterleri

| Kriter | Hedef |
|---|---|
| Doğrulanmış kayıt | En az 50 kullanıcı |
| Etkinlik postları | En az 20 aktif post |
| Post başına başvuru | Ortalama 2+ |
| Chat engajmanı | Haftada kullanıcı başına ortalama 5+ mesaj |
| 2. hafta retention | Kullanıcıların %40'ı aktif |

---

## Geliştirme Sırası (Sprint Önerisi)

```
Sprint 1: Kimlik doğrulama + profil oluşturma
Sprint 2: In-app messaging (DM) — WebSocket kurulumu + chat UI
Sprint 3: Post atma + keşif ekranı
Sprint 4: Başvuru / kabul akışı + chat entegrasyonu
Sprint 5: Test, hata düzeltme, ilk kullanıcı lansmanı
```
