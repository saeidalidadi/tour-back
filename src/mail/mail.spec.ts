import { Test, TestingModule } from '@nestjs/testing';
import { Mail } from './mail.service';

describe('Mail', () => {
  let provider: Mail;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Mail],
    }).compile();

    provider = module.get<Mail>(Mail);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
