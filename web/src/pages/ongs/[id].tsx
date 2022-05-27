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

type SocialLink = {
  type: 'facebook' | 'instagram' | 'twitter';
  url: string;
}

type Projects = {
  id: number;
  name: string;
  thumb: string;
}

type OngsProps = {
  coverUrl: string;
  title: string;
  description: string;
  contacts: string[];
  whatsAppLink?: string;
  socialLinks: SocialLink[];
  address: string;
  projectsQuantity: number;
  donationsQuantity: number;
  ongDocument: string;
  projects: Projects[];
}

const DATA = [
  {
    id: 1,
    name: 'Nome do projeto',
    thumb: 'https://direcaocultura.com.br/wp-content/uploads/2017/01/ong-460x290.jpg',
  },
  {
    id: 2,
    name: 'Nome do projeto',
    thumb: 'https://direcaocultura.com.br/wp-content/uploads/2017/01/ong-460x290.jpg',
  },
  {
    id: 3,
    name: 'Nome do projeto',
    thumb: 'https://direcaocultura.com.br/wp-content/uploads/2017/01/ong-460x290.jpg',
  },
  {
    id: 4,
    name: 'Nome do projeto',
    thumb: 'https://direcaocultura.com.br/wp-content/uploads/2017/01/ong-460x290.jpg',
  },
  {
    id: 5,
    name: 'Nome do projeto',
    thumb: 'https://direcaocultura.com.br/wp-content/uploads/2017/01/ong-460x290.jpg',
  },
]

const Ongs: NextPage<OngsProps> = ({
  coverUrl,
  title,
  description, 
  contacts,
  whatsAppLink,
  socialLinks,
  address,
  projectsQuantity,
  donationsQuantity,
  ongDocument,
  projects 
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

    fetchProjects()
  }, [searchText])

  // TODO: Fetch data from server
  async function fetchProjects() {
    console.log('fetchProjects')
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 1000);
  }

  return (
    <div className={styles.container}>
      <Header hasSearchBar onSearch={(searchTerm) => setSearchText(searchTerm)} />

      <div className={styles.cover} style={{ backgroundImage: `url("${coverUrl}")` }} />

      <div className={styles.content}>
        <IconButton variant="info" icon={<FiArrowLeft color="#FFFFFF" />} onClick={back} />
        
        <h1 style={{ marginTop: '2rem' }}>{title}</h1>

        <div className={styles.ongData}>
          <div className={styles.info}>
            <p className={styles.text}>{description}</p>

            <div className={styles.block}>
              <h3>Contatos</h3>
              <hr />

              {contacts.map(item => (
                <p key={item}>{item}</p>
              ))}

              {whatsAppLink && (
                <a href={whatsAppLink} target="_blank" rel="noreferrer">
                  <Button text="Entrar em contato por WhatsApp" variant="success" />
                </a>
              )}
              
            </div>

            <div className={styles.block}>
              <h3>Redes sociais</h3>
              <hr />

              <div>
                {socialLinks.map(item => (
                  <IconButton 
                    key={item.url} 
                    variant="info" 
                    icon={getSocialLinkIcon(item.type)}
                    onClick={() => push(item.url)}
                  />
                ))}
              </div>

            </div>

            <p className={styles.text}>{address}</p>
            
            <p className={styles.text}>CPNJ: {ongDocument}</p>
          </div>

          <div className={styles.metadata}>
            <InfoCard icon={<FiHeart />} value={projectsQuantity} label="Projetos" />

            <InfoCard icon={<FiHeart />} value={donationsQuantity} label="Doações recebidas" />
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
                    imageUrl={item.thumb}
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

// TODO: Fetch data from server
export const getServerSideProps: GetServerSideProps<OngsProps> = async () => {
  return {
    props: {
      coverUrl: 'https://direcaocultura.com.br/wp-content/uploads/2017/01/ong-460x290.jpg',
      title: 'Nome da ONG',
      description: `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
        eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        Ut enim ad minim veniam, quis nostrud exercitation ullamco 
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure 
        dolor in reprehenderit
      `,
      contacts: ['(11) 99999-9999', '9999-9999', 'ong@example.com'],
      whatsAppLink: 'http://google.com',
      socialLinks: [
        { type: 'facebook', url: 'http://www.google.com' },
        { type: 'instagram', url: 'http://www.google.com' },
        { type: 'twitter', url: 'http://www.google.com' },
      ],
      address: 'Rua Calixtro Finelli, 51 - Jardim Primavera 12970000',
      projectsQuantity: 99,
      donationsQuantity: 99,
      ongDocument: '03.452.004/0001-07',
      projects: DATA,
    }
  }
}

export default Ongs