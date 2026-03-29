from fastapi.testclient import TestClient
 
from app.api import app

client = TestClient(app)

def test_products(): 
    # Create a product
    response = client.post(
        "/products/",
        json = {
            "name": "string",
            "color": "string",
            "weight": 0,
            "height": 0,
            "quantity": 0,
            "price": 0
        }
    )
    
    data = response.json()
    product_id = data["id"] # Get product id
    assert response.status_code == 201


    # Get all products
    response = client.get("/products/")
    assert response.status_code == 200

    # Get one product
    response = client.get(f"/products/{product_id}/")
    assert response.status_code == 200


    # Update one product
    response = client.put(
            f"/products/{product_id}",
            json = {
                "name": "string",
                "color": "string",
                "weight": 0,
                "height": 0,
                "quantity": 0,
                "price": 0
            }
        )
    assert response.status_code == 200

    # Delete one product
    response = client.delete(f"/products/{product_id}")
    assert response.status_code == 200

