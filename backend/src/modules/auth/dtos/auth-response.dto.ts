import { Role } from '../../../common/enums/role.enum';

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  usuario: {
    id: string;
    nombre: string;
    email: string;
    rol: Role;
  };
}
