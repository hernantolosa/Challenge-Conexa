import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const { statusCode, statusMessage } = res;
      const contentLength = res.get('content-length');
      const responseBody = res.locals.body;

      this.logger.log(
        `${method} ${originalUrl} - ${statusCode} ${statusMessage} - ${contentLength} bytes - ${userAgent}`,
      );

      if (responseBody) {
        this.logger.log(`Response Body: ${JSON.stringify(responseBody)}`);
      }
    });

    next();
  }
}
