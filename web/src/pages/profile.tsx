import { NextPage } from "next"
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { FiArrowLeft } from "react-icons/fi";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { IconButton } from "../components/IconButton";
import { Input } from "../components/Input";
import { useAuth } from "../hooks/useAuth";
import * as yup from 'yup'
import { FaEye } from 'react-icons/fa';
import { format } from 'date-fns';

import styles from '../styles/pages/profile.module.scss'
import { api } from "../services/api";
import { Donation } from "../models/Donation";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { User } from "../models/User";

const updateProfileFormSchema = yup.object({
  name: yup.string().required(),
  cpf: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
  birth_date: yup.date().required(),
  old_password: yup.string(),
  password: yup.string(),
  password_confirmation: yup.string(),
})

type FormattedDonation = Omit<Donation, 'value' | 'created_at'> & { value: string | null, created_at: string }

type UpdateProfileFormData = {
	name: string;
	cpf: string;
	email: string;
	phone: string;
	birth_date: Date;
	password?: string;
	old_password?: string;
	password_confirmation?: string;
}

const Profile: NextPage = () => {
  const { push, back } = useRouter();
  const { user, updateUser } = useAuth();
  const { register, handleSubmit, formState } = useForm<UpdateProfileFormData>({
    resolver: yupResolver(updateProfileFormSchema),
  });

  const [section, setSection] = useState<'profile' | 'donations'>('profile');
  const [donations, setDonations] = useState<FormattedDonation[]>([]);

  useEffect(() => {
    if (!user) push('/');
  }, [user, push]);

  useEffect(() => {
    fetchDonations();
  }, []);

  async function fetchDonations() {
    const { data } = await api.get<{ donations: Donation[] }>('users/donations');

    const formattedDonations = data.donations.map(donation => {
      if (donation.value) {
        return {
          ...donation,
          value: formatCurrency(donation.value),
          created_at: formatDate(donation.created_at),
        }
      }

      return {
        ...donation,
        value: null,
        created_at: formatDate(donation.created_at),
      };
    });

    setDonations(formattedDonations);
  }

  const handleUpdateProfile: SubmitHandler<UpdateProfileFormData> = async (formData) => {
    const payload = formData;

    if (!payload.old_password) {
      delete payload.old_password;
      delete payload.password;
      delete payload.password_confirmation;
    }
    
    try {
      const { data } = await api.put<User>('users', formData);
      updateUser(data);
    
      alert('Perfil atualizado com sucesso!');
    } catch {
      alert('Houve um erro ao tentar atualizar seu perfil. Tente novamente!');
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
              {section === 'profile' 
                ? 'Seu perfil' 
                : 'Suas doações'
              }
            </span>
          </h1>

          <div>
            <button 
              className={section === 'profile' ? styles.active : undefined} 
              onClick={() => setSection('profile')}
            >Perfil</button>
            
            <button 
              className={section === 'donations' ? styles.active : undefined} 
              onClick={() => setSection('donations')}
            >Doações</button>
          </div>
        </div>
        
        {section === 'profile' && user && (
          <form className={styles.profileForm}  onSubmit={handleSubmit(handleUpdateProfile)}>
            <div>
              <Input 
                label="Nome" 
                placeholder="Digite o seu nome" 
                defaultValue={user.name}
                required
                hasError={!!errors.name}
                {...register('name')}
              />
            </div>
            
            <div>
              <Input 
                label="CPF" 
                placeholder="Digite o seu CPF" 
                defaultValue={user.cpf}
                required
                hasError={!!errors.cpf}
                {...register('cpf')}
              />
            </div>
            
            <div>
              <Input 
                type="email" 
                label="E-mail" 
                placeholder="Digite o seu e-mail" 
                defaultValue={user.email}
                required
                hasError={!!errors.email}
                {...register('email')}
              />
            </div>
            
            <div>
              <Input                
                type="tel" 
                label="Telefone" 
                placeholder="Digite o telefone" 
                defaultValue={user.phone}
                required
                hasError={!!errors.phone}
                {...register('phone')}
              />
            </div>
            
            {/* REVIEW */}
            <div>
              <Input 
                type="date" 
                label="Data de nascimento" 
                defaultValue={format(new Date(user.birth_date), 'yyyy-MM-dd')}
                required 
                hasError={!!errors.birth_date}
                {...register('birth_date')}
              />
            </div>            

            <hr />

            <div>
              <Input 
                type="password" 
                label="Senha antiga"
                placeholder="Digite sua senha antiga"
                hasError={!!errors.old_password}
                {...register('old_password')}
              />
            </div>
            
            <div>
              <Input 
                type="password" 
                label="Nova senha" 
                placeholder="Digite a sua nova senha"
                hasError={!!errors.password}
                {...register('password')}
              />
            </div>
            
            <div>
              <Input 
                type="password" 
                label="Confirmação da nova senha" 
                placeholder="Digite novamente a nova senha"
                hasError={!!errors.password_confirmation}
                {...register('password_confirmation')}
              />
            </div>
            
            <Button variant="success" text="Atualizar perfil" type="submit" fullWidth />
          </form>
        )}

        {section === 'donations' && (
          <div className={styles.donationsList}>
            <table>
              <thead>
                <tr>
                  <td>Nome do projeto</td>
                  <td>Tipo de doação</td>
                  <td>Valor doado</td>
                  <td>Status</td>
                  <td>Data da doação</td>
                  <td></td>
                </tr>
              </thead>

              <tbody>
                {donations.map(donation => (
                  <tr key={donation.id}>
                    <td>{donation.project.name}</td>
                    <td>{donation.type}</td>
                    <td>{donation.value}</td>
                    <td>{donation.status}</td>
                    <td>{donation.created_at}</td>
                    <td>
                      <IconButton 
                        icon={<FaEye color="#ffffff" />} 
                        variant="info"
                        onClick={() => push(`/donations/${donation.id}`)}
                      /> 
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
