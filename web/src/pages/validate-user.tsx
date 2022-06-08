import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { api } from '../services/api';

type ValidateUserProps = {
  status: 'success' | 'fail';
};

const ValidateUser: NextPage<ValidateUserProps> = ({ status }) => {
  const { push } = useRouter();

  useEffect(() => {
    if (status === 'success') {
      alert('Usuário ativado com sucesso');
      push('sign-in');
      return;
    }

    alert('Houve um erro ao tentar ativar sua conta. Certifique-se de que o link de ativação está correto');
  });

  return <div></div>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = ctx.query;

  let status: 'success' | 'fail' | undefined = undefined;

  try {
    const response = await api.patch(`users/activate?token=${token}`);

    if (response) {
      status = 'success';
    }
  } catch {
    status = 'fail';
  }
  
  return {
    props: {
      status,
    }
  }
};

export default ValidateUser;
