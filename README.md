# AI-Powered Complaint Management System

---

## 1️⃣ Project Overview

This project is an **AI-powered complaint management system** built with:

- **Frontend:** React.js with proper pages for Home, Complaints, About Us, Admin, and Profile. Includes **Leaflet Map** integration to select address and get latitude/longitude.
- **Backend:** Node.js/Express API handling **users**, **auth**, and **complaints** modules.
- **AI Service:** FastAPI service serving **3 deep learning models**:
  - **Sentiment Classification**
  - **Issue Classification**
  - **Named Entity Recognition (NER)**
  - Models trained using **Keras** and **Hugging Face Transformers (DistilBERT uncased)**. 
  Available on Hugging Face: [https://huggingface.co/muskankushwah15](https://huggingface.co/muskankushwah15)
  
The system allows users to file complaints, view their status, and for admins to update or delete complaints. AI service analyzes the text and returns structured information for the dashboard.

---

## 2️⃣ System Design

### 2.1 Architecture Diagram

+-------------------+        +-----------------+        +-------------------+
|    React Frontend  | <----> |   Node.js API   | <----> |    ai_Service      |
|-------------------|        |----------------|        |-------------------|
| Home Page          |        | /auth           |        | /predict_sentiment |
| Complaints Page    |        | /user           |        | /predict_issue     |
| Profile Page       |        | /complaints     |        | /predict_ner       |
| Admin Page         |        |                 |        |                   |
| Leaflet Map        |        |                 |        |                   |
+-------------------+        +-----------------+        +-------------------+


### 2.2 Workflow

1. **User Flow**
   - User selects location on Leaflet Map → gets `lat/lng`.
   - User submits complaint text with location.
   - Frontend sends complaint to Node.js API.

2. **Backend Flow**
   - Node.js API receives complaint.
   - Calls **AI service** via HTTP request.
   - AI service returns:
     - Sentiment (`Positive/Negative/Neutral`)
     - Issue category
     - NER entities
   - Node.js saves structured data in **MongoDB**.
   - Dashboard displays complaint cards.

3. **Admin Flow**
   - Admin can view all complaints.
   - Can update complaint status or delete complaints.
   
4. **Auth Flow**
   - JWT-based authentication with **access token** and **refresh token**.
   - Supports signup/login/logout/forgot password/reset password.

---

## 3️⃣ Frontend Modules

| Page/Component | Features |
|----------------|---------|
| **Home** | File a complaint, Leaflet Map for location selection |
| **Complaints** | View complaints, filter by department/status |
| **Profile** | View and edit user info, logout |
| **About Us** | Info about system and team |
| **Admin** | Update complaint status, delete complaints |

**Images Placeholder** (replace with actual screenshots):
- Home Page: `images/home.png`
- Complaints Page: `images/complaints.png`
- Profile Page: `images/profile.png`
- About Us Page: `images/aboutus.png`

---

## 4️⃣ Backend Modules

### 4.1 Auth Module
- `POST /signup` – Create new user
- `POST /login` – Authenticate user
- `POST /refresh` – Refresh access token
- `POST /forgot-password` – Request reset
- `POST /reset-password` – Reset password
- `POST /logout` – Logout user

### 4.2 User Module
- `GET /user/:id` – Get profile
- `PUT /user/:id` – Update profile

### 4.3 Complaints Module
- `POST /complaints` – Add complaint
- `GET /complaints` – Get all complaints (Admin) / User complaints
- `PUT /complaints/:id` – Update complaint (Admin)
- `DELETE /complaints/:id` – Delete complaint (Admin)

---

## 5️⃣ AI Service Module (FastAPI)

- **Models**
  - **Sentiment:** Predicts sentiment of complaint
  - **Issue:** Classifies complaint category
  - **NER:** Extracts entities (e.g., person, location)
  
- **Endpoints**
  - `POST /predict_sentiment` – Input: text, Output: sentiment
  - `POST /predict_issue` – Input: text, Output: issue category
  - `POST /predict_ner` – Input: text, Output: entities

- **Training**
  - Keras-based deep learning models trained on Google Colab.
  - Fine-tuned DistilBERT uncased transformer pipeline for better predictions.
  - Saved models deployed for inference and available publicly: [Hugging Face](https://huggingface.co/muskankushwah15)
  - Achieved **accuracy > 80%**.

- **Example Request**
```
POST /predict_sentiment
{
  "text": "The streetlight is not working in my area."
}

{
  "sentiment": "Negative"
}

```

## 6️⃣ Deployment on Render

### 6.1 FastAPI AI Service
- Root Directory: `ai_Service`
- Build Command: 

```
pip install -r requirements.txt
```

**Start Command**:

```

uvicorn main:app --host 0.0.0.0 --port $PORT

```
Python 3.x environment


### 6.2 Node.js Backend
Root Directory: `backend`
**Build Command**:
```
npm install

```

**Start Command**:
```
npm run start
```
Node 18+ environment

### 6.3 Frontend
Root Directory: `frontend`
**Build Command**:
```
npm  && npm run build

```

**Start Command**:
```
npm run dev
```

## 7️⃣ Key Features & Highlights

- Trained **deep learning models** from scratch on Google Colab using **Keras** and **Hugging Face Transformers**.
- Deployed **Hugging Face inference pipelines** for easy and fast predictions.
- Full **JWT-based authentication** with **refresh token support**.
- **Leaflet Map** integration for accurate location capture (lat/lng) while filing complaints.
- **Admin dashboard** with full CRUD operations on complaints.
- Frontend dashboard with **responsive complaint cards** for better UX.
- Modular and scalable architecture with **3 separate services**:
  - Frontend (React.js)
  - Backend (Node.js API)
  - AI Service (FastAPI)

---

## 8️⃣ Tech Stack

| Layer       | Technology                                         |
|------------|----------------------------------------------------|
| Frontend    | React.js, Leaflet.js, Axios, Tailwind CSS         |
| Backend     | Node.js, Express.js, MongoDB, JWT, Axios          |
| AI Service  | FastAPI, Keras, Hugging Face Transformers, Python 3.x |
| Deployment  | Render (Web Services for Frontend, Backend, AI Service) |

---

## 9️⃣ Future Improvements

- Real-time **notifications** for complaint status updates.
- Multi-language support for a wider audience.
- Fine-tuning AI models with **custom datasets** for better predictions.
- Enhanced **graphical insights dashboard** for admins.
- Integration with **cloud storage** for attachments/images in complaints.

---

## 10️⃣ How to Run Locally

1. **Clone the repository**

```
git clone https://github.com/muskan1515/AI-Powered-Citizen-Issue-Reporter
cd root

```

2. **Run AI Service**:

```
cd ai_Service
pip install -r requirements.txt
uvicorn main:app --reload

```
3. **Run Node.js Backend**:

```
cd backend
npm install
npm run start

```

4. **Run Frontend**:

```
cd frontend
npm install
npm run dev

```

## Open Browser

### Frontend: http://localhost:3000

### Backend API: http://localhost:5000

### AI Service: http://localhost:8000


## 11️⃣ Acknowledgements

- **Self-trained AI Models:** Developed deep learning models for sentiment analysis, issue classification, and NER using **Keras** and **Hugging Face Transformers**, trained on Google Colab.  
- **Hugging Face:** Hosted fine-tuned models and inference pipelines publicly for easy access: [https://huggingface.co/muskankushwah15](https://huggingface.co/muskankushwah15)  
- **Leaflet.js:** Integrated interactive maps for accurate location selection in complaints.  
- **Render:** Provided seamless deployment of all three services (Frontend, Backend, AI Service).  
- **Inspiration & Learning:** The project demonstrates full-stack and AI integration learned and implemented independently.  
- **Open-Source Libraries:** Thanks to the React, Node.js, FastAPI, and Python communities for their frameworks and support.
- **Blog** [Read my blog](https://medium.com/@muskankushwah85/building-and-deploying-ai-models-for-complaint-analysis-challenges-solutions-and-learnings-e2a1dbe738b8)
