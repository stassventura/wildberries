import React from 'react'
import styles from './ErrorPayment.module.scss'


interface Props{
  closePayment: () => void;
}

const ErrorPayment = ({closePayment}: Props) => {
  const generateRandomNumber = (length: number) => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  };

  const randomNumber = generateRandomNumber(25);

  return (
    <div className={styles.errorWrapper}>
      <div className={`${styles.errorIcon}`}></div>
      <div className={`${styles.errorTitle}`}>
        Произошла ошибка платежа
      </div>

      <button className={styles.backtoStore} onClick={()=>closePayment()}>Вернуться в магазин</button>
      <div className={`${styles.orderDetails}`}>
      <p>ID ЗАКАЗА</p>
      <p>{randomNumber}</p>
      <p>© PAY2ME</p>
      </div>
    </div>
  )
}

export default ErrorPayment
