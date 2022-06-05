export interface ICreateUserDto {
  ong_id?: number;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birth_date: Date;
  password: string;
  role: 'doador' | 'colaborador' | 'gestor';
  is_active: boolean;
  activation_token?: string;
}