import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { IconButton } from '../../components/IconButton';
import { Input } from '../../components/Input';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../models/User';
import { api } from '../../services/api';
import styles from '../../styles/pages/collaborators.module.scss';

const Collaborators: NextPage = () => {
  const { back, push } = useRouter();
  const { user } = useAuth();

  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    fetchCollaborators();
  }, []);

  useEffect(() => {
    if (!user) push('/');
  }, [user, push]);

  async function fetchCollaborators() {
    const { data } = await api.get<User[]>('/ongs/collaborators');

    setCollaborators(data);
  }

  async function handleRemoveCollaborator(id: number) {
    await api.delete(`/ongs/collaborators/${id}`);

    setCollaborators(prevState => prevState.filter(item => item.id !== id));
  }

  async function handleAddCollaborator() {
    try {
      const { data } = await api.post<User>('ongs/collaborators', {
        email,
        role,
      });
  
      setCollaborators(prevState => ([...prevState, data]));      

      alert('Colaborador criado com sucesso');
    } catch {
      alert('Algo deu errado. Tente novamente!');
    } finally {
      setEmail('');
      setRole('');
    }
  }

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
              Colaboradores da ONG
            </span>
          </h1>
        </div>

        <div className={styles.form}>
          <Input
            type="email"
            name="email"
            label="E-mail"
            placeholder="Digite o e-mail do colaborador"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <Input
            name="role"
            label="Cargo"
            placeholder="Digite o cargo do colaborador"
            value={role}
            onChange={e => setRole(e.target.value)}
            required
          />

          <Button variant="success" text="Adicionar colaborador" onClick={handleAddCollaborator} fullWidth />
        </div>

        <div className={styles.collaboratorsList}>
          <table>
            <thead>
              <tr>
                <td>Nome</td>
                <td>E-mail</td>
                <td>Cargo</td>
                <td></td>
              </tr>
            </thead>

            <tbody>
              {collaborators.map(collaborator => (
                <tr key={collaborator.id}>
                  <td>{collaborator.name}</td>
                  <td>{collaborator.email}</td>
                  <td>{collaborator.role}</td>
                  <td>
                    <IconButton 
                      icon={<FaTrash color="#ffffff" />} 
                      variant="danger"
                      onClick={() => handleRemoveCollaborator(collaborator.id)}
                    /> 
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Collaborators;