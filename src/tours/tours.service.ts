import { Injectable } from '@nestjs/common';
import { CreateTourDto } from './dto/create-tour.dto';
import * as sharp from 'sharp';
import { File } from '@nest-lab/fastify-multer';
import { v4 as uuid4 } from 'uuid';
import { join } from 'path';
import { existsSync, unlink } from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Tour } from '../entities/tour.entity';
import { ImageEntity } from '../entities/images.entity';
import { User } from '../entities';
import { TourStatus } from './enums';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour) private readonly tourRepository: Repository<Tour>,
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
    private dataSource: DataSource,
  ) {}

  async createTour(tour: CreateTourDto, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const tourEntity = this.tourRepository.create();
    tourEntity.tourName = tour.tourName;
    tourEntity.tourDescription = tour.tourDescription;
    tourEntity.startDate = new Date(Number(tour.duration.from) * 1000);
    tourEntity.finishDate = new Date(Number(tour.duration.to) * 1000);
    tourEntity.price = tour.price;
    tourEntity.owner = { id: userId } as User;
    try {
      const result = await queryRunner.manager.save(tourEntity);
      await queryRunner.commitTransaction();

      const t = new Tour();
      t.id = result.id;
      const images = tour.images.map((imageID) => ({
        path: imageID,
        tour: t,
      }));
      const imageRows = this.imageRepository.create(images);
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

  async uploadImage(file: File) {
    const name = uuid4();
    const path = this.imagesPath(name);

    sharp(file.buffer, { failOnError: false })
      //   .resize({ fit: sharp.fit.contain, width: 150 })
      .jpeg({ quality: 100 })
      .toFile(path);
    return {
      success: true,
      imageID: name,
      name: file.originalname,
    };
  }

  async removeImage(imageUUID: string) {
    const path = this.imagesPath(imageUUID);
    console.log('remove image from ', path);
    if (existsSync(path)) {
      unlink(path, (err) => {
        if (err) {
          console.log(err);
        }
        console.log('deleted');
      });
    }
  }

  async listPublic(page: number = 1) {
    const skip = (page - 1) * 5;
    const [tours, count] = await this.tourRepository.findAndCount({
      where: { accepted: true },
      skip,
      take: 5,
    });

    return { list: tours, total: count };
  }

  async list(page: number) {
    const skip = (Number(page) - 1) * 10;
    const [tours, count] = await this.tourRepository.findAndCount({
      skip,
      take: 10,
    });
    return { list: tours, total: count };
  }

  async getTour(id: number) {
    const row = await this.tourRepository.findOne({
      where: { id },
      relations: { images: true },
    });
    console.log('tour', row);
    return row;
  }

  async accept(tourId: number) {
    const result = await this.tourRepository.update(tourId, { accepted: true });
    return result;
  }

  async getLeaderTours(useId: number) {
    const owner = new User();
    owner.id = useId;
    return await this.tourRepository.find({ where: { owner } });
  }

  async getTourImages(tourId: number) {
    return this.imageRepository.find({
      where: { tour: { id: tourId } as Tour },
    });
  }

  async getLeaderTourById(leaderId: number, tourId: number) {
    const user = new User();
    user.id = leaderId;
    return await this.tourRepository.findOne({
      where: { id: tourId, owner: user },
    });
  }

  async setStatus(tourId: number, leaderId: number, status: TourStatus) {
    const result = await this.dataSource
      .createQueryBuilder()
      .update(Tour)
      .set({
        isPublished: status === TourStatus.PUBLISHED ? true : false,
      })
      .where('id = :tourId', { tourId })
      .andWhere('owner_id = :ownerId', { ownerId: leaderId })
      .andWhere('accepted = :accepted', { accepted: true })
      .execute();
    console.log('tour status____', result);
    return result;
  }
}
