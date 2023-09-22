import React, {useState, useEffect, useRef} from 'react'
import styles from './Basket.module.scss'
import CountUp from 'react-countup';
import { CartProduct, useCart } from '../Layout';
import SelectAddress from '../SelectAddress';
import PaymentMethod from '../PaymentMethod';
import ConfirmPayment from '../ConfirmPayment';
import axios from 'axios';

interface CardDetails {
  paymentSystem: string;
  cardNumber: string;
  bank: string;
  system: string
}

const Basket = () => {
  const {cart, setCart} = useCart()
  const [initialLoad, setInitialLoad] = useState(true);
  const totalAmount = cart.reduce((acc, item) => acc + item.amount, 0);
  const totalPrice = cart.reduce((acc, item) => acc + parseFloat(item.price.replace(/\s+/g, '')), 0);
  const [deliveryMethod, setDeliveryMethod] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [isChooseDeliveryMethodActive, setIsDeliveryMethodActive] = useState(false)
  const [isPaymentMethodFormActive, setIsPaymentMethodFormActive] = useState(false)
  const [cardDetails, setCardDetails] = useState<CardDetails | undefined>();
  const [isConfirmFormActive, setIsConfirmFormActive] = useState(false)
  const [phone, setPhone] = useState(''); 
  const server = process.env.REACT_APP_SERVER_URL
  const methodPaymentRef = useRef<HTMLDivElement>(null);
  const [isDeliveryMethodEmpty, setIsDeliveryMethodEmpty] = useState(false)
  const [isPaymentMethodEmpty, setIsPaymentMethodEmpty] = useState(false)
  useEffect(() => {
    const storedPhone = localStorage.getItem('phone');
    if (storedPhone) {
        setPhone(storedPhone); // Устанавливаем номер телефона из localStorage
    }
}, []);

useEffect(() => {
  if(isDeliveryMethodEmpty){
    setTimeout(() => {
      setIsDeliveryMethodEmpty(false)
    }, 1500);
  }
  if(isPaymentMethodEmpty){
    setTimeout(() => {
      setIsPaymentMethodEmpty(false)
    }, 1500)
  }
}, [isDeliveryMethodEmpty, isPaymentMethodEmpty])


  const formatPrice = (price: string, amount: number) => {
    // Убираем пробелы и преобразуем цену в число
    const numericPrice = parseFloat(price.replace(/\s+/g, ''));
    // Вычисляем новую цену
    const newPrice = numericPrice * amount;
    // Преобразуем обратно в строку с пробелами для форматирования
    return newPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const removeProduct = (productId: string) => {
  setCart(prevCart => prevCart.filter(item => item.id !== productId));
};

const incrementAmount = (productId: string) => {
  setInitialLoad(false);

  setCart(prevCart => {
    return prevCart.map(item => {
      if(item.id === productId) {
        const newPrice = formatPrice(item.basePrice, item.amount + 1);
        const newOldPrice = formatPrice(item.baseOldPrice, item.amount + 1);
        return { ...item, amount: item.amount + 1, price: newPrice, oldPrice: newOldPrice };
      }
      return item;
    });
  });
};

const decrementAmount = (productId: string) => {
  setInitialLoad(false);

  setCart(prevCart => {
    return prevCart.map(item => {
      if(item.id === productId && item.amount > 1) {
        const newPrice = formatPrice(item.basePrice, item.amount - 1);
        const newOldPrice = formatPrice(item.baseOldPrice, item.amount - 1);
        return { ...item, amount: item.amount - 1, price: newPrice, oldPrice: newOldPrice };
      }
      return item;
    });
  });
};

const scrollToPaymentMethod = () => {
  if (methodPaymentRef.current) {
      methodPaymentRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}
const proccessPayment = () =>{
  console.log(1);
  if(deliveryAddress === ''){
    setIsDeliveryMethodEmpty(true)
  }
  
  if(!cardDetails?.cardNumber){
    setIsPaymentMethodEmpty(true)
  }
  if(cardDetails?.cardNumber && cardDetails?.paymentSystem ){
    console.log("Оплата")
    setIsConfirmFormActive(true)
    axios.post(`${server}/api/payment`, {totalPrice: totalPrice.toLocaleString('ru-RU')})
  }
}

  return (
    <>
     
     <div className={`${styles.basketWrapper}`}>
        <div className={`${styles.basketContainer} container`}>
          <div className={`${styles.basket}`}>
            <div className={`${styles.products}`}>
              <div className={`${styles.title}`}>Корзина</div>
              <div className={`${styles.productsList}`}>
                {
                  cart.map((item, index)=>(
                    <div key={index} className={`${styles.productItem}`}>
                     <div className={`${styles.productImage}`}>
                        <img src={item.image} alt="" />
                      </div>
                      <div className={`${styles.productDetails}`}>
                      <div className={`${styles.mobileProductPrice}`}>
                    <h2>
                    <CountUp 
                        key={item.price}
                        start={initialLoad ? parseFloat(item.price.replace(/\s+/g, '')) : parseFloat((item.oldPrice).replace(/\s+/g, ''))}
                        end={parseFloat(item.price.replace(/\s+/g, ''))} 
                        duration={0.4} 
                        separator=" "
                    />
                       ₽</h2>
                       <span className={styles.oldPrice}>
                        <CountUp 
                            key={item.oldPrice}
                            start={initialLoad ? parseFloat(item.oldPrice.replace(/\s+/g, '')) : parseFloat(item.price.replace(/\s+/g, ''))}
                            end={parseFloat(item.oldPrice.replace(/\s+/g, ''))} 
                            duration={0.4} 
                            separator=" "
                        />
                        ₽
                    </span>
                    </div>
                      <p className={styles.name}>
                      {item.name}, {Object.values(item.params)[0].startsWith('+') ? Object.values(item.params)[0].replace('+', ''): Object.values(item.params)[0]}, {item.category}
                      </p>
                      <p>{Object.values(item.params).slice(-1)[0].startsWith('+') ? Object.values(item.params).slice(-1)[0].replace('+', ''): Object.values(item.params).slice(-1)[0]}</p>
                      <p>со склада WB</p>
                      <p className={styles.onlinePayment}><span>Оплата онлайн</span></p>
                    </div>
                    <div className={`${styles.productCount}`}>
                      <button className={`${styles.descProduct} ${item.amount === 1 ? styles.disable: ''}`} onClick={()=>decrementAmount(item.id)}>
                        <span></span>
                      </button>
                      <span className={styles.count}>
                        {item.amount}
                      </span>
                      <button className={`${styles.ascProduct}`} onClick={()=>incrementAmount(item.id)}>
                      <span></span>
                      </button>
                    </div>
                    <div className={`${styles.productPrice}`}>
                    <h2>
                    <CountUp 
                        key={item.price}
                        start={initialLoad ? parseFloat(item.price.replace(/\s+/g, '')) : parseFloat((item.oldPrice).replace(/\s+/g, ''))}
                        end={parseFloat(item.price.replace(/\s+/g, ''))} 
                        duration={0.4} 
                        separator=" "
                    />
                       ₽</h2>
                       <span className={styles.oldPrice}>
                        <CountUp 
                            key={item.oldPrice}
                            start={initialLoad ? parseFloat(item.oldPrice.replace(/\s+/g, '')) : parseFloat(item.price.replace(/\s+/g, ''))}
                            end={parseFloat(item.oldPrice.replace(/\s+/g, ''))} 
                            duration={0.4} 
                            separator=" "
                        />
                        ₽
                    </span>
                    </div>
                    <div className={`${styles.productActions}`}>
                      <span className={styles.saveProduct}></span>
                      <span className={styles.removeProduct} ></span>

                    </div>
                    </div>
                  ))
                }
              </div>
            </div>
            <div className={`${styles.deliveryMethodMobile} ${isDeliveryMethodEmpty ? styles.empty : ''}`}>
              <p className={`${styles.title}`}>
                {deliveryMethod === '' && <>Способ доставки</>}
                {deliveryMethod === 'courier' && <>Доставка курьером</>}
                {deliveryMethod === 'point' && <>Пункт выдачи</>}
                {deliveryMethod !== '' && <img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%3E%3Cpath%20fill%3D%22%23BDBDCB%22%20fillRule%3D%22evenodd%22%20d%3D%22M12.407.258a.89.89%200%200%201%201.253%200l2.08%202.08a.885.885%200%200%201%200%201.253l-1.627%201.626-3.332-3.333L12.407.258ZM0%2012.665l9.83-9.83%203.333%203.333-9.83%209.83H0v-3.333Z%22%20clipRule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E" alt="" />}
              </p>
              <p className={`${styles.par}`}>{deliveryAddress.includes(', кв. Номер') ? deliveryAddress.replace(', кв. Номер', '') : deliveryAddress}</p>
              {deliveryMethod !== '' && <>
              <p className={styles.deliveryCost}>
              {deliveryMethod === 'courier' && <>Курьер позвонит вам в день доставки</>}
              {deliveryMethod === 'point' && <>Бесплатная доставка</>}
              </p>
              </>}
              {deliveryMethod === '' && <>
              <p className={styles.chooseMethod} onClick={()=>setIsDeliveryMethodActive(true)}>Выбрать адрес доставки</p>
              </>}
              {deliveryMethod !== '' && <>
              {cart.map((item, index)=>(
                  <div className={`${styles.details}`} key={index}>
                  <div className={`${styles.deliveryTerm}`}><span>{item.deliveryTerm}</span></div>
                  <div className={`${styles.productImage}`}><img src={item.image} alt="" /> </div>
                  </div>
                 ))}
              </>}
              
            </div>
            <div className={`${styles.deliveryMethod} ${isDeliveryMethodEmpty ? styles.empty : ''}`}>
              <h2>Способ доставки {deliveryMethod !== '' && <img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%3E%3Cpath%20fill%3D%22%23BDBDCB%22%20fillRule%3D%22evenodd%22%20d%3D%22M12.407.258a.89.89%200%200%201%201.253%200l2.08%202.08a.885.885%200%200%201%200%201.253l-1.627%201.626-3.332-3.333L12.407.258ZM0%2012.665l9.83-9.83%203.333%203.333-9.83%209.83H0v-3.333Z%22%20clipRule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E" alt="" />}</h2> 
              {deliveryMethod === '' && <div className={styles.chooseMethod} onClick={()=>setIsDeliveryMethodActive(true)}>Выбрать адрес доставки </div>}
              {deliveryMethod === 'point' && <div className={styles.pickUpPoint}>
                <div className={`${styles.param}`}>
                  <div className={`${styles.key}`}>Пункт выдачи</div>
                  <div className={`${styles.value}`}>{deliveryAddress} </div>
                </div>
                <div className={`${styles.param}`}>
                  <div className={`${styles.key}`}>Стоимость доставки</div>
                  <div className={`${styles.value}`}>Бесплатно </div>
                </div>
                 {cart.map((item, index)=>(
                  <div className={`${styles.param}`} key={index}>
                  <div className={`${styles.key}`}><span>{item.deliveryTerm}</span></div>
                  <div className={`${styles.value}`}><img src={item.image} alt="" /> </div>
                  </div>
                 ))}
                
              </div>}
              {deliveryMethod === 'courier' && <div className={styles.pickUpPoint}>
                <div className={`${styles.param}`}>
                  <div className={`${styles.key}`}>Доставка курьером</div>
                  <div className={`${styles.value}`}>{deliveryAddress.includes(', кв. Номер') ? deliveryAddress.replace(', кв. Номер', '') : deliveryAddress} </div>
                </div>
                <div className={`${styles.param}`}>
                  <div className={`${styles.par}`}>Курьер позвонит вам в день доставки</div>
                </div>
                 {cart.map((item, index)=>(
                  <div className={`${styles.param}`} key={index}>
                  <div className={`${styles.key}`}><span>{item.deliveryTerm}</span></div>
                  <div className={`${styles.value}`}><img src={item.image} alt="" /> </div>
                  </div>
                 ))}
                
              </div>}
            </div>

            <div className={`${styles.wrapper}`}>
              <div className={`${styles.paymentMethod} ${isPaymentMethodEmpty ? styles.empty : ''}`} ref={methodPaymentRef}>
                <h2 className={`${styles.title}`}>Способ оплаты 
                {cardDetails?.cardNumber && cardDetails?.paymentSystem && <img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%3E%3Cpath%20fill%3D%22%23BDBDCB%22%20fillRule%3D%22evenodd%22%20d%3D%22M12.407.258a.89.89%200%200%201%201.253%200l2.08%202.08a.885.885%200%200%201%200%201.253l-1.627%201.626-3.332-3.333L12.407.258ZM0%2012.665l9.83-9.83%203.333%203.333-9.83%209.83H0v-3.333Z%22%20clipRule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E" alt="" />}
                </h2> 
                <p className={styles.subtitle}>
                {deliveryMethod === '' ? <>Выберите адрес доставки — после этого мы покажем все доступные способы оплаты</> : 
                <>
                {
                  cardDetails?.cardNumber && cardDetails?.paymentSystem 
                  ? <span className={styles.cardPreview}> 
                    
                    <img src={cardDetails.paymentSystem} alt="" />
                    <span className={styles.card}>
                      <span></span>
                      <span></span>
                    {cardDetails.cardNumber.slice(12, 16)}
                    </span>
                    
                    </span>
                  : <>
                  <div className={`${styles.choosePayment}`}>
                  <div className={`${styles.title}`} onClick={()=>setIsPaymentMethodFormActive(true)}>Выбрать способ оплаты </div>
                  <div className={`${styles.methodList}`}>
                    <span className={styles.item}><img src="data:image/svg+xml,%3Csvg%20width%3D%2236%22%20height%3D%2212%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M22.914.545c-2.453%200-4.647%201.273-4.647%203.622%200%202.696%203.89%202.883%203.89%204.235%200%20.571-.655%201.08-1.769%201.08-1.584%200-2.768-.713-2.768-.713l-.508%202.374s1.363.602%203.173.602c2.684%200%204.795-1.336%204.795-3.727%200-2.847-3.906-3.027-3.906-4.287%200-.446.536-.937%201.65-.937%201.256%200%202.28.519%202.28.519l.495-2.29c0%20.003-1.114-.478-2.685-.478zM.46.718l-.06.346s1.032.19%201.963.567c1.197.433%201.283.685%201.484%201.467l2.197%208.47h2.945l4.54-10.85H10.59L7.673%208.095l-1.19-6.253C6.375%201.126%205.822.718%205.143.718H.46zm14.251%200l-2.304%2010.847h2.803L17.503.718H14.71zm15.63%200c-.675%200-1.035.363-1.298.993l-4.104%209.854h2.938l.567-1.644h3.581l.346%201.644h2.595L32.702.718H30.34zm.383%202.93l.872%204.073H29.26l1.463-4.073z%22%20fill%3D%22url(%23paint0_linear)%22%2F%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22paint0_linear%22%20x1%3D%22.4%22%20y1%3D%226.144%22%20x2%3D%2234.964%22%20y2%3D%226.144%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%3Cstop%20stop-color%3D%22%2320225F%22%2F%3E%3Cstop%20offset%3D%22.2%22%20stop-color%3D%22%231A1F61%22%2F%3E%3Cstop%20offset%3D%22.41%22%20stop-color%3D%22%23172272%22%2F%3E%3Cstop%20offset%3D%22.595%22%20stop-color%3D%22%23152682%22%2F%3E%3Cstop%20offset%3D%22.802%22%20stop-color%3D%22%2312288E%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%230E2C9A%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3C%2Fsvg%3E" alt="" /></span>
                    <span className={styles.item}><img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2227%22%20height%3D%2220%22%20fill%3D%22none%22%3E%3Cpath%20fill%3D%22%23FF5F00%22%20d%3D%22M16.71%2015.93H9.78V3.481h6.93V15.93Z%22%2F%3E%3Cpath%20fill%3D%22%23EB001B%22%20d%3D%22M10.224%209.682a7.902%207.902%200%200%201%203.021-6.244c-1.36-1.058-3.071-1.712-4.884-1.712A7.887%207.887%200%200%200%20.456%209.63a7.887%207.887%200%200%200%207.905%207.906c1.863%200%203.525-.655%204.884-1.712-1.863-1.36-3.021-3.626-3.021-6.143Z%22%2F%3E%3Cpath%20fill%3D%22%23F79E1B%22%20d%3D%22M26.056%209.682a7.887%207.887%200%200%201-7.906%207.905c-1.863%200-3.524-.654-4.884-1.712%201.863-1.46%203.021-3.676%203.021-6.244%200-2.568-1.158-4.783-3.02-6.243%201.359-1.058%203.07-1.712%204.883-1.712%204.33.1%207.906%203.625%207.906%208.006Z%22%2F%3E%3C%2Fsvg%3E" alt="" /></span>
                    <span className={styles.item}><img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2227%22%20height%3D%2220%22%20fill%3D%22none%22%3E%3Cpath%20fill%3D%22%236C6BBD%22%20d%3D%22M16.96%2015.93h-6.93V3.481h6.93V15.93Z%22%2F%3E%3Cpath%20fill%3D%22%23EB001B%22%20d%3D%22M10.474%209.682a7.902%207.902%200%200%201%203.021-6.244c-1.36-1.058-3.071-1.712-4.884-1.712A7.887%207.887%200%200%200%20.706%209.63a7.887%207.887%200%200%200%207.905%207.906c1.863%200%203.525-.655%204.884-1.712-1.863-1.36-3.021-3.626-3.021-6.143Z%22%2F%3E%3Cpath%20fill%3D%22%230099DF%22%20d%3D%22M26.306%209.682a7.887%207.887%200%200%201-7.906%207.905c-1.863%200-3.524-.654-4.884-1.712%201.863-1.46%203.021-3.676%203.021-6.244%200-2.568-1.158-4.783-3.02-6.243%201.359-1.058%203.07-1.712%204.883-1.712%204.33.1%207.906%203.625%207.906%208.006Z%22%2F%3E%3C%2Fsvg%3E" alt="" /></span>
                    <span className={styles.item}><img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2242%22%20height%3D%2212%22%20fill%3D%22none%22%20viewBox%3D%220%200%2026%207%22%3E%3Cg%20fillRule%3D%22evenodd%22%20clip-path%3D%22url(%23a)%22%20clipRule%3D%22evenodd%22%3E%3Cpath%20fill%3D%22%230F754E%22%20d%3D%22M2.373.001c.23-.001.911-.063%201.2.912.194.656.504%201.73.93%203.225h.172c.456-1.575.77-2.65.94-3.225C5.906-.072%206.635%200%206.927%200h2.25v7H6.884V2.876H6.73L5.451%207.001H3.726L2.447%202.873h-.153V7H0v-7h2.373Zm10.098%200V4.13h.183L14.209.735c.302-.676.945-.734.945-.734h2.22v7h-2.342V2.873h-.183l-1.524%203.395c-.302.672-.976.733-.976.733h-2.22v-7h2.342Zm12.996%203.327c-.327.925-1.352%201.588-2.488%201.588h-2.455v2.085h-2.227V3.328h7.17Z%22%2F%3E%3Cpath%20fill%3D%22%23fff%22%20d%3D%22M23.087.001H18.18c.116%201.558%201.459%202.893%202.848%202.893h4.593C25.887%201.598%2024.975%200%2023.087%200Z%22%2F%3E%3Cpath%20fill%3D%22url(%23b)%22%20d%3D%22M23.087.001H18.18c.116%201.558%201.459%202.893%202.848%202.893h4.593C25.887%201.598%2024.975%200%2023.087%200Z%22%2F%3E%3C%2Fg%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22b%22%20x1%3D%2218%22%20x2%3D%2226%22%20y1%3D%22-.001%22%20y2%3D%222.499%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%3Cstop%20stop-color%3D%22%2302AEFF%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%231F5CD7%22%2F%3E%3C%2FlinearGradient%3E%3CclipPath%20id%3D%22a%22%3E%3Cpath%20fill%3D%22%23fff%22%20d%3D%22M0%200h26v7H0z%22%2F%3E%3C%2FclipPath%3E%3C%2Fdefs%3E%3C%2Fsvg%3E" alt="" /></span>
                    <span className={styles.item}><img src="data:image/svg+xml,%3Csvg%20width%3D%2222%22%20height%3D%2224%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M2.026%2022.787c0%20.057%200%20.1-.014.171-.014.057-.057.1-.085.157-.029.057-.086.086-.157.114a.673.673%200%200%201-.243.058H.771v-.957h.756c.1.015.2.029.271.072.071.057.129.1.171.17.043.044.057.13.057.215Zm3.597%201.07v-.442c0-.057%200-.086-.015-.1-.014-.014-.028-.029-.085-.029H4.167c-.086%200-.128%200-.185-.014-.058-.014-.086-.057-.115-.1a.496.496%200%200%201-.028-.185v-.585h1.47c.057%200%20.071%200%20.085-.015.015-.014.015-.057.015-.1v-.385c0-.057%200-.085-.015-.1-.014-.014-.028-.028-.085-.028h-1.47v-.386c0-.07%200-.114.028-.17.015-.058.057-.086.1-.1.029-.03.114-.058.2-.058h1.299c.028%200%20.071%200%20.085-.014.015-.014.015-.057.015-.1v-.442c0-.029%200-.072-.015-.086a.154.154%200%200%200-.085-.028h-1.47c-.186%200-.314.028-.443.085a.919.919%200%200%200-.3.2c-.07.1-.113.2-.156.3a1.55%201.55%200%200%200-.057.356v1.727c0%20.114%200%20.214.028.343a.755.755%200%200%200%20.157.3.718.718%200%200%200%20.286.213c.114.057.285.086.47.086h1.513c.057%200%20.072-.014.086-.029.043-.057.043-.085.043-.114Zm5.865-1.812v-.014c.114-.072.2-.172.286-.271.07-.1.114-.243.157-.372l.242-.927c.014-.014.014-.014.014-.029%200-.014-.014-.028-.014-.057-.014%200-.028-.014-.071-.014h-.571c-.014%200-.029%200-.072.014-.014%200-.028.015-.028.057l-.243.885c-.028.1-.071.186-.1.257-.057.057-.1.1-.156.128-.072.029-.115.057-.172.057-.071.015-.114.015-.171.015h-.4v-1.299c0-.057%200-.071-.014-.085H9.42c-.014.014-.014.028-.014.085V23.9c0%20.029%200%20.057.014.072.014%200%20.028.014.071.014h.585c.029%200%20.072-.015.086-.015.014-.014.014-.028.014-.07v-1.542h.428c.114%200%20.214.014.3.028a.789.789%200%200%201%20.2.129c.057.071.1.157.128.271l.3%201.099c.014.028.028.057.057.071.014%200%20.029.014.057.014h.614c.014%200%20.057-.014.057-.014.014-.014.014-.028.014-.057v-.028l-.314-1.2a.475.475%200%200%200-.071-.213c-.014-.057-.057-.114-.086-.171-.028-.058-.085-.086-.157-.129a.495.495%200%200%200-.214-.114Zm2.17.528.185-.642.2-.742h.028l.186.742.185.642h-.785Zm.984.642.2.67c.014.03.028.058.057.072.028%200%20.071.014.1.014h.613c.029%200%20.057-.014.072-.014%200-.014.014-.028.014-.057%200-.028%200-.028-.014-.028l-1.07-3.226a.568.568%200%200%200-.086-.185c-.029-.057-.086-.071-.129-.086-.057-.014-.1-.014-.185-.014h-.3c-.071%200-.128.014-.171.014a.228.228%200%200%200-.129.1c-.014.029-.057.086-.07.171l-1.085%203.226v.07c.014.015.028.03.085.03h.585c.057%200%20.086-.015.1-.03a.384.384%200%200%200%20.057-.07l.2-.657h1.156Zm3.225-1.67a.44.44%200%200%201-.071.257c-.029.072-.086.114-.171.172-.072.028-.172.07-.286.07h-.656v-.984h.656c.1%200%20.186.015.257.057.071.029.114.072.171.114.029.057.057.1.072.172a.421.421%200%200%201%20.028.142Zm-1.184%202.312V22.66h.67c.186%200%20.357-.015.5-.057.128-.058.257-.1.357-.172a.846.846%200%200%200%20.214-.242c.071-.086.114-.172.157-.257.014-.086.057-.172.057-.257.014-.086.014-.157.014-.2%200-.171-.014-.314-.071-.457-.072-.128-.129-.256-.257-.356a.988.988%200%200%200-.371-.243%201.412%201.412%200%200%200-.5-.086h-1.255a.664.664%200%200%200-.2.029.344.344%200%200%200-.086.114c-.014.057-.029.1-.029.171v3.168c0%20.058.015.072.029.086a.153.153%200%200%200%20.086.029h.542c.029%200%20.071%200%20.086-.015.014%200%20.028-.014.028-.028.014.028.029%200%20.029-.029Zm4.866-2.925v-.457c0-.057%200-.085-.014-.1-.015-.014-.057-.014-.086-.014h-2.64c-.029%200-.071%200-.086.014-.014.015-.014.057-.014.1v.457c0%20.028.014.057.029.071%200%20.014.028.029.071.029h.913v2.825c0%20.057%200%20.072.029.086.014.014.028.028.085.028h.543c.057%200%20.085-.014.1-.028.014-.014.028-.029.028-.086v-2.825h.928a.109.109%200%200%200%20.071-.029.078.078%200%200%200%20.043-.071Zm-21.25%203.04h1.3c.185%200%20.342-.03.485-.086a1.18%201.18%200%200%200%20.385-.243%201.043%201.043%200%200%200%20.357-.813v-.214c-.015-.072-.029-.157-.072-.243-.014-.1-.071-.185-.114-.271-.071-.071-.128-.157-.242-.214-.1-.071-.215-.114-.357-.171a2.71%202.71%200%200%200-.528-.057H.77v-.643h1.555c.057%200%20.072-.014.086-.014.014-.014.014-.057.014-.085v-.457c0-.057%200-.071-.014-.086-.014-.014-.029-.028-.086-.028H.328a.66.66%200%200%200-.2.028.191.191%200%200%200-.1.114c-.014.058-.028.114-.028.2v2.94c0%20.086.014.128.029.185.014.058.028.086.085.1.057.015.1.057.186.057Zm6.123-3.254-.029.77a8.665%208.665%200%200%201-.057.7c-.028.314-.071%201.099-.485%201.099a.153.153%200%200%200-.086.028c-.014.014-.014.057-.014.1v.442c0%20.029%200%20.072.014.086a.153.153%200%200%200%20.086.028c.314%200%20.614-.028.856-.4.072-.113.129-.242.186-.384.057-.129.085-.3.114-.486.014-.17.057-.37.071-.585.015-.2.029-.442.057-.699l.015-.371h.999v2.84c0%20.028.014.071.028.071.014.014.029.014.086.014h.642c.014%200%20.014-.014.014-.028.015-.014.015-.029.015-.057v-3.154a.661.661%200%200%200-.029-.2c-.014-.057-.057-.085-.1-.114-.057-.014-.114-.028-.2-.028H6.75a.498.498%200%200%200-.185.028.191.191%200%200%200-.1.114c-.029.029-.029.1-.043.186Z%22%20fill%3D%22%23005A95%22%2F%3E%3Cpath%20d%3D%22M10.603%2015.866c3.411%200%206.194-2.783%206.194-6.194%200-3.41-2.783-6.208-6.194-6.208-3.41%200-6.193%202.797-6.193%206.208%200%203.41%202.782%206.194%206.193%206.194Z%22%20fill%3D%22%23FEFEFE%22%2F%3E%3Cpath%20fillRule%3D%22evenodd%22%20clipRule%3D%22evenodd%22%20d%3D%22M7.75%204.135%2011.844.054c.057-.072.2-.072.285%200l2.683%202.711c.086.086.086.214%200%20.285l-.656.657h-1.684c-.1%200-.186.1-.2.2l-.185%201.898-1.328%201.327c-.085.086-.214.086-.285%200L7.749%204.42c-.071-.085-.085-.2%200-.285l1.199-1.199v-.942c0-.114-.086-.2-.2-.2H4.91c-.114-.014-.2.072-.2.186v4.11l-.685-.67a.175.175%200%200%200-.27%200L1.027%208.116c-.086.085-.086.214%200%20.285l4.081%204.082c.071.085.2.085.271%200l2.726-2.726c.086-.072.086-.2%200-.286L6.75%208.131%204.91%207.96h-.002H8.749c.113%200%20.199-.1.199-.2V5.919L7.749%204.42c-.085-.071-.085-.2%200-.285ZM4.907%207.959a.204.204%200%200%201-.199-.2V6.09v1.67c0%20.1.085.185.199.2Zm7.575-4.252c-.099.003-.195.101-.195.2V7.76c0%20.1.1.2.2.2H14.4l1.455-1.17c.086-.086.214-.086.286%200l1.17%201.17h.956c.114%200%20.2-.1.2-.2V3.907c-.014-.1-.1-.2-.214-.2h-5.77ZM7.079%2015.566h1.684c.114%200%20.2-.086.2-.2v-.001l.242-1.925%201.299-1.285c.071-.085.2-.085.285%200l2.697%202.697c.086.086.086.214%200%20.286L9.42%2019.219c-.086.086-.214.086-.285%200l-2.712-2.711c-.085-.072-.085-.2%200-.286l.657-.656Zm0%200H2.983c-.1%200-.2-.086-.2-.2v-3.839c0-.114.1-.2.2-.2h.942l1.184%201.17c.072.086.186.072.271%200l1.442-1.17h1.94c.115%200%20.2.086.2.2v3.839c-.014.114-.085.2-.2.2H7.08Zm9.46-2.383v-1.656a.198.198%200%200%200-.063-.149.198.198%200%200%200-.15-.065l-1.87-.2-1.313-1.327c-.085-.085-.085-.2%200-.285l2.697-2.697c.086-.086.215-.086.286%200l4.081%204.067c.086.085.086.2%200%20.27l-2.725%202.727c-.072.071-.2.071-.286%200l-.656-.685Zm0%200v4.096c0%20.128-.085.213-.2.2h-3.838a.195.195%200%200%201-.2-.2v-.928l1.199-1.213c.086-.072.071-.2%200-.286l-1.199-1.54v-1.785c0-.114.086-.2.2-.2h3.839a.2.2%200%200%201%20.136.051.2.2%200%200%201%20.05.135v1.655l.014.015Z%22%20fill%3D%22url(%23a)%22%2F%3E%3Cpath%20d%3D%22M16.54%2011.527v1.656l.67.699-.67-2.355Zm-.414-4.723%201.17%201.17h.956l-2.126-1.17Zm-3.64-3.097h1.685l.656-.657-2.34.657Zm-4.766.47%201.228-1.255V1.98L7.72%204.178ZM4.71%207.76V6.09l-.686-.67.685%202.34Zm.413%204.723-1.185-1.17h-.941l2.126%201.17Zm3.639%203.083H7.078l-.656.656%202.34-.656Zm4.71-.414-1.185%201.199v.927l1.184-2.126Z%22%20fill%3D%22%23005887%22%2F%3E%3Cdefs%3E%3CradialGradient%20id%3D%22a%22%20cx%3D%220%22%20cy%3D%220%22%20r%3D%221%22%20gradientUnits%3D%22userSpaceOnUse%22%20gradientTransform%3D%22matrix(9.298%201.02828%20-1.02828%209.298%2011%2010)%22%3E%3Cstop%20offset%3D%22.303%22%20stop-color%3D%22%23A2D9F7%22%2F%3E%3Cstop%20offset%3D%22.638%22%20stop-color%3D%22%2300A0E3%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23005A95%22%2F%3E%3C%2FradialGradient%3E%3C%2Fdefs%3E%3C%2Fsvg%3E" alt="" /></span>
                    <span className={styles.item}><img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2221%22%20height%3D%2220%22%20fill%3D%22none%22%3E%3Cg%20fillRule%3D%22evenodd%22%20clip-path%3D%22url(%23a)%22%20clipRule%3D%22evenodd%22%3E%3Cpath%20fill%3D%22%23263E75%22%20d%3D%22M16.79%208.434c0%202.488-.57%204.343-1.706%205.55-1.137%201.209-2.893%201.813-5.26%201.813-2.213%200-3.891-.604-5.036-1.812-1.145-1.208-1.716-3.03-1.716-5.466V.347A.348.348%200%200%201%203.419%200H7.43a.349.349%200%200%201%20.347.347v8.35c0%20.995.184%201.76.56%202.3a2.028%202.028%200%200%200%203.2.049c.365-.507.548-1.253.546-2.24V7.242h4.706v1.192Z%22%2F%3E%3Cpath%20fill%3D%22%23263E75%22%20d%3D%22M16.426%206.329h-4.341V.364A.364.364%200%200%201%2012.447%200h.65a3.688%203.688%200%200%200%203.691%203.687h.001V6.33h-.364Z%22%2F%3E%3Cpath%20fill%3D%22%23F4821F%22%20d%3D%22M14.023%200h2.404a.365.365%200%200%201%20.363.364v2.405A2.768%202.768%200%200%201%2014.023.003V0Z%22%2F%3E%3Cpath%20fill%3D%22%23263E75%22%20d%3D%22M3.86%2019.765c.531%200%20.787-.295.787-.73V17.99h-.38v1.035a.41.41%200%201%201-.818%200V17.99h-.377v1.049c0%20.429.256.727.787.727h.001Zm3.081-.031v-.327H6.1l.824-1.12v-.298h-1.31v.327h.824l-.825%201.117v.3h1.33Zm1.776.031a.804.804%200%200%200%20.73-.429l-.32-.154a.468.468%200%200%201-.411.254.574.574%200%200%201%200-1.146.473.473%200%200%201%20.41.254l.32-.157a.798.798%200%200%200-.73-.426.903.903%200%201%200%200%201.804Zm3.246-.031-.673-1.744h-.465l-.675%201.744h.423l.11-.296h.749l.107.296h.424Zm-.633-.622h-.545l.272-.751.272.75Zm3.14%201.06-.64-1.102a.5.5%200%200%200%20.382-.518.542.542%200%200%200-.585-.562h-.818v1.744h.372v-.62h.272l.59%201.057h.427Zm-.899-1.384h-.39v-.47h.39a.237.237%200%201%201%200%20.47Zm2.294.946c.547%200%20.926-.345.926-.87%200-.526-.38-.874-.926-.874h-.688v1.744h.688Zm0-.326h-.317v-1.09h.317a.51.51%200%200%201%20.547.546.52.52%200%200%201-.548.543Zm1.377-1.451v.004a.325.325%200%201%201-.325-.324h.325v.32Z%22%2F%3E%3C%2Fg%3E%3Cdefs%3E%3CclipPath%20id%3D%22a%22%3E%3Cpath%20fill%3D%22%23fff%22%20d%3D%22M.214%200h20v20h-20z%22%2F%3E%3C%2FclipPath%3E%3C%2Fdefs%3E%3C%2Fsvg%3E" alt="" /></span>
                    <span className={styles.item}><img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2221%22%20height%3D%2212%22%20fill%3D%22none%22%3E%3Cpath%20fill%3D%22%232E4653%22%20d%3D%22M7.481.02c2.22%200%204.44.008%206.658-.005C14.75.01%2015.36.008%2015.968%200c.052.001.104.005.155.011.248.022.312.22.362.429.542%202.202.34%204.522-.574%206.598a10.775%2010.775%200%200%201-.886%201.568c-.263.394-.552.769-.865%201.123a9.51%209.51%200%200%201-.741.755%206.454%206.454%200%200%201-1.622%201.13%203.627%203.627%200%200%201-1.013.29c-.35.041-.703.055-1.056.04-1.946-.042-3.892-.009-5.837-.018-1.008-.004-2.015%200-3.022%200a.987.987%200%200%201-.309-.04.506.506%200%200%201-.343-.488c-.003-.068-.002-.137-.002-.205V.72c-.003-.1.005-.2.021-.3a.49.49%200%200%201%20.48-.396C.798.018.883.02.967.02h6.513Z%22%2F%3E%3Cpath%20fill%3D%22url(%23a)%22%20d%3D%22M16.912.16c.007.035.021.068.031.103.17.575.282%201.166.334%201.763a10.131%2010.131%200%200%201-1.095%205.41%209.32%209.32%200%200%201-4.398%204.382c-.037.017-.103.01-.091.07.011.058.073.036.113.036%201.289%200%202.577.002%203.866-.003a4.97%204.97%200%200%200%203.888-1.897%201.966%201.966%200%200%200%20.193-1.95c-.008-.019-.018-.037-.04-.037-.02.004-.027.018-.035.032-.123.234-.25.466-.391.69a4.689%204.689%200%200%201-2.44%202.023%203.815%203.815%200%200%201-.978.184l.17-.057a5.652%205.652%200%200%200%201-.44%206.953%206.953%200%200%200%203.132-5.303%203.282%203.282%200%200%200-.74-2.658.5.5%200%200%200-.194-.107.12.12%200%200%200-.017.086c-.006.184-.007.368-.018.552a11.618%2011.618%200%200%201-1.535%205.13%203.945%203.945%200%200%201-.936%201.146.866.866%200%200%201-.312.176c.023-.033.045-.066.07-.098.09-.117.185-.23.269-.353a11.495%2011.495%200%200%200%201.647-3.808c.308-1.059.394-2.17.252-3.264a2.644%202.644%200%200%200-.76-1.607%201.588%201.588%200%200%200-.89-.347c-.09%200-.115.038-.095.145Z%22%2F%3E%3Cpath%20fill%3D%22url(%23b)%22%20d%3D%22M4.632%204.672c-.009.011-.028.03-.022.046.005.017.04.013.056.02a.067.067%200%200%201%20.034.066l-.002.752-1.102-.007a2.232%202.232%200%200%201%20.066-.742.548.548%200%200%200%20.043-.157.033.033%200%200%200-.006-.018c-.01-.013-.029-.01-.044-.007a.622.622%200%200%200-.39.31%201.57%201.57%200%200%200-.153.612c-.027.41.053.82.23%201.19a.96.96%200%200%200%20.422.427c.049.017.062.006.066%200%20.02-.025-.022-.067-.034-.086a.769.769%200%200%201-.059-.11%201.215%201.215%200%200%201-.074-.246%203.44%203.44%200%200%201-.078-.776h1.113v.982a.17.17%200%200%200%20.087.158.682.682%200%200%200%20.33.03.225.225%200%200%200%20.111-.05.21.21%200%200%200%20.05-.17c0-.493.005-.986.004-1.48%200-.122%200-.244-.002-.367a.487.487%200%200%200-.2-.426.39.39%200%200%200-.208-.063.3.3%200%200%200-.238.112Z%22%2F%3E%3Cpath%20fill%3D%22url(%23c)%22%20d%3D%22M2.896%205.27a.887.887%200%200%200-.165.581%201.79%201.79%200%200%200%20.196.888%201.457%201.457%200%200%200%20.488.54.84.84%200%200%201-.427-.256%201.593%201.593%200%200%201-.125-.186%201.635%201.635%200%200%201-.206-.485c-.013-.058-.021-.117-.044-.12-.033-.002-.07.115-.078.14a.671.671%200%200%200-.033.198.955.955%200%200%200%20.399.665c.198.125.428.193.662.194a.355.355%200%200%200%20.194-.055c.037-.027.061-.067-.004-.087-.45-.13-.625-.607-.72-1.02a2.74%202.74%200%200%201-.053-.27%201.94%201.94%200%200%201%20.055-.85c-.068.016-.1.075-.14.123Z%22%2F%3E%3Cpath%20fill%3D%22url(%23d)%22%20d%3D%22m10.831%204.566-.06.002H10.629c-.035%200-.07%200-.106.002a.183.183%200%200%200-.13.055.756.756%200%200%200-.129.238l-.02.053c-.022.045-.315.681-.426.866-.008.013-.026.043-.049.042-.022%200-.04-.029-.049-.042a15.68%2015.68%200%200%201-.425-.866l-.021-.053a.754.754%200%200%200-.13-.238.183.183%200%200%200-.129-.055c-.035-.002-.07-.001-.106-.001h-.057l-.084-.001-.061-.002a.15.15%200%200%200-.081.025.198.198%200%200%200-.073.09%201.079%201.079%200%200%200-.038.31L8.45%206.956c.001.014.004.029.009.042a.267.267%200%200%200%20.249.145.272.272%200%200%200%20.248-.13.201.201%200%200%200%20.011-.037c.028-.134.044-1.208.05-1.676.257.526.457.918.55%201.091.026.06.073.107.133.132a.225.225%200%200%200%20.138%200%20.254.254%200%200%200%20.133-.132c.093-.173.294-.565.55-1.09.006.467.022%201.541.05%201.675a.204.204%200%200%200%20.012.036.272.272%200%200%200%20.247.13.267.267%200%200%200%20.25-.144.157.157%200%200%200%20.008-.042l-.064-1.965a1.074%201.074%200%200%200-.038-.31.198.198%200%200%200-.073-.09.15.15%200%200%200-.08-.025h-.002Z%22%2F%3E%3Cpath%20fill%3D%22url(%23e)%22%20d%3D%22M7.453%204.64a.208.208%200%200%200-.05.118L7.4%206.208a.514.514%200%200%201-.192.411.58.58%200%200%201-.28.11l-.034.001h-.025l-.032-.002a.58.58%200%200%201-.281-.109.517.517%200%200%201-.192-.411l-.005-1.45a.208.208%200%200%200-.05-.118.313.313%200%200%200-.254-.068.285.285%200%200%200-.232.072.2.2%200%200%200-.035.147v1.517a.837.837%200%200%200%20.176.506c.114.142.264.25.434.313a1.279%201.279%200%200%200%20.484.074%201.343%201.343%200%200%200%20.483-.074c.17-.063.321-.171.435-.313a.837.837%200%200%200%20.176-.506V4.791a.2.2%200%200%200-.035-.147.285.285%200%200%200-.232-.072H7.66a.266.266%200%200%200-.208.068Z%22%2F%3E%3Cpath%20fill%3D%22url(%23f)%22%20d%3D%22M11.926%204.763a1.196%201.196%200%200%200-.427.611%201.413%201.413%200%200%200%20.86%201.79c.12.03.245.045.37.041.126.004.25-.01.372-.042a1.413%201.413%200%200%200%20.859-1.789%201.196%201.196%200%200%200-.427-.61%201.398%201.398%200%200%200-.803-.272c-.29.005-.571.1-.804.271Zm.133%201.392a1.31%201.31%200%200%201%20.116-.98.664.664%200%200%201%20.554-.315.665.665%200%200%201%20.555.316c.165.299.207.65.116.98-.078.33-.298.686-.67.69-.373-.004-.593-.36-.671-.69Z%22%2F%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22a%22%20x1%3D%2210.75%22%20x2%3D%2220.428%22%20y1%3D%227.778%22%20y2%3D%224.807%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%3Cstop%20stop-color%3D%22%239C8937%22%2F%3E%3Cstop%20offset%3D%22.329%22%20stop-color%3D%22%239C8937%22%2F%3E%3Cstop%20offset%3D%22.33%22%20stop-color%3D%22%239C8937%22%2F%3E%3Cstop%20offset%3D%22.561%22%20stop-color%3D%22%23F7E59E%22%2F%3E%3Cstop%20offset%3D%22.627%22%20stop-color%3D%22%23F7E59E%22%2F%3E%3Cstop%20offset%3D%22.788%22%20stop-color%3D%22%23B39F4D%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23B39F4D%22%2F%3E%3C%2FlinearGradient%3E%3ClinearGradient%20id%3D%22b%22%20x1%3D%224.748%22%20x2%3D%222.966%22%20y1%3D%226.162%22%20y2%3D%224.813%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%3Cstop%20stop-color%3D%22%239C8937%22%2F%3E%3Cstop%20offset%3D%22.329%22%20stop-color%3D%22%239C8937%22%2F%3E%3Cstop%20offset%3D%22.33%22%20stop-color%3D%22%239C8937%22%2F%3E%3Cstop%20offset%3D%22.561%22%20stop-color%3D%22%23F7E59E%22%2F%3E%3Cstop%20offset%3D%22.627%22%20stop-color%3D%22%23F7E59E%22%2F%3E%3Cstop%20offset%3D%22.788%22%20stop-color%3D%22%23B39F4D%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23B39F4D%22%2F%3E%3C%2FlinearGradient%3E%3ClinearGradient%20id%3D%22c%22%20x1%3D%224.082%22%20x2%3D%222.3%22%20y1%3D%227.042%22%20y2%3D%225.693%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%3Cstop%20stop-color%3D%22%239C8937%22%2F%3E%3Cstop%20offset%3D%22.329%22%20stop-color%3D%22%239C8937%22%2F%3E%3Cstop%20offset%3D%22.33%22%20stop-color%3D%22%239C8937%22%2F%3E%3Cstop%20offset%3D%22.561%22%20stop-color%3D%22%23F7E59E%22%2F%3E%3Cstop%20offset%3D%22.627%22%20stop-color%3D%22%23F7E59E%22%2F%3E%3Cstop%20offset%3D%22.788%22%20stop-color%3D%22%23B39F4D%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23B39F4D%22%2F%3E%3C%2FlinearGradient%3E%3ClinearGradient%20id%3D%22d%22%20x1%3D%2211.337%22%20x2%3D%228.567%22%20y1%3D%226.708%22%20y2%3D%225.239%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%3Cstop%20stop-color%3D%22%239C8937%22%2F%3E%3Cstop%20offset%3D%22.329%22%20stop-color%3D%22%239C8937%22%2F%3E%3Cstop%20offset%3D%22.33%22%20stop-color%3D%22%239C8937%22%2F%3E%3Cstop%20offset%3D%22.561%22%20stop-color%3D%22%23F7E59E%22%2F%3E%3Cstop%20offset%3D%22.627%22%20stop-color%3D%22%23F7E59E%22%2F%3E%3Cstop%20offset%3D%22.788%22%20stop-color%3D%22%23B39F4D%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23B39F4D%22%2F%3E%3C%2FlinearGradient%3E%3ClinearGradient%20id%3D%22e%22%20x1%3D%228.235%22%20x2%3D%225.465%22%20y1%3D%226.571%22%20y2%3D%224.837%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%3Cstop%20stop-color%3D%22%239C8937%22%2F%3E%3Cstop%20offset%3D%22.329%22%20stop-color%3D%22%239C8937%22%2F%3E%3Cstop%20offset%3D%22.33%22%20stop-color%3D%22%239C8937%22%2F%3E%3Cstop%20offset%3D%22.561%22%20stop-color%3D%22%23F7E59E%22%2F%3E%3Cstop%20offset%3D%22.627%22%20stop-color%3D%22%23F7E59E%22%2F%3E%3Cstop%20offset%3D%22.788%22%20stop-color%3D%22%23B39F4D%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23B39F4D%22%2F%3E%3C%2FlinearGradient%3E%3ClinearGradient%20id%3D%22f%22%20x1%3D%2214.684%22%20x2%3D%2211.241%22%20y1%3D%227.004%22%20y2%3D%225.005%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%3Cstop%20stop-color%3D%22%239C8937%22%2F%3E%3Cstop%20offset%3D%22.329%22%20stop-color%3D%22%239C8937%22%2F%3E%3Cstop%20offset%3D%22.33%22%20stop-color%3D%22%239C8937%22%2F%3E%3Cstop%20offset%3D%22.561%22%20stop-color%3D%22%23F7E59E%22%2F%3E%3Cstop%20offset%3D%22.627%22%20stop-color%3D%22%23F7E59E%22%2F%3E%3Cstop%20offset%3D%22.788%22%20stop-color%3D%22%23B39F4D%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23B39F4D%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3C%2Fsvg%3E" alt="" /></span>
                    <span className={styles.item}><img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2221%22%20height%3D%2220%22%20fill%3D%22none%22%3E%3Cpath%20fill%3D%22%23345A9B%22%20fillRule%3D%22evenodd%22%20d%3D%22M3.053%2010.123c.019.163-.01.115.221.125l5.679-.01a12.1%2012.1%200%200%200-.703-1.087c-.28-.395-.481-.713-.75-1.098L5.997%205.86c-.318.472-2.628%204.071-2.945%204.264Zm12.127.096.106.23-4.457.01c-.827%200-1.135.126-1.29-.201l5.304-.01-.03-.116c-.24-.404-.577-.856-.846-1.25-.289-.434-.549-.829-.857-1.271l-1.723-2.59-.096-.019h-.019a38.005%2038.005%200%200%200-2.454%203.6c-.06.103-.135.197-.222.28L7.26%206.907%208.673%204.8c.231-.356.472-.693.693-1.04.222-.336.472-.692.713-1.02.238.304.456.622.654.954a89.492%2089.492%200%200%201%202.474%203.628%2080.758%2080.758%200%200%200%201.973%202.897Zm-1.02-4.793.923-1.309c.19.318.396.627.616.924.222.318%201.82%202.637%201.868%202.81.634.829%201.225%201.69%201.77%202.58-.664.057-2.261.01-3.089.01-.76%200-.703.076-.818-.203l3.407-.067a23.5%2023.5%200%200%200-1.511-2.31l-1.367-2.012-1.732%202.56c-.116-.057-.02.04-.135-.115l-.404-.597a4.218%204.218%200%200%201-.51-.789c.115-.289.722-1.078.981-1.482ZM.694%2010.257a.678.678%200%200%200-.202.405h19.172c-.121-.334-.3-.644-.53-.915l-1.751-2.56c-.212-.308-.357-.568-.578-.876-.202-.279-.356-.52-.568-.827-.183-.26-.414-.587-.587-.867a8.771%208.771%200%200%200-.568-.818c-.192.145-1.674%202.445-1.982%202.868l-.077.087c-.298-.558-2.281-3.31-2.907-4.312h-.067L8.606%204.58c-.25.375-.462.712-.722%201.068-.134.193-.24.356-.365.53-.125.173-.24.375-.385.539a5.888%205.888%200%200%201-.51-.693c-.174-.26-.328-.51-.52-.77a16.6%2016.6%200%200%200-1.03-1.463c-.75%201.107-1.444%202.107-2.185%203.234-.183.269-.356.529-.539.798-.192.29-.346.53-.539.8-.394.557-.731%201.125-1.116%201.635ZM8.48%209.054c.323.452.622.921.895%201.405H1.224c-.144-.01-.414.049-.375-.086.366-.54.683-1.001%201.04-1.54.124-.183%203.05-4.572%203.233-4.706.577.981%201.492%202.242%202.166%203.195.202.298.385.558.596.866.193.27.385.616.597.866ZM3.457%2014.964c.722-.02.963-.212%201.116-.876.091-.605.124-1.217.097-1.829l.789-.01.029%202.618.856-.01-.01-3.339-2.502-.01c-.048.52-.019%201.088-.028%201.618-.02.923-.039.914-.443%201.135l.096.703Zm3.686-.087h.847l.039-1.415c.404.395.74%201.01%201.135%201.425l1.088-.01c-.202-.385-1.068-1.3-1.386-1.752.183-.404%201.126-1.27%201.26-1.616l-1.039-.01c-.329.467-.682.917-1.058%201.347l-.01-1.347h-.847l-.029%203.378Zm-6.64-3.301-.01%201.02a1.138%201.138%200%200%201%20.837-.327.706.706%200%200%201%20.703.53l-1.117.009-.01.654%201.175.03c-.154.605-.857.846-1.579.288l-.01%201.01a1.78%201.78%200%201%200%20.01-3.214Zm11.356%202.03a4.98%204.98%200%200%201%20.376-1.03l.317%201.05-.693-.02Zm3.484.164c.53-.028%201.01.02%201.348-.279a1.307%201.307%200%200%200%20.288-1.241c-.24-.924-1.52-.77-2.521-.741l.029%203.368.837-.01.02-1.097Zm0-1.55c.443-.009.52.01.75.212a.32.32%200%200%201-.009.414.913.913%200%200%201-.76.203l.02-.828Zm4.322.03v-.751h-2.262l-.02.741h.713l.01%202.618.875.01v-2.6l.684-.018Zm-6.882%202.05.27.587.885-.02a33.134%2033.134%200%200%200-1.26-3.358l-.954.019-1.26%203.35h.895l.279-.578h1.145Z%22%20clipRule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E" alt="" /></span>
                    <span className={styles.item}><img src="data:image/svg+xml,%3Csvg%20width%3D%2228%22%20height%3D%2219%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M26.617.672%2019.722.67h-.002l-.015.001c-.948.03-2.127.789-2.342%201.726l-3.26%2014.427c-.216.946.369%201.715%201.309%201.729h7.243c.926-.046%201.826-.797%202.037-1.723l3.261-14.427c.219-.956-.38-1.731-1.336-1.731Z%22%20fill%3D%22%2301798A%22%2F%3E%3Cpath%20d%3D%22m14.102%2016.824%203.26-14.428C17.578%201.46%2018.758.7%2019.705.671L16.963.669h-4.94c-.949.019-2.144.784-2.359%201.728L6.403%2016.824c-.216.946.37%201.715%201.309%201.729h7.7c-.94-.014-1.525-.783-1.31-1.729Z%22%20fill%3D%22%23024381%22%2F%3E%3Cpath%20d%3D%22M6.403%2016.824%209.665%202.396c.214-.943%201.41-1.708%202.36-1.728L5.696.667c-.955%200-2.18.774-2.398%201.73L.037%2016.823c-.02.088-.03.174-.037.259v.267c.064.69.59%201.191%201.347%201.203h6.365c-.94-.014-1.525-.783-1.309-1.729Z%22%20fill%3D%22%23DD0228%22%2F%3E%3Cpath%20d%3D%22M12.158%2011.181h.12c.11%200%20.183-.037.218-.11l.311-.466h.833l-.173.307h.999l-.127.47H13.15c-.137.205-.305.302-.508.29h-.62l.136-.49Zm-.137.673h2.189l-.14.51h-.88l-.135.491h.857l-.14.51h-.856l-.2.727c-.048.122.017.176.194.164h.698l-.129.474h-1.34c-.254%200-.341-.146-.262-.437l.255-.928h-.548l.14-.51h.547l.134-.491h-.523l.139-.51Zm3.493-1.252-.034.298s.413-.31.788-.31h1.385l-.53%201.919c-.044.219-.232.328-.565.328h-1.57l-.368%201.347c-.021.072.009.11.088.11h.309l-.114.417h-.785c-.302%200-.427-.09-.378-.273l1.04-3.836h.734Zm1.174.542H15.45l-.148.518s.206-.149.55-.154c.343-.005.735%200%20.735%200l.1-.364Zm-.448%201.2c.091.013.142-.023.148-.108l.076-.273h-1.239l-.104.382h1.118Zm-.836.62h.714l-.013.31h.19c.096%200%20.144-.031.144-.092l.056-.2h.593l-.079.292c-.067.243-.245.37-.533.382h-.38l-.003.528c-.006.085.07.128.227.128h.358l-.116.418h-.857c-.24.011-.358-.103-.356-.346l.055-1.42ZM6.752%208.047c-.096.475-.32.84-.67%201.098-.344.255-.79.382-1.334.382-.513%200-.889-.13-1.129-.392-.166-.185-.249-.421-.249-.706%200-.118.014-.245.042-.382l.58-2.799h.878l-.573%202.768a.89.89%200%200%200-.023.212c-.001.142.034.258.105.348.104.135.272.202.507.202.27%200%20.492-.066.665-.199a.914.914%200%200%200%20.336-.563l.574-2.768h.872l-.58%202.8Zm3.683-1.1h.686l-.537%202.497h-.686l.537-2.498Zm.216-.911h.693l-.13.606h-.693l.13-.606Zm1.078%203.218c-.18-.171-.27-.403-.271-.697a1.872%201.872%200%200%201%20.037-.352c.081-.406.255-.728.522-.966.266-.238.588-.358.965-.358.309%200%20.553.086.732.259.18.173.27.407.27.705%200%20.05-.005.11-.011.173a3.177%203.177%200%200%201-.029.187c-.08.4-.252.718-.52.952a1.408%201.408%200%200%201-.962.352c-.31%200-.554-.085-.733-.255Zm1.309-.494c.121-.132.208-.33.26-.595a1.496%201.496%200%200%200%20.026-.246.506.506%200%200%200-.118-.358c-.078-.086-.19-.128-.334-.128a.6.6%200%200%200-.466.2c-.123.135-.21.337-.264.606a.917.917%200%200%200-.024.239c0%20.153.04.271.118.355.078.083.19.125.335.125a.604.604%200%200%200%20.467-.198Z%22%20fill%3D%22%23fff%22%2F%3E%3Cpath%20d%3D%22M19.72.67h-2.757l2.741.001h.016Z%22%20fill%3D%22%23E02F41%22%2F%3E%3Cpath%20d%3D%22M16.963.67%2012.062.666l-.038.001%204.939.001Z%22%20fill%3D%22%232E4F7D%22%2F%3E%3Cpath%20d%3D%22m18.439%2011.202.165-.582h.837l-.036.214s.428-.214.736-.214h1.035l-.164.582h-.163l-.78%202.749h.162l-.155.546h-.163l-.068.236h-.81l.067-.236h-1.6l.157-.546h.16l.782-2.749h-.162Zm.903%200-.213.744s.364-.14.679-.18c.07-.259.16-.564.16-.564h-.626Zm-.312%201.093-.214.779s.404-.199.682-.216c.08-.3.16-.563.16-.563h-.628Zm.157%201.656.16-.565h-.625l-.161.565h.626Zm2.025-3.367h.787l.033.29c-.005.074.039.11.132.11h.14l-.141.491h-.579c-.22.011-.334-.073-.345-.255l-.027-.636Zm-.231%201.055h2.55l-.15.528h-.812l-.14.491h.812l-.15.528h-.904l-.204.309h.442l.102.619c.012.061.067.091.16.091h.137l-.144.51h-.486c-.252.012-.382-.072-.393-.255l-.117-.565-.402.602a.436.436%200%200%201-.438.236h-.742l.144-.51h.231c.096%200%20.175-.042.246-.127l.63-.91h-.812l.15-.528h.88l.14-.49h-.88l.15-.529ZM7.56%206.944h.62l-.072.361.09-.103a.964.964%200%200%201%20.732-.321c.26%200%20.448.076.566.228.117.152.148.363.093.633l-.341%201.702h-.636l.308-1.543c.031-.16.023-.278-.026-.355-.049-.076-.141-.114-.275-.114a.595.595%200%200%200-.413.152.756.756%200%200%200-.224.425l-.284%201.435H7.06l.5-2.5Zm7.102%200h.62l-.07.361.087-.103a.966.966%200%200%201%20.733-.321c.26%200%20.449.076.566.228.115.152.149.363.092.633l-.34%201.702h-.637l.308-1.543c.032-.16.023-.278-.025-.355-.05-.076-.141-.114-.274-.114a.6.6%200%200%200-.415.152.747.747%200%200%200-.222.425l-.286%201.435h-.637l.5-2.5Zm3.064-1.55h1.799c.346%200%20.614.08.798.233.183.156.274.38.274.671v.009c0%20.055-.003.118-.009.186-.009.068-.02.137-.035.205-.08.385-.263.695-.547.93a1.548%201.548%200%200%201-1.013.352h-.965l-.298%201.464h-.835l.83-4.05Zm.45%201.882h.8c.208%200%20.374-.048.495-.144.12-.097.198-.245.242-.446l.017-.101c.003-.029.006-.058.006-.086%200-.144-.05-.248-.153-.313-.102-.066-.262-.097-.484-.097h-.68l-.244%201.187Zm6.16%202.652c-.263.561-.515.889-.663%201.041-.148.15-.441.5-1.147.475l.06-.43c.595-.182.916-1.007%201.1-1.372l-.219-2.69.46-.007h.385l.042%201.688.722-1.688h.732l-1.471%202.983Zm-2.045-2.78-.29.2c-.304-.237-.582-.384-1.117-.136-.729.338-1.338%202.93.67%202.077l.114.135.79.02.518-2.355-.685.06Zm-.45%201.288c-.126.375-.41.622-.631.551-.222-.068-.301-.43-.173-.804.127-.375.412-.622.632-.551.222.068.302.43.173.804Z%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fsvg%3E" alt="" /></span>
                  </div>
                </div>
                  </>
                }

                
                </>
                } 
                
                </p>
              </div>
              <div className={`${styles.myData}`}>
              <h2 className={`${styles.title}`}>Мои данные</h2>
                <p className={styles.number}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M14.737 4.8c0 2.8-2.105 5-4.737 5-2.526 0-4.737-2.2-4.737-5C5.263 2.1 7.368 0 10 0s4.737 2 4.737 4.8ZM0 18.5c0 1 .632 1.5 2.526 1.5h14.948C19.368 20 20 19.5 20 18.5c0-2.9-3.895-6.8-10-6.8s-10 4-10 6.8Z" fill="#ccc"/></svg>
                  {phone}</p>

                  <span className={styles.changeData}><img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%3E%3Cpath%20fill%3D%22%23BDBDCB%22%20fillRule%3D%22evenodd%22%20d%3D%22M12.407.258a.89.89%200%200%201%201.253%200l2.08%202.08a.885.885%200%200%201%200%201.253l-1.627%201.626-3.332-3.333L12.407.258ZM0%2012.665l9.83-9.83%203.333%203.333-9.83%209.83H0v-3.333Z%22%20clipRule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E" alt="" /></span>
              </div>
            </div>
          </div>
          <div className={`${styles.proccess}`}>
            {deliveryMethod === '' && <p className={styles.selectAddress} onClick={()=>setIsDeliveryMethodActive(true)}>Выбрать адрес доставки</p>
            }
            {deliveryMethod !== '' && <>
              {deliveryMethod === 'point' && <p className={styles.method}>Доставка в пункт выдачи</p>}
              {deliveryMethod === 'courier' && <p className={styles.method}>Доставка курьером</p>}
              <p className={styles.address}>{deliveryAddress}</p>
              {cart.map((item, index)=>(
                  <div className={`${styles.deliveryTerms}`} key={index}>
                      {item.deliveryTerm}
                  </div>
                 ))}
                 { cardDetails?.cardNumber && cardDetails?.paymentSystem ? null : <>
                  <p className={styles.chooseMethod} onClick={()=>scrollToPaymentMethod()}>Выбрать способ оплаты</p>
                 </>}
            </>
            }
            <div className={`${styles.productsCount}`}>
            <span>Товары, {totalAmount} шт. </span>
            <span><CountUp end={totalPrice} duration={0.4} separator=" " /> ₽</span>
            </div>
            <div className={`${styles.totalPrice}`}>
              <span>Итого</span>
              <span><CountUp end={totalPrice} duration={0.4} separator=" " /> ₽</span>
            </div>
            <button className={styles.orderBtn} onClick={()=>proccessPayment()}>Заказать</button>
            <div className={styles.agree}>
              <span className={styles.icon}>✔</span>
              <span> <span>Соглашаюсь</span> с правилами пользования торговой площадкой <span>и</span> возврата</span>
                
            </div>
          </div>
        </div>
     </div>
     {isPaymentMethodFormActive && <PaymentMethod setIsPaymentMethodFormActive={setIsPaymentMethodFormActive} setCardDetails={setCardDetails} totalPrice={totalPrice}/>}
     {isChooseDeliveryMethodActive && <SelectAddress setIsDeliveryMethodActive={setIsDeliveryMethodActive} deliveryMethod={deliveryMethod} setDeliveryMethod={setDeliveryMethod} setDeliveryAddress={setDeliveryAddress} deliveryAddress={deliveryAddress}/>}
     
     {
      cardDetails?.cardNumber && cardDetails?.paymentSystem && isConfirmFormActive  ? <ConfirmPayment cardDetails={cardDetails} totalPrice={totalPrice} setCardDetails={setCardDetails} setIsConfirmFormActive={setIsConfirmFormActive}/>: null
     }
    </>
  )
}

export default Basket
