# Product Requirements Document (PRD)
## UniNode — Doğrulanmış Öğrenci Sosyal & Chat Platformu

**Versiyon:** 1.0  
**Tarih:** Nisan 2026  
**Durum:** MVP Planlama

---

## 1. Problem Tanımı

Mevcut arkadaşlık ve sosyal etkinlik uygulamalarında iki kritik sorun bulunmaktadır:

1. **Güven sorunu:** Fake hesaplar, catfish profiller ve kimlik belirsizliği kullanıcıların platforma güvenmesini engellemektedir.
2. **Yaş/bağlam uyumsuzluğu:** Kullanıcılar etkinliklere birlikte gidecek ya da sohbet edecek kişinin benzer yaş grubundan ve yaşam evresinden olup olmadığını bilemez.

Mevcut uygulamalar (Meetup, Timeleft, Bumble BFF) ya yanlış kitleye hitap etmekte, ya etkinlik seçimini kullanıcıdan almakta, ya da gerçek kimlik doğrulaması sunmamaktadır.

---

## 2. Çözüm

**UniNode**, yalnızca geçerli öğrenci kimlik kartıyla kayıt yapılabilen, güvenilir bir sosyal platform ve arkadaşlık uygulamasıdır.

Kullanıcılar:
- Doğrulanmış öğrencilerle birebir veya grup chat yapabilir
- Gitmek istedikleri etkinlikler için post atabilir, birlikte gidecek kişi arayabilir
- Genel arkadaşlık profili oluşturabilir
- Diğer doğrulanmış öğrencilerin postlarına başvurabilir

---

## 3. Hedef Kullanıcı

**Birincil:** Üniversite öğrencileri (18–26 yaş), özellikle yeni şehre taşınanlar, sosyal çevrelerini genişletmek isteyenler ve etkinliklere ya da günlük sohbete ihtiyaç duyanlar.

**Kullanıcı Acıları (Pains):**
- Etkinliklere yalnız gitmek zorunda kalmak
- Tanışma uygulamalarındaki fake/güvensiz profiller
- Bağlam uyumsuzluğu (ortak yaşam evresi paylaşmayan kişilerle eşleşmek)
- Kampüste tanıdık olmamasına rağmen sohbet edecek kimse bulamamak

**Kullanıcı Kazançları (Gains):**
- Gerçek, doğrulanmış öğrencilerle buluşmak ve sohbet etmek
- Yeni şehirde sosyal çevre kurmak
- Etkinlikleri yalnız geçirmemek, baskısız arkadaşlık
- Güvenli ve doğrulanmış bir chat ortamı

---

## 4. Değer Önerisi

> "Yalnızca gerçek öğrenciler. Sohbet et, etkinliklere birlikte git, arkadaşlık kur."

UniNode'u rakiplerinden ayıran özellik: **öğrenci kimlik doğrulaması.** Chat özelliği ise platformu yalnızca etkinlik odaklı olmaktan çıkarıp günlük sosyal bir alana dönüştürür.

---

## 5. User Story'ler

| # | Kullanıcı Hikayesi |
|---|---|
| US-01 | Bir öğrenci olarak **öğrenci kimliğimle kayıt olmak** istiyorum çünkü platformun güvenli olduğunu bilmek istiyorum. |
| US-02 | Bir öğrenci olarak **profil oluşturmak** istiyorum çünkü diğer kullanıcılar beni tanısın. |
| US-03 | Bir öğrenci olarak **doğrulanmış başka öğrencilerle chat yapmak** istiyorum çünkü yeni şehirde sosyal çevre kurmak istiyorum. |
| US-04 | Bir öğrenci olarak **"konsere birlikte gidelim" postu atmak** istiyorum çünkü yalnız gitmek istemiyorum. |
| US-05 | Bir öğrenci olarak **başkalarının postlarına başvurmak** istiyorum çünkü ilginç etkinliklere katılmak istiyorum. |
| US-06 | Bir post sahibi olarak **başvuranları kabul/red etmek** istiyorum çünkü kiminle gideceğimi seçmek istiyorum. |

---

## 6. MVP Feature Listesi

### Must-Have (V1 — MVP)

| Feature | Açıklama | Öncelik |
|---|---|---|
| Öğrenci kimlik doğrulama | Kart fotoğrafı yükleme + AI ile tarama + manuel review kuyruğu | P0 |
| Profil oluşturma | İsim, profil fotoğrafı, üniversite, ilgi alanları | P0 |
| In-app Messaging (DM) | Doğrulanmış öğrenciler arasında birebir chat; kabul sonrası otomatik açılır | P0 |
| Etkinlik postu atma | Başlık, tarih, etkinlik türü, aranan kişi sayısı | P0 |
| Post keşfetme | Tüm aktif postları listeleme, tarihe göre sıralama | P0 |
| Başvur / kabul et akışı | Başvuru gönder → post sahibi kabul/red eder → chat açılır | P0 |

### Nice-to-Have (V2 — Backlog)

| Feature | Açıklama |
|---|---|
| Grup chat | Birden fazla kullanıcıyla ortak etkinlik veya sohbet kanalı |
| Kategori filtreleme | Konser, spor, sinema, gezi vb. |
| Push bildirimler | Yeni mesaj, başvuru, kabul |
| Etkinlik sonrası değerlendirme | Güven skoru oluşturur |
| CNN tabanlı kart doğrulama | Manuel review'un yerini alır |

### MVP Dışı (Şimdilik Yok)

- Stories / feed (Instagram benzeri içerik)
- Bilet / ödeme sistemi
- Konum bazlı anlık eşleşme

---

## 7. Teknik Gereksinimler

| Alan | Karar |
|---|---|
| Platform | iOS + Android (React Native) |
| Doğrulama (V1) | Kullanıcı kart fotoğrafı yükler → basit AI sınıflandırma (kart mı?) + manuel review kuyruğu |
| Doğrulama (V2) | CNN modeli ile otomatik kart tanıma |
| Backend | REST API, kullanıcı, post ve mesaj veritabanı |
| Kimlik doğrulama | JWT tabanlı oturum yönetimi |
| Mesajlaşma | WebSocket tabanlı gerçek zamanlı chat (Socket.io veya benzeri) |
| Depolama | Profil fotoğrafları ve kart görselleri için cloud storage |

---

## 8. Başarı Metrikleri

- Haftalık aktif kullanıcı (WAU)
- Doğrulanmış kayıt oranı (başlayan / tamamlayan)
- Günlük gönderilen mesaj sayısı (chat engagement)
- Post başına ortalama başvuru sayısı
- Kabul oranı (başvuru → onay)
- 30 günlük kullanıcı tutma (retention)

---

## 9. Geliştirme Akışı

```
Problem bul
    ↓
Pazar araştırması (Meetup, Timeleft, Bumble BFF analizi)
    ↓
Value Proposition Canvas
    ↓
Önceliklendirme (Eisenhower Matrix)
    ↓
Feature listesi & MVP kapsamı
    ↓
PRD yaz  ← (bu doküman)
    ↓
Geliştir 🚀
```

---

*Bu doküman UniNode MVP_Kapsam.md ile birlikte MVP sürecini yönetmek için oluşturulmuştur.*
