import { SetMetadata } from '@nestjs/common';

export const IS_OPTIONAL_KEY = 'isOptional';
export const JWTOptional = () => SetMetadata(IS_OPTIONAL_KEY, true);
