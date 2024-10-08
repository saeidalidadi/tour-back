import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseInterceptors,
  Get,
  UseGuards,
  Request,
  Put,
  Query,
  UploadedFiles,
  ParseFilePipe,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { ToursService } from './tours.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { TourStatus } from './enums';
import { AnyFilesInterceptor } from '@nest-lab/fastify-multer';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JWTOptional } from '../auth/jwt-optional.decorator';
import { IsActive } from '../auth/is-active.guard';
import { FilesCountValidationPipe } from '../filesize.validation';

@Controller('tours')
export class ToursController {
  constructor(private readonly tourService: ToursService) {}

  @Post('')
  @UseInterceptors(AnyFilesInterceptor())
  @Roles(Role.Leader, Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(IsActive)
  @UseGuards(JwtAuthGuard)
  async createTour(
    @Body() createTourDto: CreateTourDto,
    @Request() req: any,
    @UploadedFiles(
      new FilesCountValidationPipe(),
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 1010101 })
        .build({ fileIsRequired: true }),
    )
    files: Array<Express.Multer.File>,
  ) {
    console.log('tour content____', files);
    // return this.tourService.createTour(files, createTourDto, req.user.id);
  }

  @Put('/:id')
  @UseInterceptors(AnyFilesInterceptor())
  @Roles(Role.Leader, Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(IsActive)
  @UseGuards(JwtAuthGuard)
  async updateTour(
    @Body() tourDto: UpdateTourDto,
    @Param('id') tourId: number,
    @Request() req: any,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ) {
    console.log('tour content____', tourDto, files);
    return this.tourService.updateTour(req.user.id, tourId, tourDto, files);
  }

  @Delete('/images/:uuid')
  @Roles(Role.Leader)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  deleteImage(@Param('uuid') imageUUID: string, @Request() req: any) {
    // return this.tourService.removeImage(imageUUID, req.user.id);
  }

  @Get('/public')
  async tourListPublic(@Query() query: any, @Request() req: any) {
    console.log('request', req.url);
    console.log('queries', query);
    return await this.tourService.listPublic(query);
  }

  @Get(':id')
  @JWTOptional()
  @UseGuards(JwtAuthGuard)
  async getTour(
    @Param('id') tourId: number,
    @Query() query: any,
    @Request() req: any,
  ) {
    console.log('request of user is very helpful_____', req.user);
    return await this.tourService.getTour(tourId, query, req.user.id);
  }

  @Put(':id/accept')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  acceptTour(@Param('id') tourId: number) {
    return this.tourService.accept(tourId);
  }

  @Put(':id/reject')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  rejectTour(@Param('id') tourId: number, @Body() rejectionData: any) {
    return this.tourService.rejectTour(tourId, rejectionData);
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async tourList(@Query() query: any) {
    return await this.tourService.list(query);
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

  @Post(':id/reserve')
  @UseGuards(IsActive)
  @UseGuards(JwtAuthGuard)
  reserveTour(
    @Param('id') tourId: number,
    @Request() req: any,
    @Body() data: CreateReservationDto,
  ) {
    return this.tourService.reserve(tourId, req.user.id, data);
  }

  @Get(':id/reservations-gender')
  @Roles(Role.Leader)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  getReservations(@Param('id') tourId: number) {
    return this.tourService.getReservationsByGender(tourId);
  }
}
