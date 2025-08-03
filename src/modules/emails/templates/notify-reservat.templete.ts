import { Reservation } from 'src/modules/reservation/entities/reservation.entity';

export const NotifyReservatTemp = (reservat: Reservation) => `
<h1>hi, ${reservat.user.name}:</h1>
<h3>remember you about ${reservat.showtime.movie.title} show time</h3>
<h4>reservat ID: ${reservat.id}</h4>
<p>show time: ${reservat.showtime.movie.showtimes[0].time}</p>
<p>seats: ${reservat.seatCodes}</p>

<img wedth='50%'  src=${reservat.showtime.movie.poster.url} alt="movie poster"/>
`;
