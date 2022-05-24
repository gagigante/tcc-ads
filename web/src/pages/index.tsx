import { useEffect, useState } from 'react'
import type { GetServerSideProps, NextPage } from 'next'

import { CardItem } from '../components/CardItem'
import { Header } from '../components/Header'

import styles from '../styles/pages/home.module.scss'

type Data = {
  id: number;
  name: string;
  thumb: string;
}

type HomeProps = {
  ongs: Data[];
}

const DATA = [
  {
    id: 1,
    name: 'Nome da ONG',
    thumb: 'https://direcaocultura.com.br/wp-content/uploads/2017/01/ong-460x290.jpg',
  },
  {
    id: 2,
    name: 'Nome da ONG',
    thumb: 'https://direcaocultura.com.br/wp-content/uploads/2017/01/ong-460x290.jpg',
  },
  {
    id: 3,
    name: 'Nome da ONG',
    thumb: 'https://direcaocultura.com.br/wp-content/uploads/2017/01/ong-460x290.jpg',
  },
  {
    id: 4,
    name: 'Nome da ONG',
    thumb: 'https://direcaocultura.com.br/wp-content/uploads/2017/01/ong-460x290.jpg',
  },
  {
    id: 5,
    name: 'Nome da ONG',
    thumb: 'https://direcaocultura.com.br/wp-content/uploads/2017/01/ong-460x290.jpg',
  },
]

const Home: NextPage<HomeProps> = ({ ongs }) => {
  const [listType, setListType] = useState<'ongs' | 'projects'>('ongs')
  const [data, setData] = useState(ongs)
  const [isLoading, setIsLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false)
      
      return
    }

    fetchData(listType, searchText)
  }, [listType, searchText])

  // TODO: Fetch data from server
  async function fetchData(type: 'ongs' | 'projects', search: string) {
    console.log('fetchData', { type, search })
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 1000);
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
        
        {isLoading 
          ? <h3>Carregando...</h3> 
          : (
            <div className={styles.grid}>
              {data.map(item => (
                <CardItem 
                  key={item.id}
                  title={item.name}
                  imageUrl={item.thumb}
                  redirectPath={`/${listType}/${item.id}`}
                />
              ))}
            </div>
          )
        }
      </div>     
    </div>
  )
}

// TODO: Fetch data from server
export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  return {
    props: {
      ongs: DATA,
    }
  }
}

export default Home
