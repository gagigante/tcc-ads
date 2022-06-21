import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
import { FiArrowLeft, FiHeart } from 'react-icons/fi';
import { Header } from '../../../components/Header';
import { IconButton } from '../../../components/IconButton';
import { useAuth } from '../../../hooks/useAuth';
import { Project } from '../../../models/Project';
import { api } from '../../../services/api';
import styles from '../../../styles/pages/project.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { InputCurrency } from '../../../components/InputCurrency';

type ProjectProps = {
  project: Project;
}

type UpdateProjectFormData = {
  name: string;
	description: string;
	donation_description: string;
	donation_goal?: number;
}

const updateProjectFormSchema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
  donation_description: yup.string().required(),
  donation_goal: yup.string(),
});

const Project: NextPage<ProjectProps> = ({ project }) => {
  const { push, back } = useRouter();
  const { user } = useAuth();
  const { register, handleSubmit, formState } = useForm<UpdateProjectFormData>({
    resolver: yupResolver(updateProjectFormSchema),
  });

  const [projectData, setProjectData] = useState<Project>(project);
  const [donationValue, setDonationValue] = useState(
    project.donation_value_goal ? String(project.donation_value_goal / 100) : ''
  );

  useEffect(() => {
    if (!user) push('/');
  }, [user, push]);

  async function handleUpdateFile(e: ChangeEvent<HTMLInputElement>, file: 'thumb' | 'banner' ) {
    if (e.target.files) {
      const data = new FormData();

      data.append('file', e.target.files[0]);

      const { data: project } = await api.patch<Project>(`/projects/${projectData.id}/${file}`, data);

      setProjectData(project);
    }
  }

  const handleUpdateProject: SubmitHandler<UpdateProjectFormData> = async ({ donation_goal, ...formData }) => {
    const data = {
      ...formData,
      donation_goal: !!donation_goal ? donation_goal : null,
      donation_value_goal: !!donationValue ? formatCurrencyValue(donationValue) : null,
    }

    console.log({ data });

    try {
      await api.put(`projects/${projectData.id}`, data);

      alert('Projeto atualizado com sucesso');
      back();
    } catch {
      alert('Algo deu errado. Tente novamente!');
    }
  }

  function formatCurrencyValue(value: string) {
    const formattedValue = String(Number(value.replace(',', '.')) * 100);

    return formattedValue;
  }

  const { errors } = formState;

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.content}>
        {projectData && (
          <div className={styles.projectContainer}>
             <div className={styles.cover} style={{ backgroundImage: `url("${projectData.banner_url}")` }}>
              <div>
                <label className={styles.fileInput}>
                  <input type="file" onChange={(e) => handleUpdateFile(e, 'thumb')} />
                  Editar avatar
                </label>

                <label className={styles.fileInput}>
                  <input type="file" onChange={(e) => handleUpdateFile(e, 'banner')} />
                  Editar capa
                </label>
              </div>

              <img src={projectData.thumb_url ?? '/placeholder.jpg'} alt={projectData.name} />
            </div>

            <div className={styles.projectContent}>
              <div className={styles.subHeader}>
                <h1 style={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton 
                    variant="info" 
                    icon={<FiArrowLeft color="#FFFFFF" />} 
                    onClick={back} 
                  />

                  <span style={{ marginLeft: '0.5rem' }}>
                    Editar projeto
                  </span>
                </h1>
              </div>

              <form className={styles.projectForm}  onSubmit={handleSubmit(handleUpdateProject)}>
                <div>
                  <Input
                    label="Nome do projeto" 
                    placeholder="Digite o nome do projeto" 
                    required
                    defaultValue={projectData.name}
                    hasError={!!errors.name}
                    {...register('name')}
                  />
                </div>
          
                <div>
                  <Input 
                    label="Descrição do projeto" 
                    placeholder="Digite a descrição do projeto" 
                    required
                    defaultValue={projectData.description}
                    hasError={!!errors.description}
                    {...register('description')}
                  />
                </div>
            
                <div>
                  <Input 
                    label="Descrição da doação" 
                    placeholder="Digite a descrição da doação do projeto" 
                    required
                    defaultValue={projectData.donation_description}
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
                    onValueChange={(value) => setDonationValue(value ?? '')}
                  />
                </div>
          
                <div>
                  <Input 
                    type="number" 
                    label="Meta de quantidade de doações"
                    defaultValue={projectData.donation_goal ?? undefined}
                    hasError={!!errors.donation_goal}
                    {...register('donation_goal')}
                  />
                </div>      
                
                <Button variant="success" text="Atualizar projeto" type="submit" fullWidth />
              </form>
            </div>
          </div>
        )}
      </div> 
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<ProjectProps> = async (context) => {
  const { id } = context.params as { id: string };

  const { data } = await api.get<Project>(`projects/${id}`);

  return {
    props: {
      project: data,
    },
  };
}

export default Project;