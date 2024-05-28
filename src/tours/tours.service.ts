import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTourDto } from './dto/create-tour.dto';
import * as sharp from 'sharp';
import { v4 as uuid4 } from 'uuid';
import { join } from 'path';
import { existsSync, unlink } from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { Tour } from '../entities/tour.entity';
import { ImageEntity } from '../entities/images.entity';
import { Leader, User } from '../entities';
import { TourStatus } from './enums';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour) private readonly tourRepository: Repository<Tour>,
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
    private dataSource: DataSource,
  ) {}

  async createTour(
    images: Array<Express.Multer.File>,
    tour: CreateTourDto,
    leaderId: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const tourEntity = this.tourRepository.create();
    tourEntity.tourName = tour.tourName;
    tourEntity.tourDescription = tour.tourDescription;
    tourEntity.startDate = new Date(Number(tour.duration.from) * 1000);
    tourEntity.finishDate = new Date(Number(tour.duration.to) * 1000);
    tourEntity.price = tour.price;
    tourEntity.tourAttendance = tour.tourAttendance;
    tourEntity.owner = { id: leaderId } as User;
    try {
      const result = await queryRunner.manager.save(tourEntity);
      await queryRunner.commitTransaction();
      const imagesUUID = await this.uploadImages(images);

      const t = new Tour();
      t.id = result.id;
      const imagesData = imagesUUID.map((imageID) => ({
        path: imageID,
        tour: t,
      }));
      const imageRows = this.imageRepository.create(imagesData);
      const imageQueryResult = await queryRunner.manager.save(imageRows);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      return {};
    }
  }

  private imagesPath(name) {
    const dir = process.cwd();
    const path = join(`${dir}`, `/public/${name}.jpg`);
    return path;
  }

  async uploadImages(files: Array<Express.Multer.File>) {
    const uuids = [];
    for (const file of files) {
      const uuid = uuid4();
      const path = this.imagesPath(uuid);
      sharp(file.buffer, { failOnError: false })
        //   .resize({ fit: sharp.fit.contain, width: 150 })
        .jpeg({ quality: 100 })
        .toFile(path);
      uuids.push(uuid);
    }

    return uuids;
  }

  async removeImage(imageUUID: string, leaderId: number) {
    const path = this.imagesPath(imageUUID);
    console.log('remove image from ', path);
    // const leader = await this.use;
    if (existsSync(path)) {
      unlink(path, (err) => {
        if (err) {
          console.log(err);
        }
        console.log('deleted');
      });
    }
  }

  async removeToursImage(imageUUID, leaderId) {
    // const path = this.imagesPath(imageUUID);
    // console.log('remove image from ', path);
    // const leader = await this.use;
    // if (existsSync(path)) {
    //   unlink(path, (err) => {
    //     if (err) {
    //       console.log(err);
    //     }
    //     console.log('deleted');
    //   });
    // }
  }

  async listPublic(page: number = 1) {
    const skip = (page - 1) * 5;
    const [tours, count] = await this.tourRepository
      .createQueryBuilder('tour')
      .leftJoinAndSelect('tour.owner', 'owner')
      .where('tour.status = :status', { status: TourStatus.PUBLISHED })
      .skip(skip)
      .take(5)
      .orderBy('tour.updatedAt', 'DESC')
      .select([
        'tour.id',
        'tour.tourName',
        'tour.tourAttendance',
        'tour.tourDescription',
        'tour.price',
        'tour.startDate',
        'tour.updatedAt',
        'tour.finishDate',
      ])
      .addSelect(['owner.firstName', 'owner.lastName', 'owner.id'])
      .getManyAndCount();

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

  async getTour(id: number) {
    const row = await this.tourRepository.findOne({
      where: { id },
      relations: { images: true },
    });

    return row;
  }

  async accept(tourId: number) {
    const result = await this.tourRepository.update(tourId, {
      status: TourStatus.ACCEPTED,
    });
    return result;
  }

  async rejectTour(tourId: number, data) {
    console.log('data', data);
  }

  async getLeaderTours(leaderId: number, page: number) {
    const skip = (Number(page) - 1) * 10;
    const owner = new User();
    owner.id = leaderId;
    const [tours, count] = await this.tourRepository.findAndCount({
      where: { owner },
      skip,
      take: 10,
    });
    return { list: tours, total: count };
  }

  async getTourImages(tourId: number) {
    return this.imageRepository.find({
      where: { tour: { id: tourId } as Tour },
    });
  }

  async getLeaderTourById(leaderId: number, tourId: number, query: any = {}) {
    const user = new User();
    user.id = leaderId;
    const queryObject: FindOneOptions<Tour> = {
      where: { id: tourId, owner: user },
    };
    if (query.populate === 'images') {
      queryObject.relations = { images: true };
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
}
