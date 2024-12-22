import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImportService } from './import.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async importFile(@UploadedFile() file: Express.Multer.File) {
    if (!file || !file?.buffer) {
      throw new BadRequestException('No file uploaded');
    }

    const allowedTypes = ['text/plain'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type, only .txt file allowed',
      );
    }

    const fileContent = file.buffer.toString('utf-8');

    try {
      await this.importService.importDump(fileContent);
      return { message: 'File imported successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
