// parse-json.pipe.ts
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseJsonPipe<T = unknown> implements PipeTransform<T> {
  transform(value: any, metadata: ArgumentMetadata): T {
    try {
      if (typeof value === 'string') {
        return JSON.parse(value) as T;
      }
      return value as T;
    } catch {
      throw new BadRequestException(`Invalid JSON in field: ${metadata.data}`);
    }
  }
}
