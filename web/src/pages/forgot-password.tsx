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

type SignInFormData = {
  email: string;
  password: string;
};

const forgotPasswordFormSchema = yup.object({
  email: yup.string().email().required(),
})

const ForgotPassword: NextPage = () => {
  const { push } = useRouter();
  const { user, signIn } = useAuth();
  const { register, handleSubmit, formState } = useForm<SignInFormData>({
    resolver: yupResolver(forgotPasswordFormSchema),
  });

  useEffect(() => {
    if (user) push('/');
  }, [])
  
  const handleSignIn: SubmitHandler<SignInFormData> = async (data) => {
    try {
      await api.patch('password/forgot', data);

      alert('Um e-mail de redefinição de senha foi enviado para você');
    } catch {
      alert('Ocorreu um erro. Tente novamente');
    }
  }

  const { errors } = formState

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(handleSignIn)}>
        <h1>Solicitar redefinição de senha</h1>

        <div className={styles.inputContainer}>
          <Input             
            type="email" 
            label="E-mail" 
            placeholder="Digite seu e-mail"
            hasError={!!errors.email}
            {...register('email')}
          />
        </div>
      
        <Button 
          text="Entrar"
          type="submit"
          variant="primary"
          fullWidth 
          isLoading={formState.isSubmitting} 
        />

        <div className={styles.createAccountButtonContainer}>
          <LinkButton 
            text="Fazer login"
            type="button" 
            onClick={() => push('sign-in')}
          />
        </div>
      </form>
    </div>
  )
}

export default ForgotPassword
