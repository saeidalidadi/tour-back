import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  UseGuards,
  Request,
  Put,
  Query,
} from '@nestjs/common';
import { CreateTourDto } from './dto/create-tour.dto';
import { File, FileInterceptor } from '@nest-lab/fastify-multer';
import { ToursService } from './tours.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { RolesGuard } from '../auth/roles.guard';

@Controller('tours')
export class ToursController {
  constructor(private readonly tourService: ToursService) {}
  @Post()
  @Roles(Role.Leader, Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async create(@Body() createTourDto: any, @Request() req: any) {
    return this.tourService.createTour(createTourDto, req.user.id);
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

  @Get('/public')
  async tourListPublic(@Query('page') page: number) {
    return await this.tourService.listPublic(page);
  }

  @Get(':id')
  async getTour(@Param('id') tourId: number) {
    return await this.tourService.getTour(tourId);
  }

  @Put(':id/accept')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  acceptTour(@Param('id') tourId: number) {
    return this.tourService.accept(tourId);
  }

  @Get('/me')
  @Roles(Role.Leader)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  getMyTours(@Request() req: any) {
    return this.tourService.getLeaderTours(req.user.id);
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async tourList() {
    return await this.tourService.list();
  }

  @Get(':id/images')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async getImages(@Param('id') tourId: number) {
    return await this.tourService.getTourImages(tourId);
  }
}
