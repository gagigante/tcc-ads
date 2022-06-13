import { forwardRef, ForwardRefRenderFunction, InputHTMLAttributes } from 'react';
import CurrencyInput, { CurrencyInputProps } from 'react-currency-input-field';

import styles from './styles.module.scss'

type InputCurrencyProps = {
  label: string;
  name: string;
  hasError?: boolean
} & CurrencyInputProps;

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputCurrencyProps> = ({ 
  name,
  label,
  hasError = false,
  type = 'text',
  ...rest 
}, ref) => {
  return (
    <div className={`${styles.container} ${hasError && styles.hasError}`}>
      <label htmlFor={name}>{label}</label>
      <CurrencyInput ref={ref} {...rest} />
    </div>
  )
}

export const InputCurrency = forwardRef(InputBase)
