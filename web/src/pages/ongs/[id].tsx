import { useEffect, useState } from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { FiHeart, FiArrowLeft } from 'react-icons/fi'

import { Button } from '../../components/Button'
import { Header } from '../../components/Header'
import { IconButton } from '../../components/IconButton'
import { InfoCard } from '../../components/InfoCard'
import { CardItem } from '../../components/CardItem'

import styles from '../../styles/pages/ongs.module.scss'

import { getSocialLinkIcon } from '../../utils/getSocialLinkIcon'
import { api } from '../../services/api'
import { Ong } from '../../models/Ong'
import { buildAddress } from '../../utils/buildAddress'

type Project = {
  id: number;
  name: string;
  thumb_url: string | null;
};

type OngsProps = {
  ong: Ong;
  projects: Project[];
  projectsQuantity: number;
}

const Ongs: NextPage<OngsProps> = ({
  ong,
  projects,
  projectsQuantity,
}) => {
  const { back, push } = useRouter();

  const [data, setData] = useState(projects)
  const [isLoading, setIsLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false)
      
      return
    }

    fetchProjects(searchText)
  }, [searchText])

  async function fetchProjects(search: string) {
    setIsLoading(true)

    const { data: projects } = await api.get(`ongs/${ong.id}/projects`, {
      params: {
        ...(search && { search })
      },
    });

    setData(projects);
    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <Header hasSearchBar onSearch={(searchTerm) => setSearchText(searchTerm)} onLoginReturnUrl={`/ongs/${ong.id}`} />

      <div className={styles.cover} style={{ backgroundImage: `url("${ong.banner_url}")` }} />

      <div className={styles.content}>
        <IconButton variant="info" icon={<FiArrowLeft color="#FFFFFF" />} onClick={back} />
        
        <h1 style={{ marginTop: '2rem' }}>{ong.name}</h1>

        <div className={styles.ongData}>
          <div className={styles.info}>
            <p className={styles.text}>{ong.description}</p>

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

            <p className={styles.text}>{buildAddress(ong.ong_address)}</p>

            <p className={styles.text}>CPNJ: {ong.cpnj}</p>
          </div>

          <div className={styles.metadata}>
            <InfoCard icon={<FiHeart />} value={projectsQuantity} label="Projetos" />
          </div>
        </div>

        <div className={styles.projects}>
          <h1>Projetos</h1>

          {isLoading 
            ? <h3>Carregando...</h3> 
            : (
              <div className={styles.grid}>
                {data.map(item => (
                  <CardItem 
                    key={item.id}
                    title={item.name}
                    imageUrl={item.thumb_url}
                    redirectPath={`/projects/${item.id}`}
                  />
                ))}
              </div>
            )
          }
        </div> 
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<OngsProps> = async (context) => {
  const { id } = context.params as { id: string };

  const [
    { data: ong }, 
    { data: projects }, 
    { data: projectsQuantity }
  ] = await Promise.all([
    api.get<Ong>(`ongs/${id}`), 
    api.get<Project[]>(`ongs/${id}/projects`),
    api.get<{ projects: number }>(`ongs/${id}/projects/count`),
  ]);
  
  return {
    props: {
      ong, 
      projects,
      projectsQuantity: projectsQuantity.projects,
    }
  };
}

export default Ongs