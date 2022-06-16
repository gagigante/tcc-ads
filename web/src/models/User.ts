export type User = {
  id: number;
  ong_id: number | null;
  name: string,
  cpf: string,
  email: string,
  phone: string,
  birth_date: Date,
  role: 'doador' | 'colaborador' | 'gestor';
  is_active: boolean,
  user_address: UserAddress | null
}

type UserAddress = {
  zip_code: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number: number;
}