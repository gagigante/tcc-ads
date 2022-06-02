import { useEffect, useState } from 'react'
import type { GetServerSideProps, NextPage } from 'next'

import { CardItem } from '../components/CardItem'
import { Header } from '../components/Header'

import styles from '../styles/pages/home.module.scss'
import { api } from '../services/api'

type Data = {
  id: number;
  name: string;
  thumb_url: string;
}

type HomeProps = {
  ongs: Data[];
}

const Home: NextPage<HomeProps> = ({ ongs }) => {
  const [listType, setListType] = useState<'ongs' | 'projects'>('ongs')
  const [data, setData] = useState(ongs)
  const [isLoading, setIsLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  console.log({ data })

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false)
      
      return
    }

    fetchData(listType, searchText)
  }, [listType, searchText])

  async function fetchData(type: 'ongs' | 'projects', search: string) {
    setIsLoading(true)

    if (type === 'ongs') {
      const { data: ongs } = await api.get('ongs', {
        params: {
          ...(search && { search })
        },
      });

      setData(ongs);
      setIsLoading(false)

      return;
    }

    const { data: projects } = await api.get('projects', {
      params: {
        ...(search && { search })
      },
    });

    setData(projects);
    setIsLoading(false)
  }

  return (
    <div className={styles.container}>
      <Header hasSearchBar onSearch={(searchTerm) => setSearchText(searchTerm)} />

      <div className={styles.content}>
        <div className={styles.subHeader}>
          <h1>
            {listType === 'ongs' 
              ? 'Conheça as ONGs cadastradas' 
              : 'Conheça os projetos cadastrados'
            }
          </h1>

          <div>
            <button 
              className={listType === 'ongs' ? styles.active : undefined} 
              onClick={() => setListType('ongs')}
            >ONGs</button>
            
            <button 
              className={listType === 'projects' ? styles.active : undefined} 
              onClick={() => setListType('projects')}
            >Projetos</button>
          </div>
        </div>
        
        <div className={styles.grid}>
          {isLoading 
            ? <h3>Carregando...</h3> 
            : data.map(item => (
              <CardItem 
                key={item.id}
                title={item.name}
                imageUrl={item.thumb_url}
                redirectPath={`/${listType}/${item.id}`}
              />
            ))
          }
        </div>
      </div>     
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const { data } = await api.get<Data[]>('ongs');

  return {
    props: {
      ongs: data,
    }
  }
}

export default Home
