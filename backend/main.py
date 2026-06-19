from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "ShopHub API đang chạy!"}