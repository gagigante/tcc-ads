import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { FiArrowLeft, FiHeart } from 'react-icons/fi';
import { Button } from '../../components/Button';
import { CardItem } from '../../components/CardItem';

import { Header } from '../../components/Header';
import { IconButton } from '../../components/IconButton';
import { useAuth } from '../../hooks/useAuth';
import { Ong } from '../../models/Ong';
import { Project } from '../../models/Project';
import { api } from '../../services/api';

import styles from '../../styles/pages/my-ong.module.scss';
import { buildAddress } from '../../utils/buildAddress';
import { getSocialLinkIcon } from '../../utils/getSocialLinkIcon';

const MyOng: NextPage = () => {
  const { push, back } = useRouter();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [ongData, setOngData] = useState<Ong | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!user) push('/');
  }, [user, push]);

  useEffect(() => {
    fetchData(user.ong_id);
  }, []);

  async function fetchData(ongId: number | null) {
    if (!user.ong_id) {
      setIsLoading(false);
      return;
    }

    try {
      const [{ data: ong }, { data: projects }] = await Promise.all([
        api.get<Ong>(`ongs/${ongId}`),
        api.get<Project[]>(`/ongs/${ongId}/projects`),
      ]);

      setOngData(ong);
      setProjects(projects);
    } catch {
      setOngData(null);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateFile(e: ChangeEvent<HTMLInputElement>, file: 'thumb' | 'banner' ) {
    if (e.target.files) {
      const data = new FormData();

      data.append('file', e.target.files[0]);

      const { data: ong } = await api.patch<Ong>(`/ongs/${user.ong_id}/${file}`, data);

      setOngData(ong);
    }
  }

  async function handleRemoveProject(id: number) {
    try {
      await api.delete(`/projects/${id}`);
      
      setProjects(prevState => prevState.filter(item => item.id !== id));
      alert('Projeto removido com sucesso');
    } catch {
      alert('Algo deu errado. Tente novamente!');
    }
  }

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.content}>
        {isLoading && <h3>Carregando...</h3>}

        {!isLoading && !ongData && (
          <div className={styles.empty}>
            <h2>N??o h?? nenhuma ONG associada ao seu usu??rio</h2>

            <Button 
              text="Criar ONG"
              variant="success"
              fullWidth 
              onClick={() => push('my-ong/create')}
            />

            <h3 style={{ marginBottom: '1rem' }}>
              Se voc?? j?? preencheu o formul??rio de cadastro de ONG aguarde que o cadastro seja aprovado para conseguir visualiza-la
            </h3>

            <Button variant="info" text="Voltar" onClick={back}/>
          </div>
        )}

        {!isLoading && ongData && (
          <div className={styles.ongContainer}>
             <div className={styles.cover} style={{ backgroundImage: `url("${ongData.banner_url}")` }}>
              <div>
                <label className={styles.fileInput}>
                  <input type="file" onChange={(e) => handleUpdateFile(e, 'thumb')} />
                  Editar avatar
                </label>

                <label className={styles.fileInput}>
                  <input type="file" onChange={(e) => handleUpdateFile(e, 'banner')} />
                  Editar capa
                </label>
              </div>

              <img src={ongData.thumb_url ?? '/placeholder.jpg'} alt={ongData.name} />
            </div>

            <div className={styles.ongDataContent}>
              <IconButton variant="info" icon={<FiArrowLeft color="#FFFFFF" />} onClick={back} />

              <div className={styles.title}>
                <h1 style={{ marginTop: '2rem' }}>{ongData.name}</h1>

                <div>
                  <Button 
                    text="Editar perfil da ONG" 
                    variant="info"
                    onClick={() => push('/my-ong/edit')}
                  />

                  <Button 
                    text="Doa????es" 
                    variant="info" 
                    onClick={() => push('/my-ong/donations')}
                  />

                  {user && user.role === 'gestor' && (
                    <Button 
                      text="Gerir colaboradores" 
                      variant="info"
                      onClick={() => push('/my-ong/collaborators')}
                    />
                  )}
                </div>
              </div>

              <div className={styles.ongData}>
                <div className={styles.info}>
                  <p className={styles.text}>{ongData.description}</p>

                  <div className={styles.block}>
                    <h3>Contatos</h3>
                    
                    <hr />

                    {ongData.ong_contacts.map(({ contact }) => (
                      <p key={contact}>{contact}</p>
                    ))}

                    {ongData.whatsapp_url && (
                      <a href={ongData.whatsapp_url} target="_blank" rel="noreferrer">
                        <Button text="Entrar em contato por WhatsApp" variant="success" />
                      </a>
                    )}
                  </div>

                  <div className={styles.block}>
                    <h3>Redes sociais</h3>
                    
                    <hr />

                    <div>
                      {ongData.ong_social_links.map(({ social_link_url, social_link_type }) => (
                        <IconButton 
                          key={social_link_type} 
                          variant="info" 
                          icon={getSocialLinkIcon(social_link_type)}
                          onClick={() => push(social_link_url)}
                        />
                      ))}
                    </div>
                  </div>

                  {!!ongData.website_url && <p className={styles.text}>{ongData.website_url}</p>}
            
                  {ongData.ong_address && (
                    <p className={styles.text}>{buildAddress(ongData.ong_address)}</p>
                  )}

                  <p className={styles.text}>CPNJ: {ongData.cnpj}</p>
                </div> 
              </div>

              <div className={styles.projects}>
                <div>
                  <h1 style={{ marginBottom: '0.5rem' }}>Projetos</h1>

                  <Button text="Criar projeto" variant="success" onClick={() => push('my-ong/project/create') }/>
                </div>
                    
                <div className={styles.grid}>
                  {projects.map(item => (
                    <CardItem
                      key={item.id}
                      title={item.name}
                      imageUrl={item.thumb_url}
                      redirectPath={`/my-ong/project/${item.id}`}
                    >
                      <IconButton 
                        variant="danger" 
                        icon={<FaTrash color="#ffffff" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveProject(item.id)
                        }}
                      />
                    </CardItem>
                  ))}
                </div>
              </div> 
            </div>
          </div>
        )}
      </div> 
    </div>
  )
}

export default MyOng;