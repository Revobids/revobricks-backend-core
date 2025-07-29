import { Module, Global } from '@nestjs/common';
import { FirebaseService } from './firebase.config';

@Global()
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}