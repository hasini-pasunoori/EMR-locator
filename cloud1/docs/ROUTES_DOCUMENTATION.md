# EMResource API Routes Documentation

Generated on: 2025-10-29T12:11:22.717Z

## ADMIN Routes
**File:** `/Users/manideepgonugunta/Desktop/test/routes/admin.js`

### Endpoints

- **GET** `/api/admin/dashboard`
- **GET** `/api/admin/stats`
- **GET** `/api/admin/dashboard-data`
- **GET** `/api/admin/users`
- **GET** `/api/admin/hospitals`
- **POST** `/api/admin/hospitals/:id/verify`
- **GET** `/api/admin/requests`
- **PATCH** `/api/admin/requests/:id/status`
- **GET** `/api/admin/donors`
- **PATCH** `/api/admin/donors/:id/verify`
- **PATCH** `/api/admin/donors/:id/status`
- **GET** `/api/admin/facilities`
- **POST** `/api/admin/hospitals/add`
- **DELETE** `/api/admin/facilities/:id`
- **PATCH** `/api/admin/users/:id/suspend`
- **PATCH** `/api/admin/users/:id/activate`
- **DELETE** `/api/admin/users/:id`
- **GET** `/api/admin/export/:type`

### Middleware
- isAuthenticated

### Authentication Requirements
- ✅ requires auth
- ✅ requires role

---

## AUTH Routes
**File:** `/Users/manideepgonugunta/Desktop/test/routes/auth.js`

### Endpoints

- **POST** `/auth/signup/send-otp`
- **POST** `/auth/signup/verify-otp`
- **POST** `/auth/signin/send-otp`
- **POST** `/auth/signin/verify-otp`
- **GET** `/auth/verify-email`
- **GET** `/auth/google`
- **GET** `/auth/google/callback`
- **POST** `/auth/logout`
- **GET** `/auth/logout`
- **GET** `/auth/me`

### Middleware
- body('name')
- body('email')
- body('password')
- body('otp')
- validationResult
- passport.authenticate
- isAuthenticated

### Authentication Requirements
- ✅ requires auth
- ✅ has o t p
- ✅ has validation

---

## BEDS Routes
**File:** `/Users/manideepgonugunta/Desktop/test/routes/beds.js`

### Endpoints

- **GET** `/api/beds/availability`
- **PATCH** `/api/beds/:facilityId/update`

### Authentication Requirements
- ✅ requires role

---

## CHAT Routes
**File:** `/Users/manideepgonugunta/Desktop/test/routes/chat.js`

### Endpoints

- **GET** `/api/chat/`
- **GET** `/api/chat/:chatId/messages`
- **POST** `/api/chat/:chatId/message`
- **POST** `/api/chat/create`

---

## DONOR Routes
**File:** `/Users/manideepgonugunta/Desktop/test/routes/donor.js`

### Endpoints

- **GET** `/dashboard`
- **GET** `/stats`

### Middleware
- isAuthenticated

### Authentication Requirements
- ✅ requires auth
- ✅ requires role

---

## DONORS Routes
**File:** `/Users/manideepgonugunta/Desktop/test/routes/donors.js`

### Endpoints

- **GET** `/api/donors/nearby`
- **GET** `/api/donors/`
- **POST** `/api/donors/register`
- **PUT** `/api/donors/profile`
- **GET** `/api/donors/profile`
- **PATCH** `/api/donors/availability`
- **GET** `/api/donors/meta/blood-types`

---

## EMERGENCY Routes
**File:** `/Users/manideepgonugunta/Desktop/test/routes/emergency.js`

### Endpoints

- **POST** `/api/emergency/request`
- **GET** `/api/emergency/nearby`
- **GET** `/api/emergency/`
- **GET** `/api/emergency/:id`
- **POST** `/api/emergency/:id/respond`
- **PATCH** `/api/emergency/:id/status`
- **GET** `/api/emergency/user/requests`
- **PUT** `/api/emergency/:id`
- **DELETE** `/api/emergency/:id`
- **GET** `/api/emergency/user/incoming-responses`
- **GET** `/api/emergency/user/outgoing-responses`
- **GET** `/api/emergency/stats/overview`

### Authentication Requirements
- ✅ requires role

---

## FACILITIES Routes
**File:** `/Users/manideepgonugunta/Desktop/test/routes/facilities.js`

### Endpoints

- **GET** `/api/facilities/nearby`
- **GET** `/api/facilities/`
- **GET** `/api/facilities/:id`
- **POST** `/api/facilities/`
- **PUT** `/api/facilities/:id`
- **GET** `/api/facilities/meta/types-services`

### Authentication Requirements
- ✅ requires role

---

## HOSPITAL Routes
**File:** `/Users/manideepgonugunta/Desktop/test/routes/hospital.js`

### Endpoints

- **GET** `/api/hospital/dashboard`
- **GET** `/api/hospital/stats`

### Middleware
- isAuthenticated

### Authentication Requirements
- ✅ requires auth
- ✅ requires role

---

## SOS Routes
**File:** `/Users/manideepgonugunta/Desktop/test/routes/sos.js`

### Endpoints

- **GET** `/api/sos/contacts`
- **POST** `/api/sos/contacts`
- **POST** `/api/sos/alert`

---

## USER Routes
**File:** `/Users/manideepgonugunta/Desktop/test/routes/user.js`

### Endpoints

- **PUT** `/api/user/profile`
- **PUT** `/api/user/change-password`
- **POST** `/api/user/profile-picture`
- **GET** `/api/user/profile`
- **POST** `/api/user/export-data`

### Middleware
- isAuthenticated

### Authentication Requirements
- ✅ requires auth

---

