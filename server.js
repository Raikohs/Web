const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config(); // Загружаем переменные окружения

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Подключение к MongoDB (исправленный вариант)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Схема книги
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    year: Number,
    genre: String,
});

const Book = mongoose.model('Book', bookSchema);

// Маршруты
app.get('/books', async(req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/books', async(req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        year: req.body.year,
        genre: req.body.genre,
    });

    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/books/:id', async(req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/books/:id', async(req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Маршрут для получения погоды
app.get('/weather/:city', async(req, res) => {
    const city = req.params.city;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        const weatherData = {
            city: response.data.name,
            temperature: `${response.data.main.temp}°C`,
            condition: response.data.weather[0].description,
        };
        res.json(weatherData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const swaggerSetup = require('./swagger'); // Подключаем Swagger
swaggerSetup(app); // Инициализируем Swagger
// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});