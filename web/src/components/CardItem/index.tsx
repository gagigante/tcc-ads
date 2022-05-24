import Link from 'next/link'

import styles from './styles.module.scss'

type CardItemProps = {
  title: string;
  imageUrl: string;
  redirectPath: string;
}

export const CardItem = ({ title, imageUrl, redirectPath }: CardItemProps) => {
  return (
    <Link href={redirectPath}>
      <a style={{ textDecoration: 'none' }}>
        <div className={styles.container}>
          <img src={imageUrl} alt={title} />
          <strong>{title}</strong>
        </div>
      </a>
    </Link>
  );
}