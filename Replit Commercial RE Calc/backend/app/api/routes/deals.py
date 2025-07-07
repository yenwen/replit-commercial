from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.deal import DealInput, DealResponse
from app.services.deal_service import DealService

router = APIRouter()

@router.post("/", response_model=DealResponse)
async def create_deal(
    deal_input: DealInput,
    db: Session = Depends(get_db)
):
    """
    Create a new deal
    """
    try:
        deal_service = DealService(db)
        deal = deal_service.create_deal(deal_input)
        return DealResponse.from_orm(deal)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create deal: {str(e)}")

@router.get("/", response_model=List[DealResponse])
async def get_deals(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all deals for the current user
    """
    try:
        deal_service = DealService(db)
        deals = deal_service.get_deals(skip=skip, limit=limit)
        return [DealResponse.from_orm(deal) for deal in deals]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get deals: {str(e)}")

@router.get("/{deal_id}", response_model=DealResponse)
async def get_deal(
    deal_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific deal by ID
    """
    try:
        deal_service = DealService(db)
        deal = deal_service.get_deal(deal_id)
        if not deal:
            raise HTTPException(status_code=404, detail="Deal not found")
        return DealResponse.from_orm(deal)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get deal: {str(e)}")

@router.put("/{deal_id}", response_model=DealResponse)
async def update_deal(
    deal_id: int,
    deal_input: DealInput,
    db: Session = Depends(get_db)
):
    """
    Update a deal
    """
    try:
        deal_service = DealService(db)
        deal = deal_service.update_deal(deal_id, deal_input)
        if not deal:
            raise HTTPException(status_code=404, detail="Deal not found")
        return DealResponse.from_orm(deal)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update deal: {str(e)}")

@router.delete("/{deal_id}")
async def delete_deal(
    deal_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a deal
    """
    try:
        deal_service = DealService(db)
        success = deal_service.delete_deal(deal_id)
        if not success:
            raise HTTPException(status_code=404, detail="Deal not found")
        return {"message": "Deal deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete deal: {str(e)}") 