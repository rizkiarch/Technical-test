# API Documentation & Postman Examples

## Pet Care Management System API

This document provides detailed examples for testing the Pet Care Management System API using Postman.

### Base URLs:
- **Direct Service**: `http://localhost:6001/api`
- **Through API Gateway**: `http://localhost:8080/api`

---

## Categories API

### 1. Get All Categories
**GET** `/api/categories`

**Postman Example:**
```
Method: GET
URL: http://localhost:8080/api/categories
Headers: 
  Content-Type: application/json
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "type": "Anjing",
      "created_at": "2025-09-19T10:00:00.000000Z",
      "updated_at": "2025-09-19T10:00:00.000000Z"
    },
    {
      "type": "Kucing",
      "created_at": "2025-09-19T10:00:00.000000Z",
      "updated_at": "2025-09-19T10:00:00.000000Z"
    }
  ]
}
```

### 2. Get Categories with Animal Count
**GET** `/api/categories/with-count`

**Postman Example:**
```
Method: GET
URL: http://localhost:8080/api/categories/with-count
Headers: 
  Content-Type: application/json
```

### 3. Get Specific Category
**GET** `/api/categories/{type}`

**Postman Example:**
```
Method: GET
URL: http://localhost:8080/api/categories/Anjing
Headers: 
  Content-Type: application/json
```

### 4. Create New Category
**POST** `/api/categories`

**Postman Example:**
```
Method: POST
URL: http://localhost:8080/api/categories
Headers: 
  Content-Type: application/json
Body (raw JSON):
{
  "type": "Hamster"
}
```

### 5. Update Category
**PUT** `/api/categories/{type}`

**Postman Example:**
```
Method: PUT
URL: http://localhost:8080/api/categories/Hamster
Headers: 
  Content-Type: application/json
Body (raw JSON):
{
  "type": "Lainnya"
}
```

### 6. Delete Category
**DELETE** `/api/categories/{type}`

**Postman Example:**
```
Method: DELETE
URL: http://localhost:8080/api/categories/Lainnya
Headers: 
  Content-Type: application/json
```

---

## Animals API

### 1. Get All Animals (with pagination)
**GET** `/api/animals`

**Postman Example:**
```
Method: GET
URL: http://localhost:8080/api/animals?per_page=10&page=1
Headers: 
  Content-Type: application/json
```

### 2. Create New Animal (Register Pet)
**POST** `/api/animals`

**Postman Example:**
```
Method: POST
URL: http://localhost:8080/api/animals
Headers: 
  Content-Type: multipart/form-data
Body (form-data):
  photo: [Select image file - max 2MB, formats: jpeg, png, jpg, gif]
  category: Anjing
  name_animal: Buddy
  name_owner: John Doe
  phone_owner: +6281234567890
  email_owner: john.doe@example.com
  time_registered: 2025-09-19 14:30:00 (optional, defaults to current time)
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Animal registered successfully",
  "data": {
    "id": "250919/Anjing/001",
    "photo": "animals/1695127800_buddy.jpg",
    "category": "Anjing",
    "name_animal": "Buddy",
    "name_owner": "John Doe",
    "phone_owner": "+6281234567890",
    "email_owner": "john.doe@example.com",
    "time_registered": "2025-09-19T14:30:00.000000Z",
    "time_out": null,
    "cost_total": null,
    "created_at": "2025-09-19T14:30:00.000000Z",
    "updated_at": "2025-09-19T14:30:00.000000Z",
    "category_info": {
      "type": "Anjing",
      "created_at": "2025-09-19T10:00:00.000000Z",
      "updated_at": "2025-09-19T10:00:00.000000Z"
    }
  }
}
```

### 3. Get Specific Animal
**GET** `/api/animals/{id}`

**Postman Example:**
```
Method: GET
URL: http://localhost:8080/api/animals/250919/Anjing/001
Headers: 
  Content-Type: application/json
```

### 4. Update Animal Information
**PUT** `/api/animals/{id}`

**Postman Example:**
```
Method: PUT
URL: http://localhost:8080/api/animals/250919/Anjing/001
Headers: 
  Content-Type: multipart/form-data
Body (form-data):
  name_animal: Buddy Updated
  name_owner: John Doe Jr
  phone_owner: +6281234567891
  email_owner: john.doe.jr@example.com
  photo: [Optional - new photo file]
```

### 5. Checkout Animal (Calculate Cost)
**POST** `/api/animals/{id}/checkout`

**Postman Example:**
```
Method: POST
URL: http://localhost:8080/api/animals/250919/Anjing/001/checkout
Headers: 
  Content-Type: application/json
Body (raw JSON):
{
  "time_out": "2025-09-19 18:30:00"
}
```

**Note:** If `time_out` is not provided, current time will be used.

**Expected Response:**
```json
{
  "success": true,
  "message": "Animal checked out successfully",
  "data": {
    "id": "250919/Anjing/001",
    "photo": "animals/1695127800_buddy.jpg",
    "category": "Anjing",
    "name_animal": "Buddy",
    "name_owner": "John Doe",
    "phone_owner": "+6281234567890",
    "email_owner": "john.doe@example.com",
    "time_registered": "2025-09-19T14:30:00.000000Z",
    "time_out": "2025-09-19T18:30:00.000000Z",
    "cost_total": 200000.00,
    "created_at": "2025-09-19T14:30:00.000000Z",
    "updated_at": "2025-09-19T18:30:05.000000Z"
  }
}
```

