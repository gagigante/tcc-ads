import { ReactElement } from 'react';

import styles from './styles.module.scss'

type InfoCardProps = {
  icon: ReactElement;
  value: number;
  label: string;
}

export const InfoCard = ({ icon, value, label }: InfoCardProps) => {
  return (
    <div className={styles.container}>
      <div>{icon}</div>

      <strong>{value}</strong>
      <p>{label}</p>
    </div>
  )
}