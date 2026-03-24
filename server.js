const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));


/* =========================
   GET TODOS
========================= */
app.get('/usuarios', async (req, res) => {
    const result = await pool.query('SELECT * FROM usuarios ORDER BY id');
    res.json(result.rows);
});

/* =========================
   GET POR ID
========================= */
app.get('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM usuarios WHERE id=$1', [id]);
    res.json(result.rows[0]);
});

/* =========================
   CREAR
========================= */
app.post('/usuarios', async (req, res) => {
    const { nombre, email, edad, pais } = req.body;

    const result = await pool.query(
        'INSERT INTO usuarios(nombre, email, edad, pais) VALUES($1,$2,$3,$4) RETURNING *',
        [nombre, email, edad, pais]
    );

    res.json(result.rows[0]);
});


app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, email, edad, pais } = req.body;

    const result = await pool.query(
        'UPDATE usuarios SET nombre=$1, email=$2, edad=$3, pais=$4 WHERE id=$5 RETURNING *',
        [nombre, email, edad, pais, id]
    );

    res.json(result.rows[0]);
});


app.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;

    await pool.query('DELETE FROM usuarios WHERE id=$1', [id]);

    res.json({ mensaje: 'Usuario eliminado' });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});