import { forwardRef, ForwardRefRenderFunction, InputHTMLAttributes } from 'react'

import styles from './styles.module.scss'

type InputProps = {
  label: string;
  name: string;
  hasError?: boolean
} & InputHTMLAttributes<HTMLInputElement>;

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({ 
  name,
  label,
  hasError = false,
  type = 'text',
  ...rest 
}, ref) => {
  return (
    <div className={`${styles.container} ${hasError && styles.hasError}`}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} ref={ref} {...rest} />
    </div>
  )
}

export const Input = forwardRef(InputBase)