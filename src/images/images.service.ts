import { Injectable } from '@nestjs/common';
import { rejects } from 'assert';
import { existsSync, unlink } from 'fs';
import { join } from 'path';
import * as sharp from 'sharp';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class ImagesService {
  constructor() {}

  private imagesPath(name, format: 'jpg' | 'png' = 'jpg', inner: string = '') {
    const dir = process.cwd();
    const src = `${inner ? inner + '/' : ''}${name}.${format}`;
    const path = join(`${dir}`, `/public/${src}`);
    return [path, src];
  }

  private getFilePath(path: string) {
    const dir = process.cwd();
    const originPath = join(`${dir}`, `/public/${path}`);
    return originPath;
  }

  async uploadImages(files: Array<Express.Multer.File>) {
    const paths = [];
    for (const file of files) {
      const uuid = uuid4();
      let path = [];
      const sh = sharp(file.buffer, { failOnError: false });
      console.log('forma of file', file.mimetype);
      if (file.mimetype == 'image/jpeg') {
        console.log('format for jpg');
        sh.jpeg({ quality: 100 });
        path = this.imagesPath(uuid, 'jpg');
      }
      if (file.mimetype == 'image/png') {
        sh.png({ quality: 100 });
        path = this.imagesPath(uuid, 'png');
      }

      await sh.toFile(path[0]);
      //   .resize({ fit: sharp.fit.contain, width: 150 })
      paths.push(path[1]);
    }

    return paths;
  }

  async uploadImage(file: Express.Multer.File, dir: string, quality = 100) {
    const uuid = uuid4();
    let path = [];
    const sh = sharp(file.buffer, {});
    console.log('forma of file', file.mimetype);
    if (file.mimetype == 'image/jpeg') {
      console.log('format for jpg');
      sh.jpeg({ quality: quality });
      path = this.imagesPath(uuid, 'jpg', dir);
    }
    if (file.mimetype == 'image/png') {
      sh.png({ quality: quality });
      path = this.imagesPath(uuid, 'png', dir);
    }

    sh.toFile(path[0]);
    //   .resize({ fit: sharp.fit.contain, width: 150 })
    return path;
  }

  async removeImage(path) {
    console.log('remove image from ', path);
    const origin = this.getFilePath(path);
    // const leader = await this.use;
    if (existsSync(origin)) {
      return new Promise((resolve, reject) => {
        unlink(origin, (err) => {
          if (err) {
            reject(false);
          }
          resolve(true);
        });
      });
    }
  }
}
