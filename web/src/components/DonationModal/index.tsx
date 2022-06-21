import { useState } from 'react'
import Modal from 'react-modal'

import { Button } from '../Button';
import { Input } from '../Input';
import { Textarea } from '../Textarea';

import styles from './styles.module.scss'
import { api } from '../../services/api';
import { InputCurrency } from '../InputCurrency';
import { useForm } from 'react-hook-form';

type DonationModalProps = {
  projectId: number;
  description: string;
  contacts: string[];
  whatsAppLink: string | null;
  isOpen: boolean;
  onClose: () => void;
}

type DonationFormData = {
  description?: string;
  file: FileList;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
}

export const DonationModal = ({ 
  projectId, 
  description, 
  contacts, 
  whatsAppLink, 
  isOpen, 
  onClose 
}: DonationModalProps) => {
  const { register, handleSubmit, reset } = useForm<DonationFormData>();

  const [donationType, setDonationType] = useState<'dinheiro' | 'outro'>('dinheiro');
  const [donationValue, setDonationValue] = useState('');

  function handleUpdateDonationValue(value?: string) {
    if (!value) {
      return;
    }

    setDonationValue(value);
  }

  function formatCurrencyValue(value: string) {
    const formattedValue = String(Number(value.replace(',', '.')) * 100);

    return formattedValue;
  }

  async function handleCreateDonation(formData: DonationFormData) {
    const data = new FormData();
    
    data.append('project_id', String(projectId));
    data.append('type', donationType);
    data.append('file', formData.file[0]);

    if (donationValue) data.append('value', formatCurrencyValue(donationValue));
    if (formData.description) data.append('description', formData.description);

    try {
      await api.post('donations', data);

      alert('Doação realizada com sucesso');
    } catch {
      alert('Algo deu errado. Tente novamente!');
    } finally {
      setDonationValue('');
      reset();
      onClose();
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      style={customStyles}
      ariaHideApp={false}
      contentLabel="Donation modal"
      onRequestClose={onClose}
    >
      <div className={styles.container}>
        <h1>Faça sua doação</h1>

        <p>{description}</p>

        <div className={styles.contact}>
          <h3>Entre em contato e tire suas dúvidas</h3>

          {contacts.map(item => (
            <p key={item}>{item}</p>
          ))}

          {whatsAppLink && (
            <a href={whatsAppLink} target="_blank" rel="noreferrer">
              <Button text="Entrar em contato por WhatsApp" variant="success" />
            </a>
          )}
        </div>

        <div className={styles.donation}>
          <h3>Qual o tipo de doação?</h3>
          
          <div className={styles.donationType}>
            <button 
              className={`${donationType === 'dinheiro' && styles.active}`} 
              onClick={() => setDonationType('dinheiro')}
            >Dinheiro</button>

            <button 
              className={`${donationType === 'outro' && styles.active}`} 
              onClick={() => setDonationType('outro')}
            >Outro</button>
          </div>
          
          <form onSubmit={handleSubmit(handleCreateDonation)}>
            {donationType === 'dinheiro' && (
              <InputCurrency
                name="value"
                label="Valor da doação"
                prefix="R$"
                allowNegativeValue={false}
                groupSeparator="."
                decimalSeparator=","
                decimalScale={2}
                value={donationValue}
                onValueChange={handleUpdateDonationValue}
                required
              />
            )}

            <div>
              <Textarea 
                label="Descrição da doação" 
                required 
                {...register('description')}
              />
            </div>
            
            <div>
              <Input 
                type="file" 
                label="Anexo de comprovante" 
                required 
                {...register('file')}
              />
            </div>

            <Button type="submit" text="Confirmar doação" variant="success" fullWidth />

            <p className={styles.obs}>
              OBS: Sua doação será registrada e marcada como pendente. O Status 
              da doação Será atualizado assim que um colaborador autorizado da 
              ONG validar sua doação
            </p>
          </form>
        </div>
      </div>
    </Modal>
  )
}