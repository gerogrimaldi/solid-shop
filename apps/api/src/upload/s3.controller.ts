import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { S3Service } from './s3.service';
import { JwtAuthGuard } from 'src/authorization/guards/jwt-auth.guard';
import { RolesGuard } from 'src/authorization/custom-decorators/roles.guard';
import { AcceptedRoles } from 'src/authorization/custom-decorators/roles.decorator';

@UseGuards(JwtAuthGuard,RolesGuard)
@AcceptedRoles('ADMIN')
@ApiTags('File Upload')
@Controller('upload')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post("image")
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a file to S3 using Multer' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    return await this.s3Service.uploadFile(file);
  }
}
