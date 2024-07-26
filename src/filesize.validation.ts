import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { IFile } from '@nestjs/common/pipes/file/interfaces';

@Injectable()
export class FilesCountValidationPipe implements PipeTransform {
  transform(value: IFile[], metadata: ArgumentMetadata) {
    // "value" is an object containing the file's attributes and metadata
    if (value.length > 5 || value.length < 2) {
      throw new BadRequestException(
        'تعداد عکسهای آپلود شده باید بیشتر از یکی و کمتر از 5 عکس باشد',
      );
    }

    return value;
  }
}
