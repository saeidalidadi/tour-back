import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../entities/page.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
  ) {}
  async findUserPages(user_id: number) {
    const pages = await this.pageRepository.find({
      where: { user: { id: user_id } },
    });
    return pages;
  }
}
