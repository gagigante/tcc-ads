import { yupResolver } from '@hookform/resolvers/yup';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FiArrowLeft } from 'react-icons/fi';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { IconButton } from '../../components/IconButton';
import { Input } from '../../components/Input';
import { useAuth } from '../../hooks/useAuth';
import { Ong } from '../../models/Ong';
import { api } from '../../services/api';
import styles from '../../styles/pages/edit-ong.module.scss';
import * as yup from 'yup'
import { Textarea } from '../../components/Textarea';

type UpdateProfileFormData = {
	name: string;
	description: string;
	cnpj: string;
	website_url?: string;
	whatsapp_url?: string;
}

const updateProfileFormSchema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
  cnpj: yup.string().required(),
  website_url: yup.string(),
  whatsapp_url: yup.string(),
});

const Edit: NextPage = () => {
  const { push, back } = useRouter();
  const { user } = useAuth();
  const { register, handleSubmit, formState } = useForm<UpdateProfileFormData>({
    resolver: yupResolver(updateProfileFormSchema),
  });

  useEffect(() => {
    if (!user) push('/');
  }, [user, push]);

  const [isLoading, setIsLoading] = useState(true);
  const [ongData, setOngData] = useState<Ong | null>(null);

  useEffect(() => {
    fetchOng(user.ong_id);
  }, []);

  async function fetchOng(ongId: number | null) {
    if (!user.ong_id) {
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await api.get<Ong>(`ongs/${ongId}`);

      setOngData(data);
    } catch {
      setOngData(null);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpdateProfile: SubmitHandler<UpdateProfileFormData> = async (formData) => {
    if (!ongData) {
      return;
    }

    try {
      await api.put<Ong>(`ongs/${ongData.id}`, formData);
    
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
          <form className={styles.profileForm}  onSubmit={handleSubmit(handleUpdateProfile)}>
            <div>
              <Input 
                label="Nome" 
                placeholder="Digite o nome da ONG" 
                defaultValue={ongData.name}
                required
                hasError={!!errors.name}
                {...register('name')}
              />
            </div>
              
            <div>
              <Textarea 
                label="Descrição" 
                placeholder="Digite a descrição da ONG" 
                defaultValue={ongData.description}
                required
                hasError={!!errors.description}
                {...register('description')}
              />
            </div>
              
            <div>
              <Input 
                label="CNPJ" 
                placeholder="Digite o CNPJ da ONG" 
                defaultValue={ongData.cnpj}
                required
                hasError={!!errors.cnpj}
                {...register('cnpj')}
              />
            </div>
              
            <div>
              <Input                
                label="Website" 
                placeholder="Informe o Website da ONG" 
                defaultValue={ongData.website_url ?? ''}
                hasError={!!errors.website_url}
                {...register('website_url')}
              />
            </div>
              
            <div>
              <Input                
                label="Whatsapp" 
                placeholder="Informe a URL do whatsapp" 
                defaultValue={ongData.whatsapp_url ?? ''}
                hasError={!!errors.whatsapp_url}
                {...register('whatsapp_url')}
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