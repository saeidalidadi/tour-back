import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateTourDto } from './dto/create-tour.dto';
import { File, FileInterceptor } from '@nest-lab/fastify-multer';
import { ToursService } from './tours.service';

@Controller('tours')
export class ToursController {
  constructor(private readonly tourService: ToursService) {}
  @Post()
  //   @UseGuards(JwtAuthGuard)
  async create(@Body() createTourDto: any) {
    return this.tourService.createTour(createTourDto);
  }

  @Post('/images')
  @UseInterceptors(FileInterceptor('image'))
  //   @UseGuards(JwtAuthGuard)
  async upload(
    @UploadedFile()
    file: File,
  ) {
    console.log(file);
    return this.tourService.uploadImage(file);
  }

  @Delete('/images/:uuid')
  //   @UseGuards(JwtAuthGuard)
  deleteImage(@Param('uuid') imageUUID: string) {
    return this.tourService.removeImage(imageUUID);
  }
}
