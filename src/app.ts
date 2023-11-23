import http from 'http';
import path from 'path';
import cookieParser from 'cookie-parser';
import express from 'express';
import accessLogger from '@/middlewares/accessLogger';
import appErrorHandler from '@/middlewares/appErrorHandler';
import notFoundHandler from '@/middlewares/notFoundHandler';
import serverErrorHandlers from '@/middlewares/serverErrorHandler';
import serverListener from '@/middlewares/serverListener';
import indexRouter from '@/routes/index';

const app = express();
const server = http.createServer(app);

// 基本情報設定
const port = process.env.PORT || '3000';
app.set('port', port);

// ミドルウェア追加
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(accessLogger);

// ルーティング設定
app.use('/', indexRouter);

// エラーハンドリング設定
app.use(notFoundHandler);
app.use(appErrorHandler);

// サーバー設定
server.on('error', serverErrorHandlers);
server.on('listening', () => serverListener(server));

server.listen(port);
