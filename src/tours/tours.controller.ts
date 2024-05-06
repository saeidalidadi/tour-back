import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CreateTourDto } from './dto/create-tour.dto';
import {
  File,
  FilesInterceptor,
  FastifyMulterModule,
} from '@nest-lab/fastify-multer';
import * as sharp from 'sharp';
import { writeFileSync } from 'fs';

@Controller('tours')
export class ToursController {
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  //   @UseGuards(JwtAuthGuard)
  async create(
    @Body() createVolunteerDto: CreateTourDto,
    @UploadedFiles()
    files: Array<File>,
  ) {
    console.log(files);
    const fi = await sharp(files[0].buffer)
      .resize({ fit: sharp.fit.contain, width: 150 })
      .jpeg({ quality: 100 })
      .toFile('./name.jpg');

    // return this.volunteersService.create(createVolunteerDto, files);
    // writeFileSync('./name1.jpg', fi);
  }
}
