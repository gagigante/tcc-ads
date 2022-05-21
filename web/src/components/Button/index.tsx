import { ButtonHTMLAttributes } from 'react'

import styles from './styles.module.scss'

type ButtonProps = {
  text: string;
  variant: 'primary' | 'info' | 'success' | 'danger';
  fullWidth?: boolean;
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const VARIANT_COLORS = {
  primary: '#F25D27',
  info: '#115D8C',
  success: '#51B853',
  danger: '#DE3838',
}

export const Button = ({ 
  text, 
  variant,
  fullWidth = false, 
  isLoading = false, 
  type = 'button', 
  ...rest 
}: ButtonProps) => {
  return (
    <button 
      className={`${styles.container} ${fullWidth && styles.fullWidth}`} 
      style={{ backgroundColor: VARIANT_COLORS[variant] }}
      type={type} 
      {...rest}
    >
      {isLoading ? 'Carregando' : text }     
    </button>
  )
}