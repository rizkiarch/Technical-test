# 🌟 Pet Care Management System - Frontend

Frontend aplikasi manajemen perawatan hewan berbasis React dengan fitur lengkap untuk registrasi, checkout, dan manajemen data hewan.

## 📋 Daftar Isi

- [Prasyarat](#prasyarat)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Fitur Utama](#fitur-utama)
- [Instalasi dan Setup](#instalasi-dan-setup)
- [Struktur Project](#struktur-project)
- [API Integration](#api-integration)
- [Troubleshooting](#troubleshooting)

## 🔧 Prasyarat

Pastikan sistem Anda sudah memiliki:

- **Node.js** (versi 18.0 atau lebih baru)
- **npm** atau **yarn** untuk package manager
- **Backend services** sudah berjalan (lihat backend README)

### Verifikasi Instalasi

```bash
# Cek versi Node.js
node --version

# Cek versi npm
npm --version

# Pastikan backend sudah berjalan
curl http://localhost:8080/api/health
```

## 🛠 Teknologi yang Digunakan

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| React | 18.x | Frontend Framework |
| Vite | 5.x | Build Tool & Dev Server |
| JavaScript | ES6+ | Programming Language |
| CSS3 | - | Styling |
| Fetch API | - | HTTP Client |

## ✨ Fitur Utama

### 🐾 Manajemen Hewan
- **Registrasi Hewan Baru** dengan upload foto (max 2MB)
- **Daftar Hewan** dengan pagination dan filtering
- **Detail Hewan** dengan informasi lengkap
- **Update Data Hewan**
- **Hapus Data Hewan** dengan konfirmasi

### 📊 Dashboard & Tabel
- **Tabel Interaktif** dengan sorting dan filtering
- **Pencarian** berdasarkan nama hewan atau pemilik
- **Filter Status** (checked-in/checked-out)
- **Responsive Design** untuk semua ukuran layar

### 💰 Sistem Checkout
- **Checkout Otomatis** dengan perhitungan biaya
- **Validasi Waktu** checkout harus setelah registrasi
- **Kalkulasi Durasi** dalam hari, jam, dan menit
- **Format Mata Uang** Indonesia (Rupiah)

### 📱 User Experience
- **Modal Popup** untuk form registrasi dan checkout
- **Loading States** dan error handling
- **Image Fallback** jika foto tidak tersedia
- **Real-time Updates** setelah operasi CRUD

## 🚀 Instalasi dan Setup

### Langkah 1: Pastikan Backend Berjalan

```bash
# Cek backend services
curl http://localhost:8080/api/animals
# Harus return JSON response dengan data animals
```

### Langkah 2: Clone dan Install Dependencies

```bash
# Masuk ke direktori frontend
cd microservices/frontend

# Install dependencies
npm install

# Atau menggunakan yarn
yarn install
```

### Langkah 3: Setup Environment Variables

```bash
# Copy file environment (jika ada)
cp .env.example .env

# Edit konfigurasi jika diperlukan
# nano .env
```

File `.env` (opsional):
```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=Pet Care Management
```

### Langkah 4: Jalankan Development Server

```bash
# Start development server
npm run dev

# Atau menggunakan yarn
yarn dev
```

Output yang diharapkan:
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:3001/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### Langkah 5: Akses Aplikasi

Buka browser dan akses: **http://localhost:3001**

## 📁 Struktur Project

```
frontend/
├── public/                 # Static assets
│   ├── vite.svg
│   └── favicon.ico
├── src/                   # Source code
│   ├── components/        # Reusable components
│   │   ├── ImageWithFallback.jsx
│   │   ├── PopupRegister.jsx
│   │   ├── PopupOut.jsx
│   │   └── TableComponentNew.jsx
│   ├── lib/              # Utility functions
│   │   ├── animalIdUtils.js
│   │   ├── dataMapper.js
│   │   ├── dateUtils.js
│   │   ├── formatRupiah.js
│   │   └── storageUtils.js
│   ├── pages/            # Page components
│   │   └── Animals/
│   │       └── index.jsx
│   ├── styles/           # CSS files
│   │   ├── global.css
│   │   ├── modal.css
│   │   └── table.css
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
└── README.md            # Documentation
```

## 🔗 API Integration

### Base URL Configuration

```javascript
// Konfigurasi API base URL
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
```

### ID Encoding untuk KrakenD

```javascript
// Encode animal ID dengan base64 untuk handling slash
import { encodeAnimalId } from '../lib/animalIdUtils';

const encodedId = encodeAnimalId(animalId); // "250919/Anjing/003" → "MjUwOTE5L0FuamluZy8wMDM="
```

### File Upload Handling

```javascript
// FormData untuk upload foto
const formData = new FormData();
formData.append('name_animal', animalName);
formData.append('photo', photoFile);

const response = await fetch(`${baseUrl}/api/animals`, {
    method: 'POST',
    body: formData // Otomatis set content-type multipart/form-data
});
```

### Error Handling

```javascript
try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    // Handle success
} catch (error) {
    console.error('API Error:', error);
    alert(`Failed: ${error.message}`);
}
```

## 🎨 Komponen Utama

### 1. Animals Page (`src/pages/Animals/index.jsx`)

**Fungsi**: Halaman utama aplikasi
**Fitur**:
- Fetch dan display daftar hewan
- Handle CRUD operations
- Modal management
- Real-time cost calculation

### 2. PopupRegister (`src/components/PopupRegister.jsx`)

**Fungsi**: Modal untuk registrasi hewan baru
**Fitur**:
- Form validation
- Photo upload dengan preview
- File size validation (max 2MB)
- Manual time registration

### 3. PopupOut (`src/components/PopupOut.jsx`)

**Fungsi**: Modal untuk checkout hewan
**Fitur**:
- Time validation (checkout > registration)
- Automatic cost calculation
- Duration display (days, hours, minutes)
- Rupiah formatting

### 4. TableComponentNew (`src/components/TableComponentNew.jsx`)

**Fungsi**: Tabel interaktif untuk data hewan
**Fitur**:
- Sorting by columns
- Search/filter functionality
- Status filtering (checked-in/out)
- Action buttons (checkout, delete)

### 5. ImageWithFallback (`src/components/ImageWithFallback.jsx`)

**Fungsi**: Image component dengan fallback
**Fitur**:
- Automatic fallback ke placeholder
- Loading states
- Error handling

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Cek process yang menggunakan port 3001
lsof -ti:3001

# Kill process jika perlu
kill -9 $(lsof -ti:3001)

# Atau ubah port
npm run dev -- --port 3002
```

### API Connection Failed

```bash
# Cek backend status
curl http://localhost:8080/api/health

# Cek CORS headers
curl -H "Origin: http://localhost:3001" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     http://localhost:8080/api/animals
```

### CORS Issues

Jika muncul CORS error:
1. Pastikan backend KrakenD sudah dikonfigurasi CORS
2. Restart KrakenD service: `docker-compose restart krakend`
3. Clear browser cache dan cookies

### Photo Upload Failed

```bash
# Cek file size (max 2MB)
# Cek format file (jpg, jpeg, png, gif)
# Pastikan backend endpoint mendukung multipart/form-data
```

### Build Issues

```bash
# Clear node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 🧪 Testing

### Manual Testing Checklist

#### ✅ Animal Registration
- [ ] Form validation bekerja
- [ ] Photo upload berhasil (< 2MB)
- [ ] Data tersimpan di database
- [ ] List ter-refresh otomatis

#### ✅ Animal Checkout
- [ ] Modal checkout terbuka
- [ ] Time validation bekerja
- [ ] Cost calculation benar
- [ ] Checkout berhasil tersimpan

#### ✅ Table Operations
- [ ] Sorting berkerja untuk semua kolom
- [ ] Search/filter berfungsi
- [ ] Status filter aktif
- [ ] Delete confirmation muncul

#### ✅ Image Handling
- [ ] Image loading dengan benar
- [ ] Fallback placeholder muncul
- [ ] Storage endpoint accessible

### API Testing

```bash
# Test registration
curl -X POST http://localhost:8080/api/animals \
  -F "name_animal=Test" \
  -F "name_owner=User" \
  -F "type_animal=Kucing" \
  -F "email_owner=test@example.com"

# Test image access
curl http://localhost:8080/api/storage/animals/test-image.jpg
```

## 📦 Build untuk Production

```bash
# Build production
npm run build

# Preview production build
npm run preview

# Build files akan ada di folder 'dist/'
```

## 🔄 Development Workflow

### Hot Reload Development

```bash
# Start dengan hot reload
npm run dev

# File akan auto-reload ketika ada perubahan
```

### Code Structure Best Practices

1. **Components**: Reusable, single responsibility
2. **Utils**: Pure functions, no side effects
3. **Styles**: Modular CSS, semantic naming
4. **API**: Centralized error handling
5. **State**: Minimal, predictable updates

## 📱 Responsive Design

Aplikasi mendukung:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

CSS breakpoints:
```css
/* Mobile first approach */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1200px) { /* Desktop */ }
```

## 🚨 Production Checklist

Sebelum deploy production:

- [ ] Environment variables configured
- [ ] API URLs point to production backend
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Form validation complete
- [ ] Image optimization done
- [ ] Performance testing passed
- [ ] Cross-browser testing done
- [ ] Mobile responsiveness verified
- [ ] Security headers configured

---

## 📞 Support

Jika mengalami masalah:

1. Cek console browser untuk error messages
2. Verify backend services status
3. Check network tab untuk failed requests
4. Review [Troubleshooting](#troubleshooting) section

**Happy coding! 🚀**
