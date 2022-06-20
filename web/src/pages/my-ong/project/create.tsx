import { yupResolver } from '@hookform/resolvers/yup';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FiArrowLeft } from 'react-icons/fi';
import { Header } from '../../../components/Header';
import { IconButton } from '../../../components/IconButton';
import { useAuth } from '../../../hooks/useAuth';
import styles from '../../../styles/pages/create-project.module.scss';
import * as yup from 'yup';
import { Input } from '../../../components/Input';
import { InputCurrency } from '../../../components/InputCurrency';
import { Button } from '../../../components/Button';
import { api } from '../../../services/api';

type CreateProjectFormData = {
  name: string;
	description: string;
	donation_description: string;
	donation_goal?: number;
}

const createProjectFormSchema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
  donation_description: yup.string().required(),
  donation_goal: yup.string(),
});

const CreateDonation: NextPage = () => {
  const { push, back } = useRouter();
  const { user } = useAuth();
  const { register, handleSubmit, formState } = useForm<CreateProjectFormData>({
    resolver: yupResolver(createProjectFormSchema),
  });

  const [donationValue, setDonationValue] = useState<string>();

  useEffect(() => {
    if (!user) push('/');
  }, [user, push]);

  const handleUpdateProfile: SubmitHandler<CreateProjectFormData> = async ({ donation_goal, ...formData }) => {
    const data = {
      ...formData,
      ...(!!donation_goal && { donation_goal: donation_goal }),
      ...(!!donationValue && { donation_value_goal: donationValue }),
    };

    try {
      await api.post('projects', data);

      alert('Projeto criado com sucesso!');
      back();
    } catch {
      alert('Algo deu errado. Tente novamente!');
    }
  }

  function handleUpdateDonationValue(value?: string) {
    if (!value) {
      return;
    }

    setDonationValue(value);
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
              Criar projeto
            </span>
          </h1>
        </div>

        <form className={styles.profileForm}  onSubmit={handleSubmit(handleUpdateProfile)}>
          <div>
            <Input
              label="Nome do projeto" 
              placeholder="Digite o nome do projeto" 
              required
              hasError={!!errors.name}
              {...register('name')}
            />
          </div>
          
          <div>
            <Input 
              label="Descrição do projeto" 
              placeholder="Digite a descrição do projeto" 
              required
              hasError={!!errors.description}
              {...register('description')}
            />
          </div>
            
          <div>
            <Input 
              label="Descrição da doação" 
              placeholder="Digite a descrição da doação do projeto" 
              required
              hasError={!!errors.donation_description}
              {...register('donation_description')}
            />
          </div>
            
          <div>
            <InputCurrency
              name="value"
              label="Meta de arrecadação"
              prefix="R$"
              allowNegativeValue={false}
              groupSeparator="."
              decimalSeparator=","
              decimalScale={2}
              value={donationValue}
              onValueChange={handleUpdateDonationValue}
            />
          </div>
          
          <div>
            <Input 
              type="number" 
              label="Meta de quantidade de doações"
              hasError={!!errors.donation_goal}
              {...register('donation_goal')}
            />
          </div>            

          <Button variant="success" text="Criar projeto" type="submit" fullWidth />
        </form>
      </div>
    </div>
  )
}

export default CreateDonation;