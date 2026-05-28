from pydantic import BaseModel
from typing import List, Optional

class InventoryCreate(BaseModel):
    product_sku: str
    product_name: str
    store_name: str
    quantity_on_hand: float
    reorder_threshold: float

class BulkDeleteRequest(BaseModel):
    ids: Optional[List[int]] = None
    delete_all: bool = False
