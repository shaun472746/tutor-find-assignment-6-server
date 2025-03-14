# Portfolio Server

Live Deployed Link:

## Technologies

- TypeScript
- Node.js
- Express.js
- MongoDB with Mongoose

# instruction to setup the project locally

This repository is currently public. To setup this project locally follow the instruction given below -

- clone the repository

- move into project directory

- create an .env which must contain fields that are defined in .env.example file

- npm install (run this command)

- npm run build ( run this command)

- npm start (to start the server locally)

- change the cors origin in src/app folder.

Now, project setup is done. Hit the api described below to get the expected result.

# API Endpoints

## 1.1 Login (student & tutor)

**POST** `/api/auth/login`

**Description:** Use to login both tutor and student
**Request Body:**

```json
{
  "email": "example@gmail.com",
  "password": "somepassword"
}
```

## 1.2 Register (student & tutor)

**POST** `/api/auth/register`

**Description:** Use to register both tutor and student
**Request Body:**

```json
{
  "name": "any name",
  "role": "tutor",
  "email": "example@gmail.com",
  "password": "any password"
}
```

## 1.3 Update Tutor Profile

**POST** `/api/auth/update-tutor-profile`

**Description:** Use to update tutor profile
**Request Body:**

```json
{
  "id": "tutorId",
  "expertise": ["mathematics-class 9"],
  "subjects": ["mathematics-class 9", "english-class 9"],
  "rating": 3,
  "image": "image url",
  "address": "some address",
  "phone": "1234",
  "earning": 234,
  "availability_slot": ["16pm", "8am"],
  "hourly_rate": 1000
}
```

## 1.4 Upload Profile Image

**POST** `/api/auth/upload-profile-image`

**Description:** Use to update profile image
**Request Body:**

```json
{
  "url": "image url"
}
```

## 1.5 get user detail

**GET** `/api/auth/get-user-detail/:userId`

**Description:** Use to get user detail

## 1.6 Get tutor profile detail

**GET** `/api/auth/tutor-profile-detail/:userId`

**Description:** Use to get user profile detail

## 1.7 Get refresh token

**POST** `/api/auth/refresh-token`

**Description:** Use to update profile image
**Request Body:**

```json
{
  "refreshToken": "refresh token"
}
```

## 2.1 Update student profile

**POST** `/api/student/update-student-profile`

**Description:** Use to update student profile

**Request Body:**

```json
{
  "id": "student id",
  "address": "student address",
  "phone": "eleven digit number",
  "class": "class 9"
}
```

## 2.2 Get student profile

**GET** `/api/student/student-profile-detail/:userId`

**Description:** Use to update student profile

## 2.2 Get student booking request

**GET** `/api/student/accepted-booking-requests`

**Description:** Get accepted booking request

## 2.3 Make Payment

**POST** `/api/student/make-payment`

**Description:** Make payment to tutor

**Request Body:**

```json
{
  "bookingRequestId": "provide booking id from accepted booking request",
  "hours": 12,
  "month": 2,
  "userInfo": {
    "customer_address": "address",
    "customer_city": "dhaka",
    "customer_email": "email",
    "customer_name": "customer name",
    "customer_phone": "eleven digit number"
  },
  "hourly_rate": 123,
  "transaction": {
    "id": "optional(will be inserted after making payment using surjopay)",
    "transactionStatus": "optional(will be inserted after making payment using surjopay)",
    "bank_status": "optional(will be inserted after verifying payment using surjopay)",
    "sp_code": "optional(will be inserted after verifying payment using surjopay)",
    "sp_message": "optional(will be inserted after verifying payment using surjopay)",
    "method": "optional(will be inserted after verifying payment using surjopay)",
    "date_time": "optional(will be inserted after verifying payment using surjopay)"
  }
}
```

## 2.4 Verify Payment

**GET** `/api/student/payment-verify`

**Description:** Verify payment to tutor

## 2.5 Past Booking

**GET** `/api/student/past-bookings`

**Description:** Get detail of past booking

## 2.6 Payment History

**GET** `/api/student/payment-history`

**Description:** Get detail of payment history

## 2.7 Update Tutor Rating

**POST** `/api/student/update-tutor-rating`

**Description:** Update tutor rating

**Request Body:**

```json
{
  "tutorId": "tutor id",
  "rate": 4
}
```

## 2.8 Get tutor profile detail

**GET** `/api/student/get-tutor-profile-detail/:tutorId`

**Description:** Get tutor profile detail

## 2.9 Get tutor profile detail for Testimonial

**GET** `/api/student/get-tutor-profile-detail-testimonial`

**Description:** Get tutor profile detail

## 2.10 Get News list

**GET** `/api/student/get-all-newslist/:value`

**Description:** Get tutor profile detail

## 3.1 Get Tutor list

**GET** `/api/tutor/get-all-tutors`

**Description:** Get tutor list

## 3.2 Get All Bookings

**GET** `/api/tutor/get-all-bookings/:tutorId`

**Description:** Get all bookings

## 3.3 Create Booking Request

**POST** `/api/tutor/create-booking-request`

**Description:** create booking request

**Request Body:**

```json
{
  "availability_slot": "9pm",
  "class": "class 9",
  "hourly_rate": 1000,
  "subjects": "Science",
  "userId": "student id",
  "tutorId": "tutor id"
}
```

## 3.4 Create Accept Booking Request

**POST** `/api/tutor/create-accept-booking-request`

**Description:** create accept booking request

**Request Body:**

```json
{
  "time_slot": "9pm",
  "class": "class 9",
  "hourly_rate": 1000,
  "subject": "Science",
  "student": "student id",
  "tutor": "tutor id",
  "id": "created booking request"
}
```

## 3.5 Reject Booking Request

**POST** `/api/tutor/reject-booking-request/:bookingId`

**Description:** create accept booking request

**Request Body:**

```json
{
  "time_slot": "9pm",
  "class": "class 9",
  "hourly_rate": 1000,
  "subject": "Science",
  "student": "student id",
  "tutor": "tutor id",
  "id": "created booking request"
}
```

# Changes in code

In app.ts, change origin as your client website address.
