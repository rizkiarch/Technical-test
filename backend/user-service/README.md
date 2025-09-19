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

### Langkah 3: Jalankan Seeder (WAJIB)

```bash
# Seeder untuk kategori hewan (WAJIB dijalankan)
php artisan db:seed --class=CategorySeeder

# Output yang diharapkan:
# Database seeding completed successfully.

# Seeder untuk data dummy animals (opsional)
php artisan db:seed --class=AnimalSeeder

# Atau jalankan semua seeder sekaligus
php artisan db:seed

# Exit dari container
exit
```

### Langkah 4: Verifikasi Database

```bash
# Akses PhpMyAdmin di browser
# URL: http://localhost:8081
# Username: user
# Password: password
# Database: pet_care

# Atau cek via command line
docker-compose exec mysql mysql -u user -ppassword -e "USE pet_care; SHOW TABLES;"
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