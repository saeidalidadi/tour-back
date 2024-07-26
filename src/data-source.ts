import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {
  User,
  Leader,
  Tour,
  ImageEntity,
  VerificationEntity,
  LeadersRate,
  TagEntity,
  TourAttendeesEntity,
  TourReservationEntity,
} from './entities';
import config from './config/configuration';

const configObj = config().database;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: configObj.port,
  username: configObj.user,
  password: configObj.password,
  database: configObj.name,
  schema: 'public',
  synchronize: false,
  logging: false,
  entities: [
    User,
    Leader,
    Tour,
    ImageEntity,
    VerificationEntity,
    LeadersRate,
    TagEntity,
    TourAttendeesEntity,
    TourReservationEntity,
  ],
  migrations: ['./build/migrations/*.js'],
  subscribers: [],
  migrationsTableName: 'migrations',
});

// export default AppDataSource;
