import { forwardRef, ForwardRefRenderFunction, InputHTMLAttributes } from 'react'

import styles from './styles.module.scss'

type InputProps = {
  label: string;
  name: string;
  hasError?: boolean
} & InputHTMLAttributes<HTMLTextAreaElement>;

const TextareaBase: ForwardRefRenderFunction<HTMLTextAreaElement, InputProps> = ({ 
  name,
  label,
  hasError = false,
  type = 'text',
  ...rest 
}, ref) => {
  return (
    <div className={`${styles.container} ${hasError && styles.hasError}`}>
      <label htmlFor={name}>{label}</label>
      <textarea id={name} name={name} ref={ref} {...rest} />
    </div>
  )
}

export const Textarea = forwardRef(TextareaBase)