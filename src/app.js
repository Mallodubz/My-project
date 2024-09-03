const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public'))); // Servir archivos estáticos desde la carpeta 'public'

// Ruta para actualizar el progreso de un vendedor
app.post('/update-progress', (req, res) => {
    const { nombre, progreso } = req.body;
    const dataPath = path.join(__dirname, '../data/data.json');
    
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo de datos');
        }
        
        let dataJSON;
        try {
            dataJSON = JSON.parse(data);
        } catch (parseError) {
            return res.status(500).send('Error al parsear el archivo de datos');
        }
        
        dataJSON[nombre] = progreso;

        fs.writeFile(dataPath, JSON.stringify(dataJSON, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Error al actualizar el archivo de datos');
            }
            res.send('Progreso actualizado correctamente');
        });
    });
});

// Ruta para obtener las posiciones actuales
app.get('/positions', (req, res) => {
    const dataPath = path.join(__dirname, '../data/data.json');
    
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo de datos');
        }
        
        let positions;
        try {
            positions = JSON.parse(data);
        } catch (parseError) {
            return res.status(500).send('Error al parsear el archivo de datos');
        }
        
        res.json(positions);
    });
});

module.exports = app;
