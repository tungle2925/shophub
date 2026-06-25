# 🛍️ ShopHub - E-Commerce Management System

## 👤 Thông tin sinh viên

| Họ tên | MSSV |
|--------|------|
| Lê Văn Thanh Tùng | 2200002925 |

## 🔧 Tech Stack

- **Frontend:** ReactJS + Vite + React Router
- **Backend:** FastAPI + Python
- **Database:** PostgreSQL (Session 8+)

## 📁 Cấu trúc dự án
shophub/

├── frontend/     → React App (localhost:5173)

├── backend/      → FastAPI (localhost:8000)

├── database/     → SQL scripts

└── screenshots/  → Bài nộp từng buổi (PDF)
## 📅 Nội dung từng buổi

| Session | Ngày | Nội dung | Trạng thái |
|---------|------|----------|------------|
| Session 01 | 08/06/2026 | Project Initialization – Setup môi trường, tạo React + FastAPI | ✅ Done |
| Session 02 | 12/06/2026 | Landing Page – Header, Banner, FeatureSection, Footer | ✅ Done |
| Session 03 | 15/06/2026 | Product Catalog – ProductCard, ProductList, mock data | ✅ Done |
| Session 04 | 18/06/2026 | Search & Filter – Tìm kiếm, lọc category, sort giá | ✅ Done |
| Session 05 | 22/06/2026 | React Router – Multi-page SPA, useParams, ProductDetail | ✅ Done |
| Session 06 | 25/06/2026 | FastAPI Product API – CRUD, CORS, pagination, image upload | ✅ Done |
| Session 07 | TBD | React tích hợp API – Axios, gọi backend thật | 🔜 |
| Session 08 | TBD | PostgreSQL – ORM, database thật | 🔜 |
| Session 09 | TBD | Product Management – Admin CRUD | 🔜 |
| Session 10 | TBD | Authentication – JWT, login/register | 🔜 |
| Session 11 | TBD | Authorization – RBAC, protected routes | 🔜 |
| Session 12 | TBD | Shopping Cart – Context API | 🔜 |
| Session 13 | TBD | Checkout & Orders | 🔜 |
| Session 14 | TBD | Admin Dashboard | 🔜 |
| Session 15 | TBD | Production Deploy – Vercel + Railway | 🔜 |
| Session 16 | TBD | Shipper Module – Realtime tracking | 🔜 |
| Session 17 | TBD | Multi-vendor Support | 🔜 |

## 🚀 Hướng dẫn chạy

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Backend
```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs
```