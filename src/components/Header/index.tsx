import React from 'react'
import styles from "./Header.module.scss"
import { CartProduct, useCart } from '../Layout';

const Header = () => {
    const { cart } = useCart();
    const totalAmount = cart.reduce((acc, item) => acc + item.amount, 0);

  return (
    <>
    <header className={`${styles.headerWrapper}`}>
        <div className="container">
        <div className={`${styles.header}`}>
            <div className={`${styles.upHeader}`}>
                <div className={`${styles.simpleMenu}`}>
                <div className={`${styles.currency}`}>
                    <span></span>
                    <div className={`${styles.currencySymbol}`}>RUB</div>
                </div>
                {/* <div className={`${styles.location}`}>
                    <span></span>
                    <div className={`${styles.city}`}>Москва</div>
                </div> */}
                <a className={`${styles.sellOnWildberries}`} href='https://seller.wildberries.ru/'>
                    Продавайте на Wildberries
                </a>
                <a className={`${styles.workOnWildberries}`} href='https://seller.wildberries.ru/'>
                    Работа в Wildberries
                </a>
                </div>
                <div className={`${styles.balance}`}>
                0 ₽
                </div>
            </div>
            
            <div className={`${styles.headerContent}`}>
                <div className={`${styles.headerMenu}`}>
                <button className={`${styles.burgerNav}`}>
                    <span className={`${styles.burgerItem}`}>
                    </span>
                </button>
                <a className={`${styles.logo}`} href='https://www.wildberries.ru/'>
                    <img src="https://static-basket-01.wb.ru/vol0/i/header/logo-v1.svg" alt="logo" />
                </a>
                </div>
               
                <div className={`${styles.searchGroup}`}>
                    <input type="text" className={styles.searchInput} placeholder='Я ищу...' disabled={true}/>
                    <button className={`${styles.searchIcon}`}></button>
                    <button className={`${styles.searchPhoto}`}></button>
                </div>

                <div className={`${styles.actions}`}>
                    <div className={`${styles.actionItem}`}>
                        <img className={`${styles.actionLogo}`} src='data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2224%22%20viewBox%3D%220%200%2016%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M16%208.10988C16%2011.7119%2010.826%2019.7973%208.79995%2022.8253C8.41424%2023.4018%207.58576%2023.4018%207.20005%2022.8253C5.17398%2019.7973%200%2011.7119%200%208.10988C0%203.63092%203.58172%200%208%200C12.4183%200%2016%203.63092%2016%208.10988ZM11.7333%208.10981C11.7333%2010.2%2010.0618%2011.8944%207.99994%2011.8944C5.93807%2011.8944%204.2666%2010.2%204.2666%208.10981C4.2666%206.01962%205.93807%204.3252%207.99994%204.3252C10.0618%204.3252%2011.7333%206.01962%2011.7333%208.10981Z%22%20fill%3D%22white%22%2F%3E%0A%3C%2Fsvg%3E%0A' alt='a'/>
                        <span>Адреса</span>
                    </div>
                    <div className={`${styles.actionItem}`}>
                        <img className={`${styles.actionLogo}`} src='data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2222%22%20viewBox%3D%220%200%2020%2022%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20fillRule%3D%22evenodd%22%20clipRule%3D%22evenodd%22%20d%3D%22M10%207L0%203.05062L9.25965%200.265597C9.83507%200.0925293%2010.4492%200.0962422%2011.0225%200.276255L20%203.09524L10%207ZM10%209.375L0%205.5V15.9451C0%2017.1837%200.761146%2018.2949%201.91603%2018.7425L10%2021.875L18.084%2018.7425C19.2389%2018.2949%2020%2017.1837%2020%2015.9451V5.5L10%209.375Z%22%20fill%3D%22white%22%2F%3E%0A%3C%2Fsvg%3E%0A' alt='delivery'/>
                        <span>Доставка</span>
                    </div>
                    <div className={`${styles.actionItem}`}>
                        <img className={`${styles.actionLogo}`} src='data:image/svg+xml,%3Csvg%20width%3D%2219%22%20height%3D%2220%22%20viewBox%3D%220%200%2019%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20fillRule%3D%22evenodd%22%20clipRule%3D%22evenodd%22%20d%3D%22M14.0207%204.78873C14.0207%207.55869%2011.9361%209.70657%209.50596%209.70657C7.07586%209.70657%204.99117%207.55869%204.99117%204.81221C4.97931%202.10094%207.08777%200%209.50596%200C11.9241%200%2014.0207%202.05399%2014.0207%204.78873ZM0%2018.4977C0%2019.4836%200.64326%2020%202.44201%2020H16.558C18.3567%2020%2019%2019.4836%2019%2018.4977C19%2015.6338%2015.3429%2011.6901%209.50596%2011.6901C3.65705%2011.6901%200%2015.6338%200%2018.4977Z%22%20fill%3D%22white%22%2F%3E%0A%3C%2Fsvg%3E%0A' alt='profile'/>
                        <span>Профиль</span>
                    </div>
                    <div className={`${styles.actionItem}`}>
                        <img className={`${styles.actionLogo}`} src='data:image/svg+xml,%3Csvg%20width%3D%2227%22%20height%3D%2224%22%20viewBox%3D%220%200%2027%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20fillRule%3D%22evenodd%22%20clipRule%3D%22evenodd%22%20d%3D%22M8.5%201.5C8.5%202.5%206%202.5%204.5%202.5C3%202.5%200.5%202.5%200.5%201.5C0.5%200.5%203%200.5%204.5%200.5C6%200.5%208.5%200.5%208.5%201.5ZM11.8212%2016.119C11.3452%2016.1949%2010.8829%2015.9206%2010.7214%2015.4665L7.48289%206.35812C7.24913%205.70067%207.74355%205.01199%208.44122%205.02324L25.8008%205.30317C26.425%205.31324%2026.8875%205.88644%2026.7654%206.49865L25.4106%2013.2909C25.3288%2013.701%2025.0004%2014.017%2024.5874%2014.0828L11.8212%2016.119ZM13.6523%2021.0331C13.6523%2022.3178%2012.6109%2023.3593%2011.3262%2023.3593C10.0415%2023.3593%209%2022.3178%209%2021.0331C9%2019.7484%2010.0415%2018.707%2011.3262%2018.707C12.6109%2018.707%2013.6523%2019.7484%2013.6523%2021.0331ZM22.957%2023.3593C24.2417%2023.3593%2025.2832%2022.3178%2025.2832%2021.0331C25.2832%2019.7484%2024.2417%2018.707%2022.957%2018.707C21.6723%2018.707%2020.6309%2019.7484%2020.6309%2021.0331C20.6309%2022.3178%2021.6723%2023.3593%2022.957%2023.3593Z%22%20fill%3D%22white%22%2F%3E%0A%3C%2Fsvg%3E%0A' alt='cart'/>
                        <span>Корзина </span>
                        {cart.length > 0 && <span className={styles.cartCount}>{totalAmount}</span>}
                        
                    </div>
                </div>

                <div className={`${styles.actionsMobile}`}>
                    <button className={`${styles.currency}`}>
                        <span></span>
                        RUB
                    </button>
                    <button className={`${styles.location}`}></button>
                    <button className={`${styles.search}`}></button>
                </div>
            </div>
        </div>
        </div>
    </header>
    <div className={`${styles.devider}`}></div>
    </>
  )
}

export default Header
