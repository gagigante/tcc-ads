import { yupResolver } from '@hookform/resolvers/yup';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { FiArrowLeft, FiTrash } from 'react-icons/fi';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { IconButton } from '../../components/IconButton';
import { Input } from '../../components/Input';
import { useAuth } from '../../hooks/useAuth';
import { Ong } from '../../models/Ong';
import { api } from '../../services/api';
import styles from '../../styles/pages/create-ong.module.scss';
import * as yup from 'yup'
import { Textarea } from '../../components/Textarea';

type UpdateProfileFormData = {
	name: string;
  description: string;
  cnpj: string;
  website_url?: string;
  whatsapp_url?: string;
  address: {
    zip_code: string;
    state: string;
    city: string;
    district: string;
    street: string;
    number: number;
  };
  ong_contacts: Array<{ value: string }>;
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

const updateProfileFormSchema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
  cnpj: yup.string().required(),
  website_url: yup.string(),
  whatsapp_url: yup.string(),
  address: yup.object({
    zip_code: yup.string().required(),
    state: yup.string().required(),
    city: yup.string().required(),
    district: yup.string().required(),
    street: yup.string().required(),
    number: yup.number().integer(),
  }),
  ong_contacts: yup.array(yup.object({
    value: yup.string().required(),
  })),
  facebook: yup.string(),
  twitter: yup.string(),
  instagram: yup.string(),
});

