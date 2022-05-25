import { ButtonHTMLAttributes, ReactNode } from 'react'

import styles from './styles.module.scss'

type ButtonProps = {
  variant: 'primary' | 'info' | 'success' | 'danger';
  icon: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const VARIANT_COLORS = {
  primary: '#F25D27',
  info: '#115D8C',
  success: '#51B853',
  danger: '#DE3838',
}

export const IconButton = ({ 
  variant,
  icon,
  type = 'button',
  ...rest 
}: ButtonProps) => {
  return (
    <button 
      className={styles.container} 
      style={{ backgroundColor: VARIANT_COLORS[variant] }}
      type={type} 
      {...rest}
    >
      {icon}
    </button>
  )
}