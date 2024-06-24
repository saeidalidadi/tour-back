// import { Page } from './tour.entity';
import { Tour } from './tour.entity';
import { User } from './user.entity';
import { ImageEntity } from './images.entity';
import { Leader } from './leaders.entity';
import { TagEntity } from './tags.entity';
import { LeadersRate } from './leader-rates';
import { TourReservationEntity } from './tour-reservations.entity';
import { TourAttendeesEntity } from './tour-attendees';
import { VerificationEntity } from './verification.entity';
export {
  Tour,
  ImageEntity,
  User,
  Leader,
  TagEntity,
  LeadersRate,
  TourReservationEntity,
  TourAttendeesEntity,
  VerificationEntity,
};

export default [
  User,
  Tour,
  ImageEntity,
  Leader,
  TagEntity,
  LeadersRate,
  TourReservationEntity,
  TourAttendeesEntity,
  VerificationEntity,
];
