from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import SQLModel, Field, Session, create_engine, select
from typing import Optional, List
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from pydantic import BaseModel, EmailStr
import os

# ─── Database ────────────────────────────────────────────────
DATABASE_URL = "postgresql://postgres:shophub123@localhost:5432/shophub_db"
engine = create_engine(DATABASE_URL, echo=True)

# ─── JWT Settings ─────────────────────────────────────────────
SECRET_KEY = "shophub-secret-key-change-me"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# ─── Password Hashing ─────────────────────────────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ─── Models ──────────────────────────────────────────────────
class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(min_length=3, max_length=100)
    price: float = Field(gt=0)
    category: str = Field(min_length=3, max_length=50)
    description: str
    image_path: str

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    full_name: str
    password_hash: str
    role: str = Field(default="CUSTOMER")

# ─── Schemas ─────────────────────────────────────────────────
class ProductCreate(SQLModel):
    name: str = Field(min_length=3, max_length=100)
    price: float = Field(gt=0)
    category: str = Field(min_length=3, max_length=50)
    description: str
    imageUrl: str

class ProductRead(SQLModel):
    id: int
    name: str
    price: float
    category: str
    description: str
    imageUrl: str

class ProductUpdate(SQLModel):
    name: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    description: Optional[str] = None
    imageUrl: Optional[str] = None

class RegisterRequest(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: Optional[str] = "CUSTOMER"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class AuthUser(BaseModel):
    id: int
    email: str
    full_name: str
    role: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AuthUser

# ─── App ─────────────────────────────────────────────────────
app = FastAPI(title="ShopHub API with PostgreSQL", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

IMAGE_DIR = os.path.join(os.path.dirname(__file__), "data_images")

# ─── Auth Dependencies ───────────────────────────────────────
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
) -> User:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = session.get(User, int(user_id))
    if user is None:
        raise credentials_exception
    return user

def verify_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=403,
            detail="Admin permissions required",
        )
    return current_user

# ─── Auth Routes ─────────────────────────────────────────────
@app.post("/register", response_model=AuthUser, status_code=201, tags=["auth"])
def register_user(payload: RegisterRequest, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == payload.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered")
    new_user = User(
        email=payload.email,
        full_name=payload.full_name,
        password_hash=hash_password(payload.password),
        role=payload.role,
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return AuthUser(id=new_user.id, email=new_user.email, full_name=new_user.full_name, role=new_user.role)

@app.post("/login", response_model=TokenResponse, tags=["auth"])
def login_user(payload: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == payload.email)).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return TokenResponse(
        access_token=token,
        user=AuthUser(id=user.id, email=user.email, full_name=user.full_name, role=user.role)
    )

# ─── Product Routes ───────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "ShopHub API with PostgreSQL đang chạy!"}

@app.get("/products", response_model=List[ProductRead], tags=["products"])
def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    session: Session = Depends(get_session)
):
    query = select(Product)
    if category:
        query = query.where(Product.category == category)
    if search:
        query = query.where(Product.name.ilike(f"%{search}%"))
    products = session.exec(query).all()
    return [ProductRead(id=p.id, name=p.name, price=p.price, category=p.category, description=p.description, imageUrl=p.image_path) for p in products]

@app.get("/products/{product_id}", response_model=ProductRead, tags=["products"])
def get_product(product_id: int, session: Session = Depends(get_session)):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    return ProductRead(id=product.id, name=product.name, price=product.price, category=product.category, description=product.description, imageUrl=product.image_path)

@app.post("/products", response_model=ProductRead, status_code=201, tags=["products"])
def create_product(
    payload: ProductCreate,
    session: Session = Depends(get_session),
    admin: User = Depends(verify_admin)
):
    product = Product(name=payload.name, price=payload.price, category=payload.category, description=payload.description, image_path=payload.imageUrl)
    session.add(product)
    session.commit()
    session.refresh(product)
    return ProductRead(id=product.id, name=product.name, price=product.price, category=product.category, description=product.description, imageUrl=product.image_path)

@app.put("/products/{product_id}", response_model=ProductRead, tags=["products"])
def update_product(
    product_id: int,
    payload: ProductUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    if payload.name is not None: product.name = payload.name
    if payload.price is not None: product.price = payload.price
    if payload.category is not None: product.category = payload.category
    if payload.description is not None: product.description = payload.description
    if payload.imageUrl is not None: product.image_path = payload.imageUrl
    session.add(product)
    session.commit()
    session.refresh(product)
    return ProductRead(id=product.id, name=product.name, price=product.price, category=product.category, description=product.description, imageUrl=product.image_path)

@app.delete("/products/{product_id}", status_code=204, tags=["products"])
def delete_product(
    product_id: int,
    session: Session = Depends(get_session),
    admin: User = Depends(verify_admin)
):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    session.delete(product)
    session.commit()
    return

@app.get("/images/{filename}", tags=["images"])
def get_image(filename: str):
    filepath = os.path.join(IMAGE_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Không tìm thấy ảnh")
    return FileResponse(filepath)