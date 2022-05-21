import { ButtonHTMLAttributes } from 'react'

import styles from './styles.module.scss'

type LinkButtonProps = {
  text: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const LinkButton = ({ text, ...rest }: LinkButtonProps) => {
  return <button className={styles.container} {...rest}>{text}</button>
}