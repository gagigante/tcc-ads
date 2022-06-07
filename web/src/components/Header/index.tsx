import { useRouter } from 'next/router';

import { useAuth } from '../../hooks/useAuth';
import { Button } from '../Button'
import { Input } from '../Input'

import styles from './styles.module.scss'
import { IconButton } from '../IconButton';
import { FiLogOut, FiUser } from 'react-icons/fi';

type HeaderProps = {
  hasSearchBar?: boolean;
  onSearch?: (searchTerm: string) => void;
}

export const Header = ({ 
  hasSearchBar = false, 
  onSearch = () => null
}: HeaderProps) => {
  const { user, signOut } = useAuth();
  const { push } = useRouter();
  
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Doa+</h1>

        <div className={styles.controls}>
          {hasSearchBar && <Input 
            label="Pesquisar" 
            name="search" 
            placeholder="Digite algo para pesquisar..." 
            onChange={(e) => onSearch(e.target.value)}
          />}

          {user 
            ? <div className={styles.links}>
                <IconButton 
                  variant="info" 
                  icon={<FiUser color="#FFFFFF" />} 
                  onClick={() => push('profile')}
                />

                <IconButton 
                  variant="danger" 
                  icon={<FiLogOut color="#FFFFFF" />} 
                  onClick={signOut}
                />
              </div>
            : <Button text="Entrar" variant="info" onClick={() => push('/sign-in')} />
          }
        </div>
      </div>
    </div>
  );
}