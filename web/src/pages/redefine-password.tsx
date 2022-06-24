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

type RedefinePasswordFormData = {
  password: string;
  password_confirmation: string;
};

const redefinePasswordFormSchema = yup.object({
  password: yup.string().required(),
  password_confirmation: yup.string().required(),
});

const SignIn: NextPage = () => {
  const { 
    push, 
    query: { token },
  } = useRouter();
  const { user } = useAuth();
  const { register, handleSubmit, formState } = useForm<RedefinePasswordFormData>({
    resolver: yupResolver(redefinePasswordFormSchema),
  });

  useEffect(() => {
    if (user) push('/');
  }, [])
  
  const handleSignIn: SubmitHandler<RedefinePasswordFormData> = async ({ 
    password, 
    password_confirmation 
  }) => {
    try {
      await api.post('password/redefine', {
        token: String(token),
        password,
        password_confirmation
      });

      alert('Senha atualizada com sucesso!');
      push('sign-in');
    } catch {
      alert('Algo deu errado. Tente novamente!');
    }
  }

  const { errors } = formState

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(handleSignIn)}>
        <h1>Redefinir senha</h1>

        <div className={styles.inputContainer}>
          <Input             
            type="password" 
            label="Senha" 
            placeholder="Digite a nova senha"
            hasError={!!errors.password}
            {...register('password')}
          />
        </div>

        <div className={styles.inputContainer}>
          <Input
            type="password"
            label="Confirmação de senha"
            placeholder="Digite a confirmação de senha"
            hasError={!!errors.password_confirmation}
            {...register('password_confirmation')}
          />
        </div>

        <Button 
          text="Atualizar senha"
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

export default SignIn
