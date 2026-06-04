# UniNode — User Flow

Mermaid formatında. [mermaid.live](https://mermaid.live) adresine yapıştırarak görselleştirebilirsin.

```mermaid
flowchart TD
    A([Uygulama Açılır]) --> B[Onboarding\n3 slide]
    B --> C{Hesap var mı?}
    C -- Evet --> D[Login Ekranı]
    C -- Hayır --> E[Register — Adım 1\nBilgiler]
    E --> F[Register — Adım 2\nKimlik Kartı Yükle]
    F --> G[Bekleme Durumu\nisVerified: false]
    G --> H{Admin Onayı}
    H -- Reddedildi --> F
    H -- Onaylandı --> I
    D --> I[Ana Uygulama]

    I --> J[Tab: Keşfet]
    I --> K[Tab: Post At]
    I --> L[Tab: Mesajlar]
    I --> M[Tab: Profil]

    J --> J1[Post Listesi\nfiltre: tümü/konser/sinema...]
    J1 --> J2[Post Detay]
    J2 --> J3{Başvur?}
    J3 -- Evet --> J4[Başvuru Gönderildi\nbekleme durumu]
    J3 -- Hayır --> J1

    K --> K1[Form: başlık + tür\n+ tarih + kişi sayısı]
    K1 --> K2[Yayınla]
    K2 --> K3[Başarı Ekranı]
    K3 --> J1

    K2 --> K4[Başvuru Geldi\nBildirim]
    K4 --> K5[Başvuranın Profili]
    K5 --> K6{Kabul / Red}
    K6 -- Kabul --> K7[Chat Otomatik Açılır]
    K6 -- Red --> K4

    L --> L1[Konuşma Listesi]
    L1 --> L2[Chat Ekranı\ngerçek zamanlı]

    M --> M1[Profil Görüntüle]
    M1 --> M2[Düzenle]
    M1 --> M3[Çıkış Yap]
    M3 --> D
```

---

## Ekran Listesi (Özet)

| # | Ekran | Açıklama |
|---|---|---|
| 1 | Onboarding | 3 slide, değer önerisi |
| 2 | Login | Email + şifre |
| 3 | Register — Bilgiler | Ad, üniversite, email, şifre |
| 4 | Register — Kimlik | Kart fotoğrafı yükleme |
| 5 | Bekleme | isVerified: false durumu |
| 6 | Feed | Filtreli post listesi |
| 7 | Post Detay | Açıklama + başvur butonu |
| 8 | Post Oluştur | Form + yayınla |
| 9 | Mesajlar | Konuşma listesi |
| 10 | Chat | Gerçek zamanlı mesajlaşma |
| 11 | Profil | Stats + ilgi alanları + ayarlar |
