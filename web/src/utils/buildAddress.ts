type Address = {
  zip_code: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number: number,
}

export const buildAddress = ({
  state,
  city,
  district,
  street,
  number,
}: Address) => {
  return `${street}, ${number}, ${district} - ${city}-${state}`;
}