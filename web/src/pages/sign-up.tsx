import { useEffect } from 'react'
import type { NextPage } from 'next'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { Input } from '../components/Input'
import { Button } from '../components/Button'

import { useRouter } from 'next/router'

import { LinkButton } from '../components/LinkButton'

import styles from '../styles/pages/signIn.module.scss'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'
import { api } from '../services/api'

type SignUpFormData = {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birth_date: Date;
  password: string;
};

const signInFormSchema = yup.object({
  name: yup.string().required(),
  cpf: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
  birth_date: yup.date().required(),
  password: yup.string().required(),
})

const SignUp: NextPage = () => {
  const { push } = useRouter();
  const { user } = useAuth();
  const { register, handleSubmit, formState } = useForm<SignUpFormData>({
    resolver: yupResolver(signInFormSchema),
  });

  useEffect(() => {
    if (user) push('/');
  }, [])
  
  const handleSignUp: SubmitHandler<SignUpFormData> = async (data) => {
    try {
      await api.post('users', data);
    
      alert('Conta criada com sucesso! Ative sua conta pelo e-mail que foi enviado para você');
      push('sign-in');
    } catch {
      alert('Algo deu errado ao criar sua conta. Tente novamente!');
    }
  }

  const { errors } = formState

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(handleSignUp)}>
        <h1>Criar conta</h1>

        <div className={styles.inputContainer}>
          <Input             
            label="Nome" 
            placeholder="Digite seu nome"
            hasError={!!errors.name}
            {...register('name')}
          />
        </div>

        <div className={styles.inputContainer}>
          <Input             
            label="CPF" 
            placeholder="Digite seu CPF"
            hasError={!!errors.cpf}
            {...register('cpf')}
          />
        </div>

        <div className={styles.inputContainer}>
          <Input             
            type="email" 
            label="E-mail" 
            placeholder="Digite seu e-mail"
            hasError={!!errors.email}
            {...register('email')}
          />
        </div>

        <div className={styles.inputContainer}>
          <Input             
            type="tel" 
            label="Telefone" 
            placeholder="Digite seu telefone"
            hasError={!!errors.phone}
            {...register('phone')}
          />
        </div>

        {/* REVIEW: FORMAT DATE TO PT-BR */}
        <div className={styles.inputContainer}>
          <Input             
            type="date" 
            label="Data de nascimento" 
            hasError={!!errors.birth_date}
            {...register('birth_date')}
          />
        </div>

        <div className={styles.inputContainer}>
          <Input
            type="password"
            label="Senha"
            placeholder="Digite sua senha"
            hasError={!!errors.password}
            {...register('password')}
          />
        </div>
      
        <Button 
          text="Criar conta"
          type="submit"
          variant="primary"
          fullWidth 
          isLoading={formState.isSubmitting} 
        />

        <div className={styles.createAccountButtonContainer}>
          <LinkButton 
            text="Ja tenho conta"
            type="button" 
            onClick={() => push('sign-in')}
          />
        </div>
      </form>
    </div>
  )
}

export default SignUp