### 6. Search Animals
**GET** `/api/animals/search`

**Postman Example:**
```
Method: GET
URL: http://localhost:8080/api/animals/search?q=Buddy
Headers: 
  Content-Type: application/json
```

### 7. Get Animals by Category
**GET** `/api/animals/category/{category}`

**Postman Example:**
```
Method: GET
URL: http://localhost:8080/api/animals/category/Anjing
Headers: 
  Content-Type: application/json
```

### 8. Get Checked In Animals
**GET** `/api/animals/checked-in`

**Postman Example:**
```
Method: GET
URL: http://localhost:8080/api/animals/checked-in
Headers: 
  Content-Type: application/json
```

### 9. Get Checked Out Animals
**GET** `/api/animals/checked-out`

**Postman Example:**
```
Method: GET
URL: http://localhost:8080/api/animals/checked-out
Headers: 
  Content-Type: application/json
```

### 10. Get Hourly Rates
**GET** `/api/animals/rates`

**Postman Example:**
```
Method: GET
URL: http://localhost:8080/api/animals/rates
Headers: 
  Content-Type: application/json
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Hourly rates retrieved successfully",
  "data": {
    "Anjing": 50000,
    "Kucing": 40000,
    "Kelinci": 30000,
    "Reptil": 60000,
    "Lainnya": 35000
  }
}
```

### 11. Delete Animal
**DELETE** `/api/animals/{id}`

**Postman Example:**
```
Method: DELETE
URL: http://localhost:8080/api/animals/250919/Anjing/001
Headers: 
  Content-Type: application/json
```

---

## Business Logic Examples

### Animal ID Generation Format
The system automatically generates unique IDs in the format: `YYMMDD/{Category}/no`

Examples:
- `250919/Anjing/001` - First dog registered on Sept 19, 2025
- `250919/Kucing/001` - First cat registered on Sept 19, 2025
- `250919/Anjing/002` - Second dog registered on Sept 19, 2025

### Cost Calculation
Cost is calculated based on the time difference between `time_registered` and `time_out`:

**Hourly Rates:**
- Anjing (Dog): Rp 50,000/hour
- Kucing (Cat): Rp 40,000/hour  
- Kelinci (Rabbit): Rp 30,000/hour
- Reptil: Rp 60,000/hour
- Lainnya (Others): Rp 35,000/hour

**Example:**
If a dog is registered at 14:30 and checked out at 18:30 (4 hours):
Cost = 4 hours × Rp 50,000 = Rp 200,000

Minimum charge is 1 hour even for shorter stays.

---

## Validation Rules

### Photo Upload:
- **Required** for new animal registration
- **Maximum size**: 2MB
- **Allowed formats**: jpeg, png, jpg, gif

### Email Validation:
- Must be a valid email format
- Example: `user@example.com`

### Phone Validation:
- Must contain only numbers, spaces, hyphens, plus signs, and parentheses
- Minimum 10 digits, maximum 15 digits
- Examples: `+6281234567890`, `(021) 1234-5678`

### Time Validation:
- `time_out` must be after `time_registered`
- `time_registered` cannot be in the future

### Category Validation:
- Must be one of: `Anjing`, `Kucing`, `Kelinci`, `Reptil`, `Lainnya`

---

## Error Responses

### Validation Error (422):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email_owner": ["Please provide a valid email address."],
    "photo": ["The photo must not be larger than 2MB."]
  }
}
```

### Not Found Error (404):
```json
{
  "success": false,
  "message": "Animal not found"
}
```

### Server Error (500):
```json
{
  "success": false,
  "message": "Failed to register animal"
}
```

---

## Setting up Postman Collection

1. Create a new Collection in Postman called "Pet Care Management API"
2. Set up environment variables:
   - `base_url`: `http://localhost:8080/api`
   - `service_url`: `http://localhost:6001/api`
3. Add all the above requests to your collection
4. Use `{{base_url}}` in your request URLs for easy environment switching

### Environment Setup:
```json
{
  "name": "Pet Care - Local",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:8080/api",
      "enabled": true
    },
    {
      "key": "service_url", 
      "value": "http://localhost:6001/api",
      "enabled": true
    }
  ]
}
```

---

## Testing Workflow

### Complete Registration & Checkout Flow:

1. **Step 1**: Get all categories to see available options
   - `GET /api/categories`

2. **Step 2**: Register a new animal
   - `POST /api/animals` with photo and details

3. **Step 3**: Verify registration
   - `GET /api/animals/{id}` using the returned ID

4. **Step 4**: Check all checked-in animals
   - `GET /api/animals/checked-in`

5. **Step 5**: Checkout the animal
   - `POST /api/animals/{id}/checkout`

6. **Step 6**: Verify checkout and cost calculation
   - `GET /api/animals/{id}` to see the updated record

This workflow ensures all validations and business logic are working correctly.