import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTourDto } from './dto/create-tour.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  Equal,
  FindManyOptions,
  FindOneOptions,
  In,
  QueryRunner,
  Repository,
} from 'typeorm';
import { Tour } from '../entities/tour.entity';
import { ImageEntity } from '../entities/images.entity';
import {
  Leader,
  TagEntity,
  TourAttendeesEntity,
  TourReservationEntity,
  User,
} from '../entities';
import { TourStatus } from './enums';
import { ImagesService } from '../images/images.service';
import { UpdateTourDto } from './dto/update-tour.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour) private readonly tourRepository: Repository<Tour>,
    @InjectRepository(TourReservationEntity)
    private readonly reservationRepository: Repository<TourReservationEntity>,
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
    private readonly imageService: ImagesService,
    private dataSource: DataSource,
  ) {}

  private async getReservationCount(tourId: number) {
    const [reservations, count] = await this.reservationRepository.findAndCount(
      {
        where: { tour: { id: tourId } as Tour },
        relations: { attendees: true },
      },
    );
    return (
      count +
      reservations.reduce((total, rsv) => {
        const cTotal = total + rsv.attendees.length;
        return cTotal;
      }, 0)
    );
  }

  async createTour(
    images: Array<Express.Multer.File>,
    tour: CreateTourDto,
    userId: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const user = { id: userId } as User;
    const leader = await queryRunner.manager.findOne(Leader, {
      where: { user: user },
    });
    const tourEntity = this.tourRepository.create();
    tourEntity.leader = leader;
    tourEntity.tourName = tour.tourName;
    tourEntity.tourDescription = tour.tourDescription;
    tourEntity.startDate = new Date(Number(tour.duration.from));
    tourEntity.finishDate = new Date(Number(tour.duration.to));
    tourEntity.price = tour.price;
    tourEntity.tourAttendance = tour.tourAttendance;
    tourEntity.owner = user;
    tourEntity.timeline = tour.timeline;
    tourEntity.originProvince = tour.origin.province;
    tourEntity.originCity = tour.origin.city;
    tourEntity.destinationProvince = tour.destination.province;
    tourEntity.destinationCity = tour.destination.city;

    const tags = tour.tags.map((tag) => {
      return { id: tag } as TagEntity;
    });
    tourEntity.tags = tags;

    try {
      const result = await queryRunner.manager.save(tourEntity);
      await queryRunner.commitTransaction();
      await queryRunner.startTransaction();
      const imagesData = await this.saveTourImages(result.id, images);
      const imageQueryResult = await queryRunner.manager.save(imagesData);

      await queryRunner.commitTransaction();
    } catch (err) {
      console.log('err', err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      return {};
    }
  }

  async updateTour(
    userId: number,
    tourId: number,
    updateTourDto: UpdateTourDto,
    images: Array<Express.Multer.File>,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const tourRow = await queryRunner.manager.findOne(Tour, {
      where: { id: tourId, owner: { id: userId } as User },
      relations: { tags: true },
    });
    if (!tourRow) {
      throw new NotFoundException();
    }
    tourRow.tourName = updateTourDto.tourName;
    tourRow.tourDescription = updateTourDto.tourDescription;
    tourRow.startDate = new Date(Number(updateTourDto.duration.from));
    tourRow.finishDate = new Date(Number(updateTourDto.duration.to));
    tourRow.price = updateTourDto.price;
    tourRow.tourAttendance = updateTourDto.tourAttendance;
    tourRow.timeline = updateTourDto.timeline;
    tourRow.originProvince = updateTourDto.origin.province;
    tourRow.originCity = updateTourDto.origin.city;
    tourRow.destinationProvince = updateTourDto.destination.province;
    tourRow.destinationCity = updateTourDto.destination.city;
    console.log('tags of tour', updateTourDto.tags);

    const tags = updateTourDto.tags.map((tag) => {
      return { id: Number(tag) } as TagEntity;
    });
    tourRow.tags = tags;

    try {
      const result = await queryRunner.manager.save(tourRow);
      await queryRunner.commitTransaction();

      await queryRunner.startTransaction();
      const imageRows = await this.saveTourImages(result.id, images);
      console.log('images of tours', imageRows);
      const imageQueryResult = await queryRunner.manager.save(imageRows);

      if (updateTourDto.images) {
        for (const image of updateTourDto.images) {
          console.log('delete image before check', image);
          if (Number(image.deleted) === 1) {
            console.log('delete image', image);
            await this.deleteTourImage(image.id, tourId, queryRunner);
          }
        }
      }
      // await Promise.all(deletions);
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log('erro on update', err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      return {};
    }
  }

  async deleteTourImage(
    imageId: number,
    tourId: number,
    queryRunner: QueryRunner,
  ) {
    const imageRow = await queryRunner.manager.findOne(ImageEntity, {
      where: { id: imageId, tour: { id: tourId } as Tour },
    });
    await this.imageService.removeImage(imageRow.path);
    return await queryRunner.manager.delete(ImageEntity, imageRow.id);
  }

  private async saveTourImages(
    tourId: number,
    images: Array<Express.Multer.File>,
  ) {
    const imagesUUID = await this.imageService.uploadImages(images, 'tours');

    const t = new Tour();
    t.id = tourId;
    const imagesData = imagesUUID.map((imageID) => ({
      path: imageID,
      tour: t,
    }));
    return this.imageRepository.create(imagesData);
  }

  async listPublic(queries: any) {
    const skip = ((queries.page ? queries.page : 1) - 1) * 5;
    let { from } = queries;
    const { to, days } = queries;

    from = from || new Date();

    const query = this.tourRepository
      .createQueryBuilder('tour')
      .leftJoinAndSelect('tour.owner', 'owner')
      .leftJoinAndSelect('tour.leader', 'leader')
      .skip(skip)
      .take(5)
      .orderBy('tour.updatedAt', 'ASC')
      .select([
        'tour.id',
        'tour.tourName',
        'tour.tourAttendance',
        'tour.price',
        'tour.startDate',
        'tour.updatedAt',
        'tour.finishDate',
        'tour.subDescription',
      ])
      .addSelect([
        'owner.firstName',
        'owner.lastName',
        'owner.id',
        'owner.avatar',
      ])
      .addSelect(['leader.id'])
      .where('tour.status = :status', { status: TourStatus.PUBLISHED })
      .leftJoinAndSelect('tour.tags', 'tags');

    if (days) {
      query.andWhere(
        "DATE_PART( 'day', tour.finishDate - tour.startDate ) = :days",
        {
          days,
        },
      );
    }
    if (from) {
      query.andWhere('tour.startDate >= :from', {
        from: new Date(Number(from || Date.now())),
      });
    }
    if (to) {
      query.andWhere('tour.finishDate <= :to', {
        to: new Date(Number(to || Date.now())),
      });
    }

    const [tours, count] = await query.getManyAndCount();

    return { list: tours, total: count };
  }

  async list(page: number) {
    const skip = (Number(page) - 1) * 10;
    const [tours, count] = await this.tourRepository.findAndCount({
      order: { updatedAt: 'DESC' },
      skip,
      take: 10,
      relations: { owner: true },
    });
    return { list: tours, total: count };
  }

  // Public
  async getTour(id: number, query) {
    const { populate } = query;

    if (populate == 'reservation') {
      const row = await this.tourRepository.findOne({
        where: { id },
        select: { tourName: true, id: true, tourAttendance: true, price: true },
      });
      const reservation = await this.getReservationCount(row.id);
      return { data: { ...row, reservations: reservation }, success: true };
    }
    const row = await this.tourRepository.findOne({
      where: { id, status: Equal(TourStatus.PUBLISHED) },
      relations: { images: true, leader: true, owner: true, tags: true },
      select: {
        leader: { intro: true },
        owner: { firstName: true, lastName: true, avatar: true },
        tags: { name: true, id: true },
      },
    });
    console.log('row of tour_____', row);
    return { data: row, success: true };
  }

  async accept(tourId: number) {
    const result = await this.tourRepository.update(tourId, {
      status: TourStatus.ACCEPTED,
    });
    return result;
  }

  async rejectTour(tourId: number, data) {
    console.log('data', tourId, data);
    await this.tourRepository.update(tourId, {
      rejectionComment: data.rejectionComment,
      status: TourStatus.REJECTED,
    });
    return { data: true, success: true };
  }

  async getLeaderTours(leaderId: number, queries: any) {
    const { status } = queries;
    const skip = (Number(queries.page) - 1) * 10;
    const owner = new User();
    owner.id = leaderId;
    const queryOptions: FindManyOptions<Tour> = {
      where: { owner },
      skip,
      take: 10,
      order: { updatedAt: 'DESC' },
    };
    if (status) {
      queryOptions.where = {
        ...queryOptions.where,
        status: typeof status === 'string' ? Equal(status) : In(status),
      };
    }
    const [tours, count] = await this.tourRepository.findAndCount(queryOptions);
    return { list: tours, total: count };
  }

  async getTourImages(tourId: number) {
    return this.imageRepository.find({
      where: { tour: { id: tourId } as Tour },
    });
  }

  async getLeaderTourById(userId: number, tourId: number, query: any = {}) {
    const user = new User();
    user.id = userId;
    const queryObject: FindOneOptions<Tour> = {
      where: { id: tourId, owner: user },
      relations: { tags: true },
    };
    if (query.populate === 'images') {
      queryObject.relations = { ...queryObject.relations, images: true };
    }

    return await this.tourRepository.findOne(queryObject);
  }

  async setStatus(tourId: number, leaderId: number, status: TourStatus) {
    const leader = new Leader();
    leader.id = leaderId;
    const tour = await this.tourRepository.findOne({
      where: { id: tourId, owner: leader },
    });
    if (!tour) {
      throw new NotFoundException('tour not found');
    }
    const result = await this.dataSource
      .createQueryBuilder()
      .update(Tour)
      .set({
        status:
          status === TourStatus.PUBLISHED
            ? TourStatus.PUBLISHED
            : TourStatus.UNPUBLISHED,
      })
      .where('id = :tourId', { tourId })
      .andWhere('owner_id = :ownerId', { ownerId: leaderId })
      .andWhere('status NOT IN (:status)', {
        status: [TourStatus.REJECTED, TourStatus.RELEASED],
      })
      .execute();

    return result;
  }

  async reserve(tourId: number, userId: number, data: CreateReservationDto) {
    console.log('data of reservation____', data);

    const tour = new Tour();
    tour.id = tourId;

    const tourRow = await this.tourRepository.findOne({
      where: tour,
    });

    if (!tourRow) {
      throw new NotFoundException('تور مورد نظر یافت نشد');
    }
    const query = this.dataSource.createQueryRunner();
    try {
      await query.connect();
      await query.startTransaction('REPEATABLE READ');
      const requestedReservationCount = data.attendees.length + 1;
      const currentReservationCount = await this.getReservationCount(tour.id);

      if (
        requestedReservationCount + currentReservationCount >
        tourRow.tourAttendance
      ) {
        throw new NotAcceptableException({
          message: 'تعداد درخواستی برای رزرو بیشتر از ظرفیت میباشد',
          availableCount: tourRow.tourAttendance - currentReservationCount,
        });
      }
      const reservation = this.reservationRepository.create();
      reservation.tour = tour;
      reservation.user = { id: userId } as User;
      reservation.attendees = data.attendees.map((it) => {
        const atn = new TourAttendeesEntity();
        atn.fullName = it.fullName;
        atn.gender = it.gender;
        atn.mobile = it.mobile;
        atn.nationalId = it.nationalId;
        return atn;
      });
      const result = await query.manager.save(reservation);
      await query.commitTransaction();
      console.log('result', result);
      return { data: result };
    } catch (err) {
      await query.rollbackTransaction();
      if (err.status) {
        throw err;
      }
    } finally {
      await query.release();
    }
  }
}
