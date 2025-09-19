# Starterkit Microservices

Starterkit lengkap untuk pengembangan aplikasi microservices menggunakan Docker dengan arsitektur modern yang scalable dan production-ready.

## 🏗️ Arsitektur

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│   Browser   │───▶│   Frontend   │───▶│   nginx     │───▶│   KrakenD    │
│             │    │ React + Vite │    │ Web Server  │    │ API Gateway  │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
                         :3001               :80                :8080
                                                                   │
                   ┌─────────────────────────────────────────────────┼─────────────┐
                   │                                                 ▼             │
                   │                                        ┌──────────────┐       │
                   │                                        │ User Service │       │
                   │                                        │Laravel+PHP-FPM│      │
                   │                                        └──────────────┘       │
                   │                                             :6001             │
                   │                                               │               │
                   │                            ┌──────────────────┼───────────────┤
                   │                            ▼                  ▼               │
                   │                   ┌──────────────┐    ┌──────────────┐        │
                   │                   │    MySQL     │    │    Redis     │        │
                   │                   │   Database   │    │    Cache     │        │
                   │                   └──────────────┘    └──────────────┘        │
                   │                        :3306               :6379              │
                   └───────────────────────────────────────────────────────────────┘
```

## 🚀 Tech Stack

### Backend Services
- **User Service**: Laravel 11 + PHP 8.4 + PHP-FPM
- **API Gateway**: KrakenD 2.5 (High-performance API Gateway)
- **Web Server**: nginx (Reverse proxy)
- **Database**: MySQL 8.0
- **Cache**: Redis 7.2

### Frontend
- **Framework**: React 19 + Vite 7
- **Development**: Hot Module Replacement (HMR)
- **Production**: Optimized build dengan nginx

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Networking**: Docker Bridge Networks
- **Health Checks**: Automated health monitoring
- **Volume Persistence**: Database dan logs

## 📋 Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Git
- WSL2 (untuk Windows)

## ⚡ Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/rizkiarch/starterkit-microservices.git
cd starterkit-microservices
```

### 2. Setup Backend Services
```bash
cd backend
docker-compose up -d
```

### 3. Setup Frontend (Development)
```bash
cd ../frontend
docker-compose up -d frontend-dev
```

### 4. Verify Setup
- **Frontend**: http://localhost:3001
- **API Gateway**: http://localhost:8080
- **nginx**: http://localhost:80
- **User Service**: http://localhost:6000

## 🛠️ Development

### Backend Development

#### Start all backend services:
```bash
cd backend
docker-compose up -d
```

#### Check service status:
```bash
docker-compose ps
```

#### View logs:
```bash
docker-compose logs -f [service-name]
```

#### Laravel Commands:
```bash
# Migration
docker exec user-service php artisan migrate

# Artisan commands
docker exec user-service php artisan [command]

# Access container shell
docker exec -it user-service bash
```

### Frontend Development

#### Development mode (with HMR):
```bash
cd frontend
docker-compose up -d frontend-dev
```

#### Production build:
```bash
docker-compose up -d frontend
```

#### Environment Configuration:
Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:8080/api
FRONTEND_DEV_PORT=3001
```

## 🧪 Testing API

### Using cURL

#### Get Users:
```bash
curl -X GET http://localhost:8080/api/users \
  -H "Accept: application/json"
```

#### Direct to User Service:
```bash
curl -X GET http://localhost:6000/api/users \
  -H "Accept: application/json"
```

### Using Postman

Import collection dengan base URLs:
- **Production**: `http://localhost`
- **API Gateway**: `http://localhost:8080`
- **User Service**: `http://localhost:6000`

## 📁 Project Structure

```
starterkit-microservices/
├── backend/
│   ├── .docker/
│   │   ├── database/mysql/      # MySQL configuration
│   │   ├── krakenD/            # KrakenD API Gateway
│   │   ├── nginx/              # nginx web server
│   │   ├── php/                # PHP-FPM configuration
│   │   └── redis/              # Redis configuration
│   ├── user-service/           # Laravel application
│   └── docker-compose.yml      # Backend services
├── frontend/
│   ├── src/                    # React source code
│   ├── Dockerfile              # Production build
│   ├── Dockerfile.dev          # Development build
│   └── docker-compose.yml      # Frontend services
├── infrastructure/             # Additional infrastructure
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env):
```env
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=microservices_db
MYSQL_USER=microservices_user
MYSQL_PASSWORD=microservices_password
```

#### Frontend (.env):
```env
VITE_API_URL=http://localhost:8080/api
FRONTEND_PORT=3000
FRONTEND_DEV_PORT=3001
```

### Port Mapping

| Service | Internal Port | External Port | Purpose |
|---------|---------------|---------------|---------|
| Frontend Dev | 5173 | 3001 | Development server |
| Frontend Prod | 80 | 3000 | Production build |
| nginx | 80 | 80 | Web server |
| KrakenD | 8080 | 8080 | API Gateway |
| User Service | 6001 | 6000 | Laravel API |
| MySQL | 3306 | 3306 | Database |
| Redis | 6379 | 6379 | Cache |

## 🏥 Health Checks

Semua services dilengkapi dengan health checks:

```bash
# Check all services health
docker-compose ps

# Individual health check
curl http://localhost:8080/__health  # KrakenD
curl http://localhost/health         # nginx
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Container tidak start
```bash
# Check logs
docker-compose logs [service-name]

# Rebuild container
docker-compose build --no-cache [service-name]
```

#### 2. Database connection error
```bash
# Check MySQL status
docker exec microservices-mysql mysqladmin ping -h localhost -u root -proot

# Reset database
docker-compose down -v
docker-compose up -d
```

#### 3. API Gateway timeout
```bash
# Restart KrakenD
docker-compose restart krakend

# Check network connectivity
docker exec microservices-krakend wget -qO- http://user-service:6001/api/users
```

#### 4. Frontend API calls failed
- Verify `VITE_API_URL` in `.env`
- Check KrakenD is running: `http://localhost:8080/__health`
- Restart frontend dev container: `docker-compose restart frontend-dev`

## 📊 Monitoring & Logs

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f krakend
docker-compose logs -f user-service
docker-compose logs -f mysql
```

### Resource Usage
```bash
# Container stats
docker stats

# Specific container
docker stats microservices-krakend
```

## 🚢 Production Deployment

### Build Production Images
```bash
# Backend
cd backend
docker-compose -f docker-compose.prod.yml build

# Frontend
cd frontend
docker-compose build frontend
```

### Environment Setup
1. Copy `.env.example` to `.env`
2. Configure production values
3. Setup SSL certificates
4. Configure domain names

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/nama-fitur`
3. Commit changes: `git commit -am 'Add: fitur baru'`
4. Push branch: `git push origin feature/nama-fitur`
5. Submit Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rizki Architecture**
- GitHub: [@rizkiarch](https://github.com/rizkiarch)

## 🙏 Acknowledgments

- [Laravel](https://laravel.com/) - PHP Framework
- [KrakenD](https://www.krakend.io/) - API Gateway
- [React](https://reactjs.org/) - Frontend Framework
- [Vite](https://vitejs.dev/) - Build Tool
- [Docker](https://www.docker.com/) - Containerization

---

⭐ Star this repository jika membantu project Anda!
