import { Injectable, UnauthorizedException } from '@nestjs/common';
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
import { UserService } from '../user/user.service';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour) private readonly tourRepository: Repository<Tour>,
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
    private dataSource: DataSource,
    private readonly userService: UserService,
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

  async list() {
    return await this.tourRepository.find();
  }

  async getTour(id: number) {
    const row = await this.tourRepository.findOne({
      where: { id },
      relations: { images: true },
    });
    console.log('tour', row);
    return row;
  }
}
