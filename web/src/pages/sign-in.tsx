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

type SignInFormData = {
  email: string;
  password: string;
};

const signInFormSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
})

const SignIn: NextPage = () => {
  const { push } = useRouter();
  const { user, signIn } = useAuth();
  const { register, handleSubmit, formState } = useForm<SignInFormData>({
    resolver: yupResolver(signInFormSchema),
  });

  useEffect(() => {
    if (user) push('/');
  }, [])
  
  const handleSignIn: SubmitHandler<SignInFormData> = async ({ email, password }) => {
    await signIn({
      email,
      password,
    });
  }

  const { errors } = formState

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(handleSignIn)}>
        <h1>Fazer login</h1>

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
            type="password"
            label="Senha"
            placeholder="Digite sua senha"
            hasError={!!errors.password}
            {...register('password')}
          />
        </div>

        <div className={styles.linkButtonContainer}>
          <LinkButton 
            text="Esqueci minha senha" 
            type="button" 
            onClick={() => push('forgot-password')}
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
            text="Criar conta"
            type="button" 
            onClick={() => push('sign-up')}
          />
        </div>
      </form>
    </div>
  )
}

export default SignIn
