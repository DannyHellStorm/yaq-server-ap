import config from 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';

import * as mapping from './models/mapping.js';
import sequelize from './sequelize.js';
import router from './routes/index.js';
import ErrorHandler from './middleware/ErrorHandler.js';

const PORT = process.env.PORT || 5000;

const app = express();
// Cross-Origin Resource Sharing
app.use(cors());
// middleware для работы с json
app.use(express.json());
// middleware для статики (img, css)
app.use(express.static('static'));
// cookie для корзины
app.use(cookieParser(process.env.SECRET_KEY));
// middleware для загрузки файлов
app.use(fileUpload());
// все маршруты приложения
app.use('/api/v1', router);

// обработка ошибок
app.use(ErrorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log('Сервер запущен на порту', PORT));
  } catch (e) {
    console.log(e);
  }
};

start();
