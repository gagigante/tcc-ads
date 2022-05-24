import { Button } from '../Button'
import { Input } from '../Input'

import styles from './styles.module.scss'

type HeaderProps = {
  hasSearchBar?: boolean;
  onSearch?: (searchTerm: string) => void;
}

export const Header = ({ 
  hasSearchBar = false, 
  onSearch = () => null 
}: HeaderProps) => {
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

          {/* TODO: Get logged user data */}
          <Button text="Entrar" variant="info" />
        </div>
      </div>
    </div>
  );
}