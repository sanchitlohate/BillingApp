const express = require('express');
const fs = require('fs');
const path = require('path');
let isLoggedIn = false;


const app = express();
app.use(express.json());

app.use(express.static('public'));


// simple test route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const usersFilePath = path.join(__dirname, 'data', 'users.json');
  const usersData = fs.readFileSync(usersFilePath, 'utf-8');
  const users = JSON.parse(usersData);

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (user) {
  isLoggedIn = true;
  res.json({ success: true, message: 'Login successful' });
}
 else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});
app.get('/dashboard', (req, res) => {
  if (isLoggedIn) {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
  } else {
    res.redirect('/login.html');
  }
});
app.get('/logout', (req, res) => {
  isLoggedIn = false;
  res.redirect('/login.html');
});
// ADD PRODUCT
app.post('/products', (req, res) => {
  const { name, price, gst } = req.body;

  const filePath = path.join(__dirname, 'data', 'products.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  const products = JSON.parse(data);

  const newProduct = {
    id: products.length + 1,
    name,
    price,
    gst
  };

  products.push(newProduct);
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

  res.json({
    success: true,
    message: 'Product added',
    product: newProduct
  });
  // GET ALL PRODUCTS
app.get('/products', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'products.json');

  if (!fs.existsSync(filePath)) {
    return res.json([]);
  }

  const data = fs.readFileSync(filePath, 'utf-8');
  const products = data ? JSON.parse(data) : [];

  res.json(products);
});

});
// VIEW PRODUCTS
app.get('/products', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'products.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  const products = JSON.parse(data);

  res.json(products);
});

const PORT = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');

app.post('/add-product', (req, res) => {
  const { name, price, gst } = req.body;

  if (!name || !price || !gst) {
    return res.status(400).json({ message: 'All fields required' });
  }

  const filePath = path.join(__dirname, 'data', 'products.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  const products = JSON.parse(data);

  const newProduct = {
    id: Date.now(),
    name,
    price,
    gst
  };

  products.push(newProduct);
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

  res.json({ message: 'Product added successfully' });
});
app.get('/products', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'products.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  const products = JSON.parse(data);

  res.json(products);
});



app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

