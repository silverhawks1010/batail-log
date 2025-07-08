const db = require('../db');

exports.getAllProducts = (req, res) => {
  const { search = '', condtion, sort = 'id', order = 'asc' } = req.query;

  let query = `SELECT * FROM products WHERE title LIKE ?`;
  const params = [`%${search}%`];
  if (condtion) {
    query += ` AND condition = ?`;
    params.push(condtion);
  }
  query += ` ORDER BY ${sort} ${order.toUpperCase()}`;

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching products:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
}

exports.getProductById = (req, res) => {
  const id = req.params.id;

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching product:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(row);
  });
}

exports.createProduct = (req, res) => {
  console.log('Creating product with body:', req);
  const { title, description, price, condition } = req.body;

  if (!title || !description || !price || !condition) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run('INSERT INTO products (title, description, price, condition) VALUES (?, ?, ?, ?)',
    [title, description, price, condition],
    function(err) {
      if (err) {
        console.error('Error creating product:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
}

exports.updateProduct = (req, res) => {
  const id = req.params.id;
  const { title, description, price, condition } = req.body;

  if (!title || !description || !price || !condition) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run('UPDATE products SET title = ?, description = ?, price = ?, condition = ? WHERE id = ?',
    [title, description, price, condition, id],
    function(err) {
      if (err) {
        console.error('Error updating product:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product updated successfully' });
    }
  );
}

