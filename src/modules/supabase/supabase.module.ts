import { Module } from '@nestjs/common';
import { SupabaseService } from './Supabase.service';

@Module({
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}
