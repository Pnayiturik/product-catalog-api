# Product Catalog API

A RESTful API for managing products, categories, inventory, and reporting for an e-commerce platform.

## Author

Patrick Nayituriki

---

## Features

- Product and Category CRUD
- Product variants (size, color, etc.)
- Inventory tracking
- Pricing and discounts
- Product search and filtering
- Low-stock reporting
- Input validation and error handling
- Swagger API documentation

---

## Setup & Installation

1. **Clone the repository**

   ```sh
   git clone <your-repo-url>
   cd ai-api-product
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/product_catalog
   ```

4. **Start MongoDB**

   Make sure MongoDB is running locally.  
   If you have MongoDB installed, you can start it with:

   ```sh
   mongod
   ```

5. **Start the API server**

   ```sh
   npm run dev
   ```

   The server will run on `http://localhost:3000`.

---

## API Documentation

Swagger UI is available at:  
`http://localhost:3000/api-docs`

---

## Example Endpoints

- **Create Category:**  
  `POST /api/categories`  
  Body: `{ "name": "Electronics", "description": "Electronic items" }`

- **Create Product:**  
  `POST /api/products`  
  Body:
  ```json
  {
    "name": "T-Shirt",
    "description": "Cotton T-shirt",
    "category": "<category_id>",
    "price": 20,
    "discount": 10,
    "variants": [
      { "size": "M", "color": "Red", "stock": 5, "price": 20 },
      { "size": "L", "color": "Blue", "stock": 2, "price": 22 }
    ]
  }
  ```

- **Get Products:**  
  `GET /api/products?name=shirt&minPrice=10&maxPrice=30`

- **Low Stock Report:**  
  `GET /api/products/report/low-stock?threshold=3`

---

## Testing the API

You can use [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to test endpoints.

1. Import the Swagger docs or manually create requests.
2. Try creating, updating, and deleting categories and products.
3. Test search, filtering, and reporting endpoints.
4. Check error responses for invalid input.

---

## Notes

- Ensure MongoDB is running before starting the API.
- All endpoints return JSON responses.
- For full API details, see the Swagger docs at `/api-docs`.

---

