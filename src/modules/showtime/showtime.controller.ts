import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ShowtimeService } from './Showtime.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { SetRoles } from 'src/decorator/role.decorator';
import { RoleType } from '../auth/enums/roleType.enum';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

@Controller('showtimes')
@UseGuards(JwtGuard, RoleGuard)
export class ShowtimeController {
  constructor(private readonly showtimeService: ShowtimeService) {}

  @Post()
  @SetRoles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  create(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimeService.create(createShowtimeDto);
  }

  @Get()
  findAll() {
    return this.showtimeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showtimeService.findOne(id);
  }

  @Patch(':id')
  @SetRoles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ) {
    return this.showtimeService.update(id, updateShowtimeDto);
  }

  @Delete(':id')
  @SetRoles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.showtimeService.remove(id);
  }
}
