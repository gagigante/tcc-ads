import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { FiArrowLeft, FiTrash } from 'react-icons/fi';
import { Header } from '../../components/Header';
import { IconButton } from '../../components/IconButton';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/pages/create-ong.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { api } from '../../services/api';
import { Ong } from '../../models/Ong';

type CreateOngFormData = {
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

const createOngFormSchema = yup.object({
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

const CreateOng: NextPage = () => {
  const { back, push } = useRouter();
  const { user, updateUser } = useAuth();
  const { register, handleSubmit, formState, control } = useForm<CreateOngFormData>({
    resolver: yupResolver(createOngFormSchema),
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: 'ong_contacts' as never,
  });


  useEffect(() => {
    if (!user) push('/');
  }, [user, push]);

  useEffect(() => {
    if (user.ong_id) {
      alert('Você já está associado à uma ONG');
      back();
    }
  }, [user, back]);

  const handleCreateOng: SubmitHandler<CreateOngFormData> = async ({
    ong_contacts,
    facebook,
    instagram,
    twitter,
    ...formData
  }) => {
    const ongContacts = ong_contacts.map(item => item.value).filter(item => !!item);
    const ongSocialLinks = [];

    if (facebook) ongSocialLinks.push({ social_link_type: 'facebook', social_link_url: facebook });
    if (instagram) ongSocialLinks.push({ social_link_type: 'instagram', social_link_url: instagram });
    if (twitter) ongSocialLinks.push({ social_link_type: 'twitter', social_link_url: twitter });

    try {
      const { data: ong } = await api.post<Ong>('ongs', {
        ...formData,
        ong_contacts: ongContacts,
        social_links: ongSocialLinks,
      });

      alert('ONG criada com sucesso. Em breve revisaremos seu cadastro!');
      updateUser({...user, ong_id: ong.id });
      back();
    } catch {
      alert('Algo deu errado. Tente novamente!');
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
              Criar ONG
            </span>
          </h1>          
        </div>

        <form className={styles.ongForm}  onSubmit={handleSubmit(handleCreateOng)}>
          <p>Dados da ONG</p>

          <div>
            <Input
              label="Nome da Ong" 
              placeholder="Digite o nome da Ong" 
              required
              hasError={!!errors.name}
              {...register('name')}
            />
          </div>
          
          <div>
            <Input 
              label="Descrição da ONG" 
              placeholder="Digite a descrição da Ong" 
              required
              hasError={!!errors.description}
              {...register('description')}
            />
          </div>
            
          <div>
            <Input 
              label="CNPJ" 
              placeholder="Digite o CNPJ da ONG" 
              required
              hasError={!!errors.cnpj}
              {...register('cnpj')}
            />
          </div>
            
          <div>
            <Input               
              label="Link de Whatsapp"
              placeholder="Digite o link do Whatsapp da Ong"
              hasError={!!errors.whatsapp_url}
              {...register('whatsapp_url')}
            />
          </div>            

          <div>
            <Input               
              label="Website"
              placeholder="Digite o link para o site da Ong"
              hasError={!!errors.website_url}
              {...register('website_url')}
            />
          </div> 

          <hr />
          <p>Endereço</p>

          <div>
            <Input               
              label="Rua"
              placeholder="Digite a rua da ONG"
              hasError={!!errors.address?.street}
              required
              {...register('address.street')}
            />
          </div>

          <div>
            <Input
              type="number"          
              label="Número"
              placeholder="Digite o número da ONG"
              hasError={!!errors.address?.number}
              required
              {...register('address.number')}
            />
          </div>

          <div>
            <Input               
              label="Bairro"
              placeholder="Digite o bairro da ONG"
              hasError={!!errors.address?.district}
              required
              {...register('address.district')}
            />
          </div>

          <div>
            <Input
              label="Cidade"
              placeholder="Digite a cidade da ONG"
              hasError={!!errors.address?.city}
              required
              {...register('address.city')}
            />
          </div>

          <div>
            <Input
              label="Estado"
              placeholder="Digite o estado da ONG"
              hasError={!!errors.address?.state}
              required
              {...register('address.state')}
            />
          </div>

          <div>
            <Input
              label="CEP"
              placeholder="Digite o CEP da ONG"
              hasError={!!errors.address?.zip_code}
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
                label={`${index + 1}° Contato`}
                placeholder="Digite o contato"
                hasError={!!errors.ong_contacts}
                {...register(`ong_contacts.${index}.value` as any)} 
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
              {...register('facebook')}
            />
          </div>

          <div>
            <Input
              label="Instagram"
              placeholder="Digite o link do perfil do Instagram"
              hasError={!!errors.instagram}
              {...register('instagram')}
            />
          </div>

          <div>
            <Input
              label="Twitter"
              placeholder="Digite o link do perfil do Twitter"
              hasError={!!errors.twitter}
              {...register('twitter')}
            />
          </div>
        
          <Button variant="success" text="Criar ONG" type="submit" fullWidth />
        </form>
      </div>
    </div>
  )
}

export default CreateOng;