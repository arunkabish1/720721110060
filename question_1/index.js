const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.send('Welcome to the Top Products HTTP Microservice!');
});

app.get('/categories/:categoryName/products', async (req, res) => {
    try {
      const { top, minPrice, maxPrice, page = 1, sortBy, sortOrder } = req.query;
      const { categoryName } = req.params;
      
      console.log('Received query parameters:', req.query);

      if (!top || !minPrice || !maxPrice || isNaN(parseInt(top)) || isNaN(parseInt(minPrice)) || isNaN(parseInt(maxPrice))) {
        throw new Error('Required query parameters are missing or invalid: top, minPrice, maxPrice');
      }

      console.log('Parsed values:', top, minPrice, maxPrice);

      const products = await fetchProducts(categoryName, top, minPrice, maxPrice, page, sortBy, sortOrder);
      res.render('products', { categoryName, products });
    } catch (error) {
      console.error('Error fetching products:', error.response ? error.response.data : error.message);
      res.status(error.response ? error.response.status : 500).json({ error: error.message });
    }
});




app.get('/categories/:categoryName/products/:productId', async (req, res) => {
  try {
    const { categoryName, productId } = req.params;
    const product = await fetchProductDetails(categoryName, productId);
    res.render('productDetails', { categoryName, product });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

async function fetchProducts(categoryName, top, minPrice, maxPrice, page, sortBy, sortOrder) {
    let url = `http://20.244.56.144/test/companies/ANZ/categories/${categoryName}/products?top=${top}&minPrice=${minPrice}&maxPrice=${maxPrice}&page=${page}`;
    if (sortBy && sortOrder) {
      url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    }
    const headers = {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE1MTYyNzcxLCJpYXQiOjE3MTUxNjI0NzEsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjQ3NGM0OGRjLTE0MDctNGU0MS05MWU5LWE4ZWUzMWQ1ZTlkYyIsInN1YiI6ImFydW5rYWJpc2hAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiSGluZHVzdGhhbiIsImNsaWVudElEIjoiNDc0YzQ4ZGMtMTQwNy00ZTQxLTkxZTktYThlZTMxZDVlOWRjIiwiY2xpZW50U2VjcmV0IjoibXZuVFpVZGt5aFBVUEhIdSIsIm93bmVyTmFtZSI6IkFydW4gSiIsIm93bmVyRW1haWwiOiJhcnVua2FiaXNoQGdtYWlsLmNvbSIsInJvbGxObyI6IjcyMDcyMTExMDA2MCJ9.OUH1A17pbfYfjHHX7y_2rT9E8zwIi5uFT9Q0JWOu6xk`
    };
    const response = await axios.get(url, { headers });
    return response.data;
  }
  
  async function fetchProductDetails(categoryName, productId) {
    const url = `http://20.244.56.144/test/companies/ANZ/categories/${categoryName}/products/${productId}`;
    const headers = {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE1MTYyNzcxLCJpYXQiOjE3MTUxNjI0NzEsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjQ3NGM0OGRjLTE0MDctNGU0MS05MWU5LWE4ZWUzMWQ1ZTlkYyIsInN1YiI6ImFydW5rYWJpc2hAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiSGluZHVzdGhhbiIsImNsaWVudElEIjoiNDc0YzQ4ZGMtMTQwNy00ZTQxLTkxZTktYThlZTMxZDVlOWRjIiwiY2xpZW50U2VjcmV0IjoibXZuVFpVZGt5aFBVUEhIdSIsIm93bmVyTmFtZSI6IkFydW4gSiIsIm93bmVyRW1haWwiOiJhcnVua2FiaXNoQGdtYWlsLmNvbSIsInJvbGxObyI6IjcyMDcyMTExMDA2MCJ9.OUH1A17pbfYfjHHX7y_2rT9E8zwIi5uFT9Q0JWOu6xk`
    };
    const response = await axios.get(url, { headers });
    return response.data;
  }
  
