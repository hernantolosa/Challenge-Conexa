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

      this.logger.log(
        ` Method: ${method} - Path: ${originalUrl} - statusCode: ${statusCode} ${statusMessage} - ${contentLength} bytes - UserAgent: ${userAgent}`,
      );
    });

    next();
  }
}
