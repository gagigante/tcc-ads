import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { IconButton } from '../../components/IconButton';
import { useAuth } from '../../hooks/useAuth';
import { Donation } from '../../models/Donation';
import { api } from '../../services/api';
import styles from '../../styles/pages/collaborators.module.scss';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { FormattedDonation } from '../profile';

const Donations: NextPage = () => {
  const { back, push } = useRouter();
  const { user } = useAuth();

  const [donations, setDonations] = useState<FormattedDonation[]>([]);

  useEffect(() => {
    if (!user) push('/');
  }, [user, push]);

  useEffect(() => {
    fetchDonations();
  }, []);

  async function fetchDonations() {
    const { data } = await api.get<Donation[]>('/ongs/donations');

    setDonations(data.map(donation => {
      if (donation.value) {
        return {
          ...donation,
          value: formatCurrency(donation.value),
          created_at: formatDate(donation.created_at),
        }
      }

      return {
        ...donation,
        value: '-',
        created_at: formatDate(donation.created_at),
      };
    }));
  }

  async function handleApproveDonation(id: number) {
    await api.patch(`donations/${id}`);

    setDonations(prevState => prevState.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'realizado',
        }
      }

      return item;
    }));
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
              Doações recebidas
            </span>
          </h1>
        </div>

        <div className={styles.collaboratorsList} style={{ maxWidth: 920 }}>
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
                    
                    {donation.status === 'pendente' && (
                      <Button 
                        text="Confirmar" 
                        variant="primary" 
                        onClick={() => handleApproveDonation(donation.id)} 
                      />
                    )}
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

export default Donations;