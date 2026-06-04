# UniNode Design System

## Felsefe
UniNode, doğrulanmış öğrencilerin buluştuğu güvenli bir alan.
Tasarım dili: **güven + enerji + sadelik.**
Dark mode first. Sürtünmesiz akış. Micro-interaction ile küçük başarı hisleri.

---

## Renkler

| Token | Hex | Kullanım |
|---|---|---|
| `--bg` | `#0D0D0F` | Ana arka plan |
| `--surface` | `#16161A` | Kart, bottom nav |
| `--surface-high` | `#1E1E24` | Input, chip |
| `--border` | `rgba(255,255,255,0.07)` | Hafif ayırıcı |
| `--border-mid` | `rgba(255,255,255,0.12)` | Vurgulu border |
| `--accent` | `#7C6FFF` | CTA, aktif tab, link |
| `--accent-dim` | `rgba(124,111,255,0.15)` | Accent fill |
| `--success` | `#3DDBA5` | Doğrulanmış, onay |
| `--success-dim` | `rgba(61,219,165,0.12)` | Success fill |
| `--warn` | `#F5A623` | Uyarı |
| `--warn-dim` | `rgba(245,166,35,0.12)` | Warning fill |
| `--danger` | `#F06363` | Hata, kritik |
| `--text` | `#F0EFF8` | Ana metin |
| `--text-sub` | `rgba(240,239,248,0.55)` | İkincil metin |
| `--text-muted` | `rgba(240,239,248,0.30)` | Placeholder, label |

### Etkinlik Türü Renkleri

| Tür | Renk | Arka Plan |
|---|---|---|
| konser | `#7C6FFF` | `rgba(124,111,255,0.15)` |
| sinema | `#F5A623` | `rgba(245,166,35,0.12)` |
| spor | `#3DDBA5` | `rgba(61,219,165,0.12)` |
| gezi | `#F06363` | `rgba(240,99,99,0.12)` |

---

## Tipografi

| Token | Font | Kullanım |
|---|---|---|
| `--font-display` | Syne (700, 800) | Başlıklar, logo |
| `--font-body` | DM Sans (400, 500, 600) | Her şey diğer |

### Boyutlar

| Rol | Boyut | Ağırlık |
|---|---|---|
| H1 (sayfa başlığı) | 24–28px | 800 |
| H2 (section başlığı) | 18–20px | 700 |
| H3 (kart başlığı) | 14–16px | 700 |
| Body | 13–14px | 400 |
| Caption / Label | 11–12px | 400–500 |

---

## Boşluk & Radius

| Token | Değer |
|---|---|
| `--radius-sm` | 8px |
| `--radius-md` | 12px |
| `--radius-lg` | 16px |
| `--radius-xl` | 24px |
| `--radius-full` | 999px |

Boşluklar: 4 / 8 / 12 / 16 / 24 / 32px

---

## Komponentler

### Buton — Primary
```
background: var(--accent)
color: #fff
border: none
border-radius: var(--radius-lg)
padding: 14px
font: DM Sans 600 15px
```

### Buton — Ghost
```
background: transparent
color: var(--text-sub)
border: 1px solid var(--border)
border-radius: var(--radius-full)
padding: 5px 14px
font: DM Sans 400 12px
```

### Input
```
background: var(--surface-high)
border: 1px solid var(--border)
border-radius: var(--radius-md)
padding: 12px 14px
color: var(--text)
font: DM Sans 400 14px
```
Focus: `border-color: var(--accent)`

### Kart
```
background: var(--surface)
border: 0.5px solid var(--border)
border-radius: var(--radius-lg)
padding: 14px 16px
```

### Avatar
```
border-radius: 50%
background: var(--accent-dim)
border: 1.5px solid rgba(124,111,255,0.27)
font: DM Sans 600 — initials
```

### Doğrulanmış Rozet
```
background: var(--success)
color: #0D0D0F
border-radius: 50%
font-weight: 700
içerik: ✓
```

### Etkinlik Chip
```
border-radius: var(--radius-full)
padding: 3px 8px
font: DM Sans 500 11px
renk: türe göre (bkz. Etkinlik Türü Renkleri)
```

### Bottom Nav
```
background: var(--surface)
border-top: 0.5px solid var(--border)
height: ~56px (+ safe area)
aktif ikon: var(--accent)
pasif ikon: var(--text-muted)
```

---

## İkonografi Kuralları

Standart kalıplar **kırılmaz:**

| İkon | Anlam |
|---|---|
| ⊟ veya grid | Ana sayfa / Keşfet |
| ⊕ veya + | Yeni oluştur |
| ◫ veya baloncuk | Mesajlar |
| ◯ veya insan | Profil |
| ← | Geri |
| ✓ | Onay / Başarı |
| ↑ | Gönder |

---

## Micro-interaction Kuralları

- Buton tıklaması: `transform: scale(0.97)` + `transition: 0.1s`
- Başvuru başarısı: yeşile dönüş + "✓ Başvurun Gönderildi"
- Kimlik yükleme: dashed border yeşile döner, ok → ✓
- Post yayınlama: tam sayfa başarı ekranı (✓ + mesaj)
- Mesaj gönderme: input temizlenir, mesaj balonu eklenir

---

## Yapılmaz Listesi

- Beyaz arka plan kullanma
- Inter veya Roboto font kullanma
- Mor gradyan arka plan
- Gölge (box-shadow) dekoratif amaçlı
- 3'ten fazla farklı renk aynı ekranda
- Doğrulama olmadan platforma erişim izni verme
