import React from 'react'
import styles from './Footer.module.scss'
import { useNavigate } from 'react-router-dom'
import { CartProduct, useCart } from '../Layout';

const Footer = () => {
  const { cart } = useCart();
  const totalAmount = cart.reduce((acc, item) => acc + item.amount, 0);

  return (
    <>
    <div className={`${styles.mobileMenu}`}>
                <div className={`${styles.menuItem} ${styles.home}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"><path d="M19.5 8.9L11.3.5a1.8 1.8 0 00-2.6 0L.5 9A1.8 1.8 0 001.8 12h.3v5.8c0 1.2 1 2.2 2.2 2.2h3.2c.3 0 .6-.3.6-.6v-4.7c0-.5.4-1 1-1h1.8c.6 0 1 .5 1 1v4.7c0 .3.3.6.6.6h3.2c1.2 0 2.2-1 2.2-2.2V12h.3c.5 0 1-.2 1.3-.5.7-.8.7-2 0-2.6z" fill="#CCC"/></svg>
                </div>
                <div className={`${styles.menuItem} ${styles.search}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M8.582 3H1.5a1.5 1.5 0 1 0 0 3H8c0-1.06.207-2.074.582-3Zm.488 7H1.5a1.5 1.5 0 0 0 0 3h10c.17 0 .332-.028.484-.08A8.04 8.04 0 0 1 9.07 10ZM1.5 17a1.5 1.5 0 0 0 0 3h17a1.5 1.5 0 0 0 0-3h-17ZM19.5 6a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-.047 4.907a6 6 0 1 1 1.7-1.833l2.271 2.178a1.25 1.25 0 1 1-1.73 1.804l-2.24-2.149Z" fill="#CCC"/></svg>
                </div>
                <div className={`${styles.menuItem} ${styles.cart}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" fill="none"><g clipPath="url(#a)" fillRule="evenodd" clipRule="evenodd" fill={cart.length > 0 ? '#cb11ab' : '#CCC'}><path d="M8.32 13.222a1 1 0 0 0 1.097.65l11.344-1.788a1 1 0 0 0 .824-.79l1.177-5.829a1 1 0 0 0-.964-1.197l-15.35-.245a1 1 0 0 0-.957 1.339l2.83 7.86ZM9 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM20 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM3.5 2.5C5.433 2.5 7 1.94 7 1.25S5.433 0 3.5 0 0 .56 0 1.25 1.567 2.5 3.5 2.5Z"/></g><g clipPath="url(#b)" fillRule="evenodd" clipRule="evenodd" fill="#CB11AB"/><defs><clipPath id="a"><path fill="#fff" d="M0 0h23v20H0z"/></clipPath><clipPath id="b"><path fill="#fff" transform="translate(30)" d="M0 0h23v20H0z"/></clipPath></defs></svg>
                {cart.length > 0 && <span className={styles.count}>{totalAmount} </span>}
                
                </div>
                <div className={`${styles.menuItem} ${styles.saved}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" fill="none"><path d="M9.5 17C4.539 12.75 0 8.5 0 5.1 0 2.125 2.322 0 5.278 0 6.86 0 8.444.744 9.5 1.913 10.556.743 12.139 0 13.722 0 16.678 0 19 2.125 19 5.1c0 3.4-4.539 7.65-9.5 11.9Z" fill="#CCC"/></svg>
                </div>
                <div className={`${styles.menuItem} ${styles.profile}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M14.737 4.8c0 2.8-2.105 5-4.737 5-2.526 0-4.737-2.2-4.737-5C5.263 2.1 7.368 0 10 0s4.737 2 4.737 4.8ZM0 18.5c0 1 .632 1.5 2.526 1.5h14.948C19.368 20 20 19.5 20 18.5c0-2.9-3.895-6.8-10-6.8s-10 4-10 6.8Z" fill="#CCC"/></svg>
                </div>
    </div>

      <footer className={styles.footerWrapper}>
        <div className="container">
          <div className={`${styles.footer}`}>
            <div className={`${styles.row}`}>
              <div className={`${styles.cal}`}>
                <div className={`${styles.section}`}>
                  <div className={`${styles.title}`}>
                    Покупателям
                  </div>
                  <ul className={styles.list}>
                    <li className={styles.listItem}>
                      Как сделать заказ
                    </li>
                    <li className={styles.listItem}>
                      Способы оплаты
                    </li>
                    <li className={styles.listItem}>
                      Доставка
                    </li>
                    <li className={styles.listItem}>
                      Возврат товара
                    </li>
                    <li className={styles.listItem}>
                      Возврат денежных средств
                    </li>
                    <li className={styles.listItem}>
                      Правила продажи
                    </li>
                    <li className={styles.listItem}>
                     Правила пользования торговой площадкой
                    </li>
                    <li className={styles.listItem}>
                      Вопросы и ответы
                    </li>
                  </ul>
                </div>
              </div>
              <div className={`${styles.cal}`}>
                <div className={`${styles.section}`}>
                  <div className={`${styles.title}`}>
                    Партнерам
                  </div>
                  <ul className={styles.list}>
                    <li className={styles.listItem}>
                    Продавайте на Wildberries
                    </li>
                    <li className={styles.listItem}>
                    Курьерам
                    </li>
                    <li className={styles.listItem}>
                    Перевозчикам
                    </li>
                    <li className={styles.listItem}>
                    Партнерский пункт выдачи
                    </li>
                    <li className={styles.listItem}>
                    Франшизный пункт выдачи
                    </li>
                  </ul>
                </div>
                <div className={`${styles.section}`}>
                  <div className={`${styles.title}`}>
                    Наши проекты
                  </div>
                  <ul className={styles.list}>
                    <li className={styles.listItem}>
                    WB Guru
                    </li>
                    <li className={styles.listItem}>
                    Трудоустройство
                    </li>
                    <li className={styles.listItem}>
                    Цифровые товары
                    </li>
                    <li className={styles.listItem}>
                    WB Путешествия
                    </li>
                  </ul>
                </div>
              </div>
              <div className={`${styles.cal}`}>
                <div className={`${styles.section}`}>
                  <div className={`${styles.title}`}>
                    Компания
                  </div>
                  <ul className={styles.list}>
                    <li className={styles.listItem}>
                      О нас
                    </li>
                    <li className={styles.listItem}>
                      Реквизиты
                    </li>
                    <li className={styles.listItem}>
                      Пресс-центр
                    </li>
                    <li className={styles.listItem}>
                      Контакты
                    </li>
                    <li className={styles.listItem}>
                    Bug Bounty
                    </li>
                    <li className={styles.listItem}>
                    WB.Tech
                    </li>
                  </ul>
                </div>
              </div>
              <div className={`${styles.cal}`}>
                <div className={`${styles.section}`}>
                  <div className={`${styles.title}`}>
                    Мы в соцсетях
                  </div>
                  <ul className={styles.list}>
                  <li className={styles.listItem}>
                     ВКонтакте
                    </li>
                    <li className={styles.listItem}>
                      Одноклассники
                    </li>
                    <li className={styles.listItem}>
                      Youtube
                    </li>
                    <li className={styles.listItem}>
                      Телеграм
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={`${styles.mobileApp}`}>
                <div className={`${styles.title}`}>Приложение Wildberries</div>

                <div className={`${styles.scan}`}>
                  <img src="https://static-basket-01.wb.ru/vol0/i/v3/apps/qr.png" alt="" />
                  <p>Наведите камеру, чтобы скачать приложение</p>
                  <ul className={styles.stores}>
                    <li>
                    </li>
                    <li>
                    </li>
                    <li>
                    </li>
                  </ul>
                </div>
            </div>
          </div>

          <div className={`${styles.footerMobile}`}>
            <div className={`${styles.section}`}>
              <div className={`${styles.title}`}>
              Покупателям
              </div>
            </div>
            <div className={`${styles.section}`}>
              <div className={`${styles.title}`}>
              Партнерам
              </div>
            </div>
            <div className={`${styles.section}`}>
              <div className={`${styles.title}`}>
              Наши проекты
              </div>
            </div>
            <div className={`${styles.section}`}>
              <div className={`${styles.title}`}>
              Компания
              </div>
            </div>
            <div className={`${styles.section}`}>
              <div className={`${styles.title}`}>
              Мы в соцсетях
              </div>
            </div>
            <div className={`${styles.links}`}>
              <div className={`${styles.apps}`}>
              <img src="data:image/png;base64,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" alt="" />
              <img src="data:image/png;base64,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" alt="" />
              <img src="data:image/png;base64,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" alt="" />
              </div>
              <span>2004-2023 © Wildberries</span>
            </div>
          </div>
          <p className={styles.rules}>

          2004-2023 © Wildberries — модный интернет-магазин одежды, обуви и аксессуаров. <br />
          Все права защищены. Доставка по всей России. <br />
          <span>Проверка совместимости</span>
          </p>
        </div>
      </footer>
    </>
  )
}

export default Footer
