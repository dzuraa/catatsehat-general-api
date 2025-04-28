import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ResponseEntity } from '../entities/response.entity';
import { I18nService } from 'nestjs-i18n';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly i18n: I18nService
  ) { }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).json(
      new ResponseEntity({
        status,
        message: exception.message,
        errors: exception.getResponse().errors?.map((err: { field: string, message: string[] }) => {
          return {
            field: err.field,
            message: err.message.map((item) => this.i18n.t(item.split('|')[0], {
              args: {
                field: err.field
              }
            })),
          };
        }),
      }),
    );
  }
}
