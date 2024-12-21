import {
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
    if (!file || !file.buffer) {
      throw new Error('File is missing or failed to upload');
    }

    const fileContent = file.buffer.toString('utf-8');
    await this.importService.importDump(fileContent);
    return { message: 'File imported successfully' };
  }
}
