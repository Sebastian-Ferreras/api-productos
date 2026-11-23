const express = require('express')
const app = express()

app.use(express.json())

const productos = [
    {
        id: 1,
        nombre: 'Teclado inalambrico',
        descripcion: 'Teclado 101 teclas idioma ingles',
        precio: 1500.00
    },
    {
        id: 2,
        nombre: 'Mouse inalambrico',
        descripcion: 'Mouse optico inalambrico.',
        precio: 600.00
    },
    {
        id: 3,
        nombre: 'Monitor 23.5 pulgadas full hd',
        descripcion: 'Monitor Full HD panel IPS',
        precio: 6500.00
    }
]

const estaVacio = valor => valor === undefined || valor === null || valor === ''

const faltanCampos = ({ nombre, descripcion, precio } = {}) =>
    [nombre, descripcion, precio].some(estaVacio)

const generarId = () =>
    productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1

app.get('/productos', (req, res) => {
    res.json(productos)
})

app.get('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const producto = productos.find(p => p.id === id)

    if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    res.json(producto)
})

app.post('/productos', (req, res) => {
    if (faltanCampos(req.body)) {
        return res.status(400).json({ mensaje: 'Los campos nombre, descripcion y precio son obligatorios' })
    }

    const { nombre, descripcion, precio } = req.body

    const nuevoProducto = {
        id: generarId(),
        nombre,
        descripcion,
        precio: parseFloat(precio)
    }

    productos.push(nuevoProducto)
    res.status(201).json(nuevoProducto)
})

app.put('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const indice = productos.findIndex(p => p.id === id)

    if (indice === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    if (faltanCampos(req.body)) {
        return res.status(400).json({ mensaje: 'Los campos nombre, descripcion y precio son obligatorios' })
    }

    const { nombre, descripcion, precio } = req.body

    productos[indice] = {
        id,
        nombre,
        descripcion,
        precio: parseFloat(precio)
    }

    res.status(200).json(productos[indice])
})

app.delete('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const indice = productos.findIndex(p => p.id === id)

    if (indice === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    const [productoEliminado] = productos.splice(indice, 1)

    res.status(200).json({ mensaje: 'Producto eliminado', producto: productoEliminado })
})

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})
