from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import os

from app.core.database import get_db
from app.core.config import settings
from app.services.file_parser import FileParser
from app.schemas.file import FileUploadResponse

router = APIRouter()

@router.post("/upload-rent-roll", response_model=FileUploadResponse)
async def upload_rent_roll(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload and parse rent roll file (CSV, Excel)
    """
    try:
        # Validate file type
        allowed_extensions = ['.csv', '.xlsx', '.xls']
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"File type not supported. Allowed: {', '.join(allowed_extensions)}"
            )
        
        # Validate file size
        if file.size > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE / (1024*1024)}MB"
            )
        
        # Parse file
        file_parser = FileParser()
        rent_roll_data = await file_parser.parse_rent_roll(file)
        
        return FileUploadResponse(
            success=True,
            data=rent_roll_data,
            message="Rent roll parsed successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process file: {str(e)}"
        )

@router.post("/upload-t12", response_model=FileUploadResponse)
async def upload_t12(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload and parse T12 financial statement (PDF)
    """
    try:
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are supported for T12 uploads"
            )
        
        # Validate file size
        if file.size > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE / (1024*1024)}MB"
            )
        
        # Parse file
        file_parser = FileParser()
        t12_data = await file_parser.parse_t12(file)
        
        return FileUploadResponse(
            success=True,
            data=t12_data,
            message="T12 statement parsed successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process T12 file: {str(e)}"
        )

@router.get("/supported-formats")
async def get_supported_formats():
    """
    Get list of supported file formats
    """
    return {
        "rent_roll": {
            "formats": ["CSV", "Excel (.xlsx, .xls)"],
            "max_size_mb": settings.MAX_FILE_SIZE / (1024*1024)
        },
        "t12": {
            "formats": ["PDF"],
            "max_size_mb": settings.MAX_FILE_SIZE / (1024*1024)
        }
    } 