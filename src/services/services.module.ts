import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { NearbyFacilitiesService } from './nearby-facilities.service';

@Module({
  providers: [S3Service, NearbyFacilitiesService],
  exports: [S3Service, NearbyFacilitiesService],
})
export class ServicesModule {}