const Edit: NextPage = () => {
  const { push, back } = useRouter();
  const { user } = useAuth();
  const { register, handleSubmit, formState, control } = useForm<UpdateProfileFormData>({
    resolver: yupResolver(updateProfileFormSchema),    
  });
  const { fields, append, remove } = useFieldArray({
    shouldUnregister: true,
    control,
    name: 'ong_contacts' as never,
  });

  useEffect(() => {
    if (!user) push('/');
  }, [user, push]);

  const [ongData, setOngData] = useState<Ong | null>(null);

  useEffect(() => {
    fetchOng(user.ong_id);
  }, []);

  useEffect(() => {
    if (ongData?.ong_contacts) {
      ongData.ong_contacts.forEach((item, index) => {
        append({ value: item.contact });
      });
    }
  }, [ongData?.ong_contacts, append])

  async function fetchOng(ongId: number | null) {
    if (!user.ong_id) {
      return;
    }

    try {
      const { data } = await api.get<Ong>(`ongs/${ongId}`);

      console.log({ data });
      setOngData(data);
    } catch {
      setOngData(null);
    }
  }

  const handleUpdateProfile: SubmitHandler<UpdateProfileFormData> = async ({
    address,
    ong_contacts,
    facebook,
    instagram,
    twitter,
    ...formData
  }) => {
    if (!ongData) {
      return;
    }

    const ongContacts = ong_contacts.map(item => item.value).filter(item => !!item);
    const ongSocialLinks = [];
    const ongAddress = {
      ...address,
      number: Number(address.number),
    }

    if (facebook) ongSocialLinks.push({ social_link_type: 'facebook', social_link_url: facebook });
    if (instagram) ongSocialLinks.push({ social_link_type: 'instagram', social_link_url: instagram });
    if (twitter) ongSocialLinks.push({ social_link_type: 'twitter', social_link_url: twitter });

    try {
      await api.put<Ong>(`ongs/${ongData.id}`, {
        ...formData,
        ong_contacts: ongContacts,
        social_links: ongSocialLinks,
        address: ongAddress,
      });
    
      alert('Perfil atualizado com sucesso!');
      back();
    } catch {
      alert('Houve um erro ao tentar atualizar o perfil. Tente novamente!');
    }
  }

  const { errors } = formState;

  return (
    <div className={styles.container}>
      <Header />
      
      <div className={styles.content}>
        <div className={styles.subHeader}>
          <h1 style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              variant="info" 
              icon={<FiArrowLeft color="#FFFFFF" />} 
              onClick={back} 
            />

            <span style={{ marginLeft: '0.5rem' }}>
              Editar perfil
            </span>
          </h1>
        </div>

        {ongData && (
          <form className={styles.ongForm}  onSubmit={handleSubmit(handleUpdateProfile)}>
            <p>Dados da ONG</p>

            <div>
              <Input
                label="Nome da Ong" 
                placeholder="Digite o nome da Ong" 
                required
                defaultValue={ongData.name}
                hasError={!!errors.name}
                {...register('name')}
              />
            </div>

            <div>
              <Textarea 
                label="Descri????o da ONG" 
                placeholder="Digite a descri????o da Ong" 
                required
                hasError={!!errors.description}
                defaultValue={ongData.description}
                {...register('description')}
              />
            </div>
  
            <div>
              <Input 
                label="CNPJ" 
                placeholder="Digite o CNPJ da ONG" 
                required
                defaultValue={ongData.cnpj}
                hasError={!!errors.cnpj}
                {...register('cnpj')}
              />
            </div>
  
            <div>
              <Input               
                label="Link de Whatsapp"
                placeholder="Digite o link do Whatsapp da Ong"
                hasError={!!errors.whatsapp_url}
                defaultValue={ongData.whatsapp_url ?? ''}
                {...register('whatsapp_url')}
              />
            </div>            

          <div>
            <Input               
              label="Website"
              placeholder="Digite o link para o site da Ong"
              hasError={!!errors.website_url}
              defaultValue={ongData.website_url ?? ''}
              {...register('website_url')}
            />
          </div> 

          <hr />
          <p>Endere??o</p>

          <div>
            <Input               
              label="Rua"
              placeholder="Digite a rua da ONG"
              hasError={!!errors.address?.street}
              required
              defaultValue={ongData.ong_address?.street}
              {...register('address.street')}
            />
          </div>

          <div>
            <Input
              type="number"          
              label="N??mero"
              placeholder="Digite o n??mero da ONG"
              hasError={!!errors.address?.number}
              defaultValue={ongData.ong_address?.number}
              required
              {...register('address.number')}
            />
          </div>

          <div>
            <Input               
              label="Bairro"
              placeholder="Digite o bairro da ONG"
              hasError={!!errors.address?.district}
              defaultValue={ongData.ong_address?.district}
              required
              {...register('address.district')}
            />
          </div>

          <div>
            <Input
              label="Cidade"
              placeholder="Digite a cidade da ONG"
              hasError={!!errors.address?.city}
              defaultValue={ongData.ong_address?.city}
              required
              {...register('address.city')}
            />
          </div>

          <div>
            <Input
              label="Estado"
              placeholder="Digite o estado da ONG"
              hasError={!!errors.address?.state}
              defaultValue={ongData.ong_address?.state}
              required
              {...register('address.state')}
            />
          </div>

          <div>
            <Input
              label="CEP"
              placeholder="Digite o CEP da ONG"
              hasError={!!errors.address?.zip_code}
              defaultValue={ongData.ong_address?.zip_code}
              required
              {...register('address.zip_code')}
            />
          </div>

          <hr />
          <p>Contatos</p>
          <Button text="add" variant="info" onClick={() => append('')} />

          {fields.map((field, index) => (
            <div key={field.id} style={{ display: 'flex' }}>
              <Input
                label={`${index + 1}?? Contato`}
                placeholder="Digite o contato"
                hasError={!!errors.ong_contacts}
                defaultValue={ongData.ong_contacts[index]?.contact}
                {...register(`ong_contacts.${index}.value` as const)} 
              />

              <IconButton
                variant="danger"
                icon={<FiTrash color="#fff" />}
                onClick={() => remove(index)}
              />
            </div>
          ))}

          <hr />
          <p>Redes sociais</p>

          <div>
            <Input
              label="Facebook"
              placeholder="Digite o link do perfil do Facebook"
              hasError={!!errors.facebook}
              defaultValue={ongData.ong_social_links.find(item => item.social_link_type === 'facebook')?.social_link_url}
              {...register('facebook')}
            />
          </div>

          <div>
            <Input
              label="Instagram"
              placeholder="Digite o link do perfil do Instagram"
              hasError={!!errors.instagram}
              defaultValue={ongData.ong_social_links.find(item => item.social_link_type === 'instagram')?.social_link_url}
              {...register('instagram')}
            />
          </div>

          <div>
            <Input
              label="Twitter"
              placeholder="Digite o link do perfil do Twitter"
              defaultValue={ongData.ong_social_links.find(item => item.social_link_type === 'twitter')?.social_link_url}
              hasError={!!errors.twitter}
              {...register('twitter')}
            />
          </div>   

            <Button variant="success" text="Atualizar perfil da ONG" type="submit" fullWidth />
          </form>
        )}
      </div>
    </div>
  );
}

export default Edit;