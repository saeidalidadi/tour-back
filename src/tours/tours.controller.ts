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
  UploadedFiles,
} from '@nestjs/common';
import { ToursService } from './tours.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { TourStatus } from './enums';
// import {
//   AnyFilesInterceptor,
// } from '@nestjs/platform-express';
import { AnyFilesInterceptor } from '@nest-lab/fastify-multer';
import { CreateTourDto } from './dto/create-tour.dto';

@Controller('tours')
export class ToursController {
  constructor(private readonly tourService: ToursService) {}

  @Post('')
  @UseInterceptors(AnyFilesInterceptor())
  @Roles(Role.Leader, Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async upload(
    @Body() createTourDto: CreateTourDto,
    @Request() req: any,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ) {
    console.log(createTourDto);
    return this.tourService.createTour(files, createTourDto, req.user.id);
  }

  @Delete('/images/:uuid')
  @Roles(Role.Leader)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  deleteImage(@Param('uuid') imageUUID: string, @Request() req: any) {
    return this.tourService.removeImage(imageUUID, req.user.id);
  }

  @Delete(':id/images/:uuid')
  @Roles(Role.Leader)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  deleteImageOfTour(@Param('uuid') imageUUID: string, @Request() req: any) {
    return this.tourService.removeToursImage(imageUUID, req.user.id);
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
  getMyTours(@Request() req: any, @Query('page') page: number) {
    console.log('tours api log....');
    return this.tourService.getLeaderTours(req.user.id, page);
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async tourList(@Query('page') page: number) {
    return await this.tourService.list(page);
  }

  @Get(':id/images')
  @Roles(Role.Admin, Role.Leader)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async getImages(@Param('id') tourId: number) {
    return await this.tourService.getTourImages(tourId);
  }

  @Get(':id/me')
  @Roles(Role.Leader)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  getTourById(
    @Request() req: any,
    @Param('id') tourId: number,
    @Query('populate') populate: string,
  ) {
    return this.tourService.getLeaderTourById(req.user.id, tourId, {
      populate,
    });
  }

  @Put(':id/status')
  @Roles(Role.Leader)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  publishTour(
    @Param('id') tourId: number,
    @Query('mode') mode: TourStatus,
    @Request() req: any,
  ) {
    return this.tourService.setStatus(tourId, req.user.id, mode);
  }
}
