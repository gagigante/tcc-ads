import { useState } from 'react'

import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import ProgressBar from '@ramonak/react-progress-bar'
import { FiHeart, FiArrowLeft } from 'react-icons/fi'

import { Button } from '../../components/Button'
import { Header } from '../../components/Header'
import { IconButton } from '../../components/IconButton'
import { InfoCard } from '../../components/InfoCard'
import { DonationModal } from '../../components/DonationModal'

import { getSocialLinkIcon } from '../../utils/getSocialLinkIcon'
import { Project as ProjectModel } from '../../models/Project';
import { Ong } from '../../models/Ong';

import styles from '../../styles/pages/projects.module.scss'
import { buildAddress } from '../../utils/buildAddress'
import { api } from '../../services/api'
import { formatCurrency } from '../../utils/formatCurrency'
import { useAuth } from '../../hooks/useAuth'

type ProjectsProps = {
  ong: Ong;
  project: ProjectModel;
  donationsQuantity: number;
  donationsSum: number;
}

const Projects: NextPage<ProjectsProps> = ({
  ong,
  project,
  donationsQuantity,
  donationsSum,
}) => {
  const { back, push } = useRouter();
  const { user } = useAuth();

  const [donations, setDonations] = useState(donationsQuantity);
  const [donationsValue, setDonationsValue] = useState(donationsSum);
  const [isOpen, setIsOpen] = useState(false);

  function handleCloseModalAndUpdateDonationsValue(donationValue?: number) {
    setDonations(prevState => prevState + 1);

    if (donationValue) setDonationsValue(prevState => prevState + donationValue);

    setIsOpen(false);
  }

  return (
    <>
      <div className={styles.container}>
        <Header onLoginReturnUrl={`/projects/${project.id}`} />

        <div className={styles.cover} style={{ backgroundImage: `url("${project.banner_url}")` }} />

        <div className={styles.content}>
          <IconButton variant="info" icon={<FiArrowLeft color="#FFFFFF" />} onClick={back} />
          
          <h1 style={{ marginTop: '2rem' }}>{project.name}</h1>

          <div className={styles.projectData}>
            <div className={styles.info}>
              <p className={styles.text}>{project.description}</p>           

              <div className={styles.block}>
                <h3>Contatos</h3>
                <hr />

                {ong.ong_contacts.map(({ contact }) => (
                  <p key={contact}>{contact}</p>
                ))}

                {ong.whatsapp_url && (
                  <a href={ong.whatsapp_url} target="_blank" rel="noreferrer">
                    <Button text="Entrar em contato por WhatsApp" variant="success" />
                  </a>
                )}         
              </div>

              <div className={styles.block}>
                <h3>Redes sociais</h3>
                <hr />

                <div>
                  {ong.ong_social_links.map(({ social_link_url, social_link_type }) => (
                    <IconButton 
                      key={social_link_type} 
                      variant="info" 
                      icon={getSocialLinkIcon(social_link_type)}
                      onClick={() => push(social_link_url)}
                    />
                  ))}
                </div>

              </div>

              {!!ong.website_url && <p className={styles.text}>{ong.website_url}</p>}
              
              {ong.ong_address && (
                <p className={styles.text}>{buildAddress(ong.ong_address)}</p>
              )}

              <p className={styles.text}>CPNJ: {ong.cnpj}</p>

              <div className={styles.block}>
                <h3>Doações</h3>
                <hr />

                <p>{project.donation_description}</p>
              </div>

              <div className={styles.block}>
                <h3>Metas</h3>
                <hr />
                
                {project.donation_goal && (
                  <div className={styles.donationGoal}>
                    <strong>Meta de doações: {project.donation_goal}</strong>
                    
                    <ProgressBar 
                      completed={(donations/project.donation_goal) * 100} 
                      isLabelVisible={false} 
                    />
                    
                    <p>Doações realizadas: {donations}</p> 
                  </div>
                )}

                {project.donation_value_goal && (
                  <div className={styles.donationGoal}>
                    <strong>Meta de doações: {formatCurrency(project.donation_value_goal)}</strong>                    

                    <ProgressBar 
                      completed={(donationsValue/project.donation_value_goal) * 100} 
                      isLabelVisible={false} 
                    />
                    
                    <p>Doações realizadas: {formatCurrency(donationsValue)}</p> 
                  </div>
                )}
              </div>
              
              <div style={{ marginTop: '2rem' }}>
                <Button 
                  text="Doar" 
                  variant="success" 
                  fullWidth 
                  onClick={() => {
                    if (!user) {
                      push(`/sign-in?return_url=/projects/${project.id}`);
                      return;
                    }

                    setIsOpen(true);
                  }} 
                />
              </div>
            </div>

            <div className={styles.metadata}>
              <InfoCard icon={<FiHeart />} value={donations} label="Doações recebidas" />
            </div>
          </div>
        </div>
      </div>

      <DonationModal
        projectId={project.id}
        description={project.donation_description}
        contacts={ong.ong_contacts.map(item => item.contact)}
        whatsAppLink={ong.whatsapp_url}
        isOpen={isOpen} 
        onClose={handleCloseModalAndUpdateDonationsValue}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<ProjectsProps> = async (context) => {
  const { id } = context.params as { id: string };

  const { data: project } = await api.get<ProjectModel>(`projects/${id}`);

  const [
    { data: ong },
    { data: donationsQuantity },
    { data: donationsSum },
  ] = await Promise.all([
    api.get<Ong>(`ongs/${project.ong_id}`),
    api.get<{ donations: number }>(`projects/${id}/donations/count`),
    api.get<{ donations: number }>(`projects/${id}/donations/sum`),
  ]);

  return {
    props: {
      ong,
      project,
      donationsQuantity: donationsQuantity.donations,
      donationsSum: donationsSum.donations,
    }
  }
}

export default Projects