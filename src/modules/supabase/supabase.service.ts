import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { v4 } from 'uuid';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY, // use anon key for public-only use
    );
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  async uploadFile(file: Express.Multer.File) {
    const fileName = `movies-posters/${v4()}__${new Date().toISOString()}`;

    const processedBuffer =
      file.mimetype.split('/')[0] === 'image'
        ? await sharp(file.buffer).resize(1000).webp({ quality: 80 }).toBuffer()
        : file.buffer;

    const { error } = await this.getClient()
      .storage.from('movie-reservation') // your bucket name
      .upload(fileName, processedBuffer, {
        contentType: 'image/webp',
        upsert: false,
      });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    // Get public URL (only works if bucket is public)
    const { data } = this.getClient()
      .storage.from('movie-reservation')
      .getPublicUrl(fileName);

    return {
      name: fileName,
      url: data.publicUrl,
      format: 'image/webp',
    };
  }

  async deleteFile(fileName: string) {
    const { error } = await this.getClient()
      .storage.from('movie-reservation')
      .remove([fileName]);

    if (error) {
      console.error('❌ File deletion failed:', error);
      return false;
    }

    console.log('✅ File deleted from Supabase');
    return true;
  }
}
