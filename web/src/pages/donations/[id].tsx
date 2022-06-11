import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'

import { Header } from '../../components/Header'

import styles from '../../styles/pages/donations.module.scss'

import { api } from '../../services/api'
import { Donation } from '../../models/Donation'
import { useEffect, useState } from 'react'
import { Input } from '../../components/Input'
import { IconButton } from '../../components/IconButton'
import { FiArrowLeft } from 'react-icons/fi'
import { Textarea } from '../../components/Textarea'
import { formatCurrency } from '../../utils/formatCurrency'
import { Button } from '../../components/Button'

type DonationsProps = {
  id: number;
}

const Donations: NextPage<DonationsProps> = ({ id }) => {
  const { back } = useRouter();

  const [donation, setDonation] = useState<Donation>();

  useEffect(() => {
    async function fetchDonation(id: number) {
      const { data } = await api.get<Donation>(`/users/donations/${id}`);

      setDonation(data);
    }
    
    fetchDonation(id);
  }, [])

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
              Visualizar doação
            </span>
          </h1>
        </div>

        {donation && (
          <div className={styles.dataContainer}>
            <div>
              <Input
                name="project"
                label="Nome do projeto" 
                defaultValue={donation.project.name}
                readOnly
              />
            </div>

            <div>
              <Textarea
                name="project_description"
                label="Descrição do projeto" 
                defaultValue={donation.project.description}
                readOnly
              />
            </div>

            <div>
              <Input
                name="donation_type"
                label="Tipo da doação" 
                defaultValue={donation.type}
                readOnly
              />
            </div>

            <div>
              <Input
                name="donation_value"
                label="Valor da doação" 
                defaultValue={donation.value ? formatCurrency(donation.value) : '-'}
                readOnly
              />
            </div>

            <div>
              <Input
                name="donation_description"
                label="Descrição da doação" 
                defaultValue={donation.description ? donation.description : '-'}
                readOnly
              />
            </div>

            <div>
              <Input
                name="donation_status"
                label="Status da doação" 
                defaultValue={donation.status}
                readOnly
              />
            </div>

            {donation.file && (
              <>
                <br />
                
                <a href={donation.file} target="_blank" rel="noreferrer">
                  <Button 
                    variant="info" 
                    text="Anexo de doação" 
                    fullWidth
                  />
                </a>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<DonationsProps> = async (context) => {
  const { id } = context.params as { id: string };

  return {
    props: {
      id: Number(id),
    }
  };
}

export default Donations;