const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
let isLoggedIn = false;

app.use(express.json());
app.use(express.static('public'));

// HOME
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// LOGIN
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const usersFile = path.join(__dirname, 'data', 'users.json');

  const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    isLoggedIn = true;
    res.json({ success: true });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }
});


// DASHBOARD
app.get('/dashboard', (req, res) => {
  if (isLoggedIn) {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
  } else {
    res.redirect('/login.html');
  }
});

// LOGOUT
app.get('/logout', (req, res) => {
  isLoggedIn = false;
  res.redirect('/login.html');
});

// GET PRODUCTS
app.get('/products', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'products.json');

  if (!fs.existsSync(filePath)) {
    return res.json([]);
  }

  const data = fs.readFileSync(filePath, 'utf-8');
  res.json(data ? JSON.parse(data) : []);
});

// ADD PRODUCT
app.post('/add-product', (req, res) => {
  const { name, price, gst } = req.body;

  if (!name || !price || !gst) {
    return res.status(400).json({ message: 'All fields required' });
  }

  const filePath = path.join(__dirname, 'data', 'products.json');
  const products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const newProduct = {
    id: Date.now(),
    name,
    price,
    gst
  };

  products.push(newProduct);
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

  res.json({ success: true, product: newProduct });
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
