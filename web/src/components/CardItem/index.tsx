import Link from 'next/link'
import { ReactNode } from 'react';

import styles from './styles.module.scss'

type CardItemProps = {
  title: string;
  imageUrl: string | null;
  redirectPath: string;
  children?: ReactNode;
}

export const CardItem = ({ title, imageUrl, redirectPath, children }: CardItemProps) => {
  return (
    <div className={styles.container}>
      <Link href={redirectPath}>
        <a style={{ textDecoration: 'none' }}>
          <img src={imageUrl ?? '/placeholder.jpg'} alt={title} />

          <strong>{title}</strong>
        </a>
      </Link>

      <div style={{ marginTop: '1rem', marginLeft: '1rem', marginBottom: '1rem' }}>
        {children}
      </div>
    </div>
  );
}