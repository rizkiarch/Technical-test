# 🐾 Pet Care Management System - Backend Service

Sistem manajemen perawatan hewan berbasis mikroservice menggunakan Laravel, MySQL, Redis, dan KrakenD API Gateway.

## 📋 Daftar Isi

- [Prasyarat](#prasyarat)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Instalasi dan Setup](#instalasi-dan-setup)
- [Migrasi Database](#migrasi-database)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Testing](#testing)

## 🔧 Prasyarat

Pastikan sistem Anda sudah memiliki:

- **Docker** (versi 20.10 atau lebih baru)
- **Docker Compose** (versi 2.0 atau lebih baru)
- **Git** untuk clone repository
- **Terminal/Command Prompt** untuk menjalankan perintah

### Verifikasi Instalasi

```bash
# Cek versi Docker
docker --version

# Cek versi Docker Compose
docker-compose --version

# Pastikan Docker daemon berjalan
docker ps
```

## 🛠 Teknologi yang Digunakan

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| Laravel | 11.x | Backend API Framework |
| PHP | 8.2 | Programming Language |
| MySQL | 8.0 | Database |
| Redis | 7.0 | Cache & Session Storage |
| KrakenD | 2.5 | API Gateway |
| Nginx | Latest | Web Server |
| PhpMyAdmin | Latest | Database Management |

## 🏗 Arsitektur Sistem

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   KrakenD       │───▶│   Laravel API   │
│   (Port 3001)   │    │   (Port 8080)   │    │   (Port 6000)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                │                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Nginx         │    │   MySQL         │
                       │   (Port 80)     │    │   (Port 3306)   │
                       └─────────────────┘    └─────────────────┘
                                                       │
                                              ┌─────────────────┐
                                              │   Redis         │
                                              │   (Port 6379)   │
                                              └─────────────────┘
```

## 🚀 Instalasi dan Setup

### Langkah 1: Clone Repository

```bash
# Clone repository
git clone [repository-url]
cd microservices/backend

# Pastikan Anda berada di direktori backend
pwd
# Output harus: /path/to/microservices/backend
```

### Langkah 2: Setup Environment Variables

```bash
# Copy file environment
cd user-service
cp .env.example .env

# Edit file .env jika diperlukan (opsional untuk development)
# nano .env
```

Konfigurasi default di `.env`:
```env
APP_NAME="Pet Care API"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:6000

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=pet_care
DB_USERNAME=user
DB_PASSWORD=password

CACHE_STORE=database
REDIS_HOST=redis
REDIS_PORT=6379
```

### Langkah 3: Build dan Jalankan Containers

```bash
# Kembali ke direktori backend
cd ..

# Build dan jalankan semua services
docker-compose up -d --build

# Tunggu hingga semua container berjalan (sekitar 2-3 menit)
# Cek status containers
docker-compose ps
```

Output yang diharapkan:
```
NAME                     COMMAND                  SERVICE    STATUS
microservices-krakend    "/usr/bin/krakend ru…"   krakend    Up
microservices-mysql      "docker-entrypoint.s…"   mysql      Up (healthy)
microservices-nginx      "/docker-entrypoint.…"   nginx      Up
microservices-redis      "docker-entrypoint.s…"   redis      Up
user-service             "docker-php-entrypoi…"   app        Up
```

### Langkah 4: Install Dependencies Laravel

```bash
# Masuk ke container Laravel
docker-compose exec app bash

# Install dependencies
composer install

# Generate application key
php artisan key:generate

# Exit dari container
exit
```

## 🗄 Migrasi Database

### Langkah 1: Tunggu MySQL Ready

```bash
# Cek logs MySQL untuk memastikan siap
docker-compose logs mysql

# Tunggu hingga muncul pesan seperti:
# "ready for connections. Version: '8.0.xx'"
```

### Langkah 2: Jalankan Migrasi

```bash
# Masuk ke container Laravel
docker-compose exec app bash

# Jalankan migrasi database
php artisan migrate

# Output yang diharapkan:
# Migrating: 2014_10_12_000000_create_users_table
# Migrated:  2014_10_12_000000_create_users_table (xx.xxms)
# Migrating: 2024_xx_xx_xxxxxx_create_animals_table
# Migrated:  2024_xx_xx_xxxxxx_create_animals_table (xx.xxms)
# Migrating: 2024_xx_xx_xxxxxx_create_categories_table
# Migrated:  2024_xx_xx_xxxxxx_create_categories_table (xx.xxms)
```

### Langkah 3: Setup Data Kategori (WAJIB)

Anda memiliki 2 pilihan untuk setup data kategori yang diperlukan:

#### Option A: Menggunakan Seeder (Recommended)

```bash
# Seeder untuk kategori hewan (WAJIB dijalankan)
php artisan db:seed --class=CategorySeeder

# Output yang diharapkan:
# Categories seeded successfully!
# Created 5 categories:
# - Anjing
# - Kucing
# - Kelinci
# - Reptil
# - Lainnya

# Seeder untuk data dummy animals (opsional)
php artisan db:seed --class=AnimalSeeder

# Output yang diharapkan:
# Animals seeded successfully!
# Created 5 animals:
# - Buddy (Anjing) - Checked In
# - Whiskers (Kucing) - Checked In
# - Max (Anjing) - Checked Out
# - Luna (Kucing) - Checked In
# - Fluffy (Kelinci) - Checked In

# Atau jalankan semua seeder sekaligus
php artisan db:seed
```

#### Option B: Menggunakan API Calls (Manual)

Jika Anda prefer menggunakan API calls, keluar dari container dan jalankan curl commands:

```bash
# Exit dari container terlebih dahulu
exit

# Tambah kategori Anjing
curl -X POST "http://localhost:8080/api/categories" \
  -H "Content-Type: application/json" \
  -d '{"type": "Anjing"}'

# Tambah kategori Kucing
curl -X POST "http://localhost:8080/api/categories" \
  -H "Content-Type: application/json" \
  -d '{"type": "Kucing"}'

# Tambah kategori Kelinci
curl -X POST "http://localhost:8080/api/categories" \
  -H "Content-Type: application/json" \
  -d '{"type": "Kelinci"}'

# Tambah kategori Reptil
curl -X POST "http://localhost:8080/api/categories" \
  -H "Content-Type: application/json" \
  -d '{"type": "Reptil"}'

# Tambah kategori Lainnya
curl -X POST "http://localhost:8080/api/categories" \
  -H "Content-Type: application/json" \
  -d '{"type": "Lainnya"}'

# Verifikasi kategori berhasil ditambahkan
curl -X GET "http://localhost:8080/api/categories"
```

#### Option C: Menggunakan Tinker (Advanced)

Jika Anda prefer menggunakan Laravel Tinker:

```bash
# Masuk ke container Laravel
docker-compose exec app bash

# Jalankan tinker
php artisan tinker

# Di dalam tinker, jalankan commands berikut satu per satu:
```

```php
// Hapus kategori yang sudah ada (jika ada)
App\Models\Category::truncate();

// Tambah kategori satu per satu
App\Models\Category::create(['type' => 'Anjing']);
App\Models\Category::create(['type' => 'Kucing']);
App\Models\Category::create(['type' => 'Kelinci']);
App\Models\Category::create(['type' => 'Reptil']);
App\Models\Category::create(['type' => 'Lainnya']);

// Verifikasi
App\Models\Category::all();

// Exit dari tinker
exit;
```

```bash
# Exit dari container
exit
```

### Langkah 4: Verifikasi Setup Database

Pilih salah satu cara untuk memverifikasi database:

#### Via PhpMyAdmin (GUI)
```bash
# Akses PhpMyAdmin di browser
# URL: http://localhost:8081
# Username: user
# Password: password
# Database: pet_care
```

#### Via Command Line MySQL
```bash
# Cek tabel yang tersedia
docker-compose exec mysql mysql -u user -ppassword -e "USE pet_care; SHOW TABLES;"

# Cek data categories
docker-compose exec mysql mysql -u user -ppassword -e "USE pet_care; SELECT * FROM categories;"

# Cek jumlah data animals (jika menggunakan AnimalSeeder)
docker-compose exec mysql mysql -u user -ppassword -e "USE pet_care; SELECT COUNT(*) as total_animals FROM animals;"
```

#### Via API Endpoints
```bash
# Cek daftar kategori via API
curl http://localhost:8080/api/categories

# Cek daftar animals via API
curl http://localhost:8080/api/animals

# Response yang diharapkan untuk categories:
# {
#   "data": [
#     {"id": 1, "type": "Anjing", "created_at": "...", "updated_at": "..."},
#     {"id": 2, "type": "Kucing", "created_at": "...", "updated_at": "..."},
#     // ... dst
#   ],
#   "message": "Categories retrieved successfully",
#   "status": "success"
# }
```

#### Via Laravel Tinker
```bash
# Masuk ke container Laravel
docker-compose exec app bash

# Jalankan tinker untuk quick check
php artisan tinker

# Di dalam tinker:
# App\Models\Category::count();  // Harus return 5
# App\Models\Animal::count();    // Return jumlah animals jika ada
# exit

# Exit dari container
exit
```

Tabel yang harus ada:
- `users`
- `animals`
- `categories`
- `cache`
- `failed_jobs`
- `migrations`

## 🌐 API Endpoints

### Base URL

- **KrakenD API Gateway**: `http://localhost:8080`
- **Direct Laravel API**: `http://localhost:6000`

### Animals Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/animals` | Daftar semua hewan |
| POST | `/api/animals` | Registrasi hewan baru |
| GET | `/api/animals/{id}` | Detail hewan |
| PUT | `/api/animals/{id}` | Update data hewan |
| DELETE | `/api/animals/{id}` | Hapus data hewan |
| POST | `/api/animals/{id}/checkout` | Checkout hewan |

### Categories Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/categories` | Daftar kategori |
| POST | `/api/categories` | Tambah kategori |
| GET | `/api/categories/{type}` | Detail kategori |

### Storage Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/storage/animals/{path}` | Akses file gambar |

### Contoh Penggunaan

```bash
# Daftar semua hewan
curl http://localhost:8080/api/animals

# Registrasi hewan baru dengan foto
curl -X POST http://localhost:8080/api/animals \
  -F "name_animal=Buddy" \
  -F "name_owner=John Doe" \
  -F "type_animal=Anjing" \
  -F "email_owner=john@example.com" \
  -F "phone_owner=08123456789" \
  -F "weight=15" \
  -F "time_registered=2025-09-19 10:00:00" \
  -F "photo=@/path/to/image.jpg"

# Checkout hewan
curl -X POST http://localhost:8080/api/animals/MjUwOTE5L0FuamluZy8wMDM=/checkout \
  -H "Content-Type: application/json" \
  -d '{"time_out": "2025-09-19 15:30:00"}'
```

## 🔧 Troubleshooting

### Container Tidak Bisa Start

```bash
# Cek logs container yang bermasalah
docker-compose logs [service-name]

# Restart specific service
docker-compose restart [service-name]

# Rebuild dari awal jika perlu
docker-compose down
docker-compose up -d --build
```

### Database Connection Error

```bash
# Cek status MySQL
docker-compose exec mysql mysqladmin -u user -ppassword ping

# Reset database jika perlu
docker-compose exec app php artisan migrate:fresh --seed
```

### Seeder Issues

```bash
# Jika CategorySeeder gagal
docker-compose exec app php artisan db:seed --class=CategorySeeder --force

# Jika AnimalSeeder gagal karena foreign key
# Pastikan CategorySeeder sudah jalan terlebih dahulu
docker-compose exec app php artisan db:seed --class=CategorySeeder
docker-compose exec app php artisan db:seed --class=AnimalSeeder

# Reset dan fresh seeding
docker-compose exec app php artisan migrate:fresh
docker-compose exec app php artisan db:seed

# Manual category creation via API jika seeder tidak berfungsi
curl -X POST "http://localhost:8080/api/categories" -H "Content-Type: application/json" -d '{"type": "Anjing"}'
curl -X POST "http://localhost:8080/api/categories" -H "Content-Type: application/json" -d '{"type": "Kucing"}'
curl -X POST "http://localhost:8080/api/categories" -H "Content-Type: application/json" -d '{"type": "Kelinci"}'
curl -X POST "http://localhost:8080/api/categories" -H "Content-Type: application/json" -d '{"type": "Reptil"}'
curl -X POST "http://localhost:8080/api/categories" -H "Content-Type: application/json" -d '{"type": "Lainnya"}'
```

### Permission Issues

```bash
# Fix permission Laravel storage
docker-compose exec app chmod -R 777 storage bootstrap/cache

# Fix ownership
docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
```

### KrakenD CORS Issues

```bash
# Restart KrakenD service
docker-compose restart krakend

# Cek konfigurasi CORS di krakend.json
```

### Port Already in Use

```bash
# Cek port yang digunakan
netstat -tulpn | grep :8080
netstat -tulpn | grep :3306

# Stop service yang konflik atau ubah port di docker-compose.yml
```

## 🧪 Testing

### Health Check

```bash
# Cek semua services
curl http://localhost:8080/api/health

# Cek direct Laravel
curl http://localhost:6000/api/health
```

### Database Test

```bash
# Masuk ke container dan test database
docker-compose exec app php artisan tinker

# Di dalam tinker:
# App\Models\Category::all();
# App\Models\Animal::count();
# exit
```

### API Test dengan Postman

Import collection Postman atau test manual:

1. **GET Animals**: `http://localhost:8080/api/animals`
2. **POST Animal**: `http://localhost:8080/api/animals`
   - Form-data dengan photo upload
3. **Checkout**: `http://localhost:8080/api/animals/{encoded_id}/checkout`

## 📝 Logs

```bash
# Laravel logs
docker-compose exec app tail -f storage/logs/laravel.log

# KrakenD logs
docker-compose logs -f krakend

# MySQL logs
docker-compose logs -f mysql

# Semua logs
docker-compose logs -f
```

## 🔄 Update dan Maintenance

### Update Code

```bash
# Pull latest changes
git pull origin main

# Rebuild containers
docker-compose down
docker-compose up -d --build

# Run new migrations if any
docker-compose exec app php artisan migrate
```

### Quick Commands untuk Development

```bash
# Reset database dan seeding ulang
docker-compose exec app php artisan migrate:fresh --seed

# Hanya reset categories
docker-compose exec app php artisan db:seed --class=CategorySeeder --force

# Clear cache aplikasi
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan route:clear

# Check status semua containers
docker-compose ps

# Restart specific service
docker-compose restart [service-name]

# View logs real-time
docker-compose logs -f [service-name]
```

### API Quick Test Commands

```bash
# Test semua endpoint utama
curl http://localhost:8080/api/health
curl http://localhost:8080/api/categories
curl http://localhost:8080/api/animals

# Test POST category
curl -X POST "http://localhost:8080/api/categories" \
  -H "Content-Type: application/json" \
  -d '{"type": "TestCategory"}'

# Test POST animal dengan form-data
curl -X POST "http://localhost:8080/api/animals" \
  -F "name_animal=TestAnimal" \
  -F "name_owner=TestOwner" \
  -F "type_animal=Anjing" \
  -F "email_owner=test@example.com" \
  -F "phone_owner=08123456789" \
  -F "weight=10" \
  -F "time_registered=2025-09-19 15:00:00"
```

### Backup Database

```bash
# Backup database
docker-compose exec mysql mysqldump -u user -ppassword pet_care > backup.sql

# Restore database
docker-compose exec -T mysql mysql -u user -ppassword pet_care < backup.sql
```

## 🚨 Production Deployment

Untuk production, ubah konfigurasi berikut:

1. Set `APP_ENV=production` di `.env`
2. Set `APP_DEBUG=false`
3. Generate secure `APP_KEY`
4. Update database credentials
5. Setup SSL certificates
6. Configure proper firewall rules
7. Setup monitoring dan logging

---

## 📞 Support

Jika mengalami masalah:

1. Cek [Troubleshooting](#troubleshooting) section
2. Periksa logs container: `docker-compose logs [service]`
3. Pastikan semua port tidak konflik
4. Verifikasi file `.env` sudah benar

**Selamat menggunakan Pet Care Management System! 🐕🐱**