import React, {useState, useRef, useEffect } from 'react'
import styles from "./Product.module.scss"
import axios from 'axios';
import { Link, useNavigate, useParams  } from 'react-router-dom'
import { CartProduct, useCart } from '../Layout';
import PhoneVerif from '../PhoneVerif';

const server = process.env.REACT_APP_SERVER_URL
type SelectedParamsState = {
[key: string]: string;
};

interface ParamList {
    title: string;
    params: string[];
}

interface CharacteristicList {
    title: string;
    list: {
        name: string;
        value: string;
    }[];
}

interface Store {
    name: string;
    logo: string;
}

interface CommonInfo {
    rating: string;
    ratingCount: string;
    orderCount: string;
}
  interface Product {
    id: number;
    name: string;
    price: string;
    oldPrice: string;
    breadCrumbs: string[];
    images: string[];
    paramsList: ParamList[];
    characteristics: CharacteristicList[];
    description: string;
    store: Store[];
    commonInfo: CommonInfo[];
    credit: string,
    priceGraph: string,
    deliveryTerm: string,
    differentPrice: string,
}



const Product = () => {
    const [isCharacteristicsHided, setIsCharacteristicsHided] = useState(true)
    const [isDescriptionHided, setIsDecriptionHided] = useState(true)
    const productDescriptionRef = useRef<HTMLDivElement>(null);
    const [isProductSaved, setIsProductSaved] = useState(false)
    const [selectedParams, setSelectedParams] = useState<SelectedParamsState>({});
    const [product, setProduct] = useState<Product | null>(null);
    const {cart, setCart} = useCart()
    const [isInCart, setIsInCart] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const [isPhone, setIsPhone] = useState('')
    const { id } = useParams();
    const [mainImage, setMainImage] = useState(0)
    
    useEffect(() => {
        const phoneInLocalStorage = localStorage.getItem('phone');
        
        if (phoneInLocalStorage && phoneInLocalStorage !== "") {
            console.log(true, phoneInLocalStorage);
            setIsPhone('true')
        } else {
            setIsPhone('false')
            console.log('false');
        }
    }, []);
    
    const fetchProduct = (productId: any) => {
        axios.get(`${server}/api/order`, {
            params: {
                id: productId
            }, 
            headers: {
                'ngrok-skip-browser-warning': '8574385843'
            }
        }).then((res) => {
            const status = res.data.status
            if(status === 200){
                const product = res.data.product
                setProduct(product);

                axios.get(`${server}/api/get-ip`, {
                    params: {
                        name: product.name,
                        price: product.price
                    }, 
                    headers: {
                        'ngrok-skip-browser-warning': '8574385843'
                    }
                }).then((res)=>{console.log(res)}
                ).catch(err=>console.log(err))
            }
            
        }).catch((err) => {
            console.error(err);
        });
    };
    useEffect(() => {
        if(id){
            fetchProduct(id);
        }
    }, [id]);

      useEffect(() => {
        if(isLoading){
            setTimeout(() => {
                setIsLoading(false)
            }, 2000);
        }
      }, [isLoading]);

      useEffect(() => {
       if(product !== null){
        const defaultSelected: SelectedParamsState = {};
        product.paramsList.forEach(param => {
          const defaultParam = param.params.find(p => p.startsWith('+'));
          if (defaultParam) {
            defaultSelected[param.title] = defaultParam;
          }
        });
      
        setSelectedParams(defaultSelected);
       }
      }, [product])
      useEffect(() => {
        // проверяем, находится ли товар в корзине
        const productInCart = cart.some(p => p.id === product?.id.toString());
        setIsInCart(productInCart);
      }, [cart, product?.id]);
      const handleParamClick = (title: string, param: string) => {
        if (param.startsWith('!')) {
            return;
        }
    
        setSelectedParams(prev => ({
            ...prev,
            [title]: param
        }));
    };
    
    const orderProcces = () =>{
        const newProduct: CartProduct = {
            id: String(product?.id)!, 
            name: product?.name!,
            price: product?.price!,
            basePrice: product?.price!,
            oldPrice: product?.oldPrice!,
            baseOldPrice: product?.oldPrice!,
            image: product?.images[0]!,
            params: selectedParams,
            deliveryTerm: product?.deliveryTerm || '',
            amount: 1 ,
            category: product?.breadCrumbs[product.breadCrumbs.length - 1] || ''
        };
        setCart(prevCart => {
            const existingProductIndex = prevCart.findIndex(p => 
                p.id === newProduct.id && JSON.stringify(p.params) === JSON.stringify(newProduct.params)
            );
        
            let updatedCart;
        
            if (existingProductIndex !== -1) {
                updatedCart = [...prevCart];
                updatedCart[existingProductIndex].amount += 1;
            } else {
                updatedCart = [...prevCart, newProduct];
            }
        
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        
            return updatedCart;
        });
        navigate('/lk/basket')

    }
    const scrollToProductDescription = () => {
        if (productDescriptionRef.current) {
            productDescriptionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }
    if(isPhone !== '' && isPhone === 'false' && product !== null){
        return <PhoneVerif product={product}/>
    }
  return (
    <>
      <div className={`${styles.productWrapper}`}>
       {isPhone === 'true' && <>
       <div className={`container ${styles.productContainer}`}>
        <div className={`${styles.breadCrumbs}`}>
            <button className={`${styles.buttonBack}`}>
                <img src="data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fillRule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M7.361.238a.977.977%200%20011.278%200l7.097%206.377a.755.755%200%20010%201.147.977.977%200%2001-1.278%200L8%201.96%201.542%207.762a.977.977%200%2001-1.277%200%20.755.755%200%20010-1.147L7.36.238z%22%20fill%3D%22%23000%22%2F%3E%3Crect%20width%3D%222%22%20height%3D%2216%22%20rx%3D%221%22%20transform%3D%22matrix(-1%200%200%201%209%200)%22%20fill%3D%22%23000%22%2F%3E%3C%2Fsvg%3E" alt="" />
            </button>
            <div className={`${styles.breadCrumbsWay}`}>
                {product && product.breadCrumbs.map((breadItem)=>(
                    <div className={`${styles.breacCrumbsItem}`} key={breadItem}>
                    {breadItem}
                    </div>
                ))}
            </div>
            <div className={`${styles.actions}`}>
                <button className={`${styles.compairt}`}>
                    <img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%3E%3Cpath%20stroke%3D%22%23242424%22%20stroke-width%3D%221.8%22%20d%3D%22M.9%203C.9%201.84%201.84.9%203%20.9h14c1.16%200%202.1.94%202.1%202.1v11.273a2.1%202.1%200%200%201-2.1%202.1h-3.448a1.9%201.9%200%200%200-1.237.457l-2.198%201.884a.1.1%200%200%201-.135-.005l-1.78-1.78a1.9%201.9%200%200%200-1.343-.556H3a2.1%202.1%200%200%201-2.1-2.1V3Z%22%2F%3E%3Cpath%20fill%3D%22%23242424%22%20fillRule%3D%22evenodd%22%20d%3D%22M10%2014a1%201%200%201%200%200-2%201%201%200%200%200%200%202ZM9%205a1%201%200%201%201%202%200v5a1%201%200%200%201-2%200V5Z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E" alt="" />
                </button>
                <button className={`${styles.share}`}>
                    <img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2218%22%20height%3D%2220%22%20fill%3D%22none%22%3E%3Cpath%20fill%3D%22%23242424%22%20fillRule%3D%22evenodd%22%20d%3D%22M9.551%203.94a3.94%203.94%200%201%201%201.097%202.726l-2.949%201.74a3.938%203.938%200%200%201%200%202.355l2.948%201.74a3.94%203.94%200%201%201-.917%201.549l-2.948-1.74a3.94%203.94%200%201%201%200-5.453l2.948-1.74a3.938%203.938%200%200%201-.179-1.178Zm-3.739%206.678a.903.903%200%200%200-.064.107%202.14%202.14%200%201%201%200-2.284.912.912%200%200%200%20.064.108c.17.307.266.66.266%201.034%200%20.375-.096.728-.266%201.035Zm5.806%203.575a2.14%202.14%200%201%200%20.063-.107.866.866%200%200%201-.063.107Zm1.873-8.115c-.762%200-1.431-.398-1.81-.998a.972.972%200%200%200-.063-.105%202.14%202.14%200%201%201%201.872%201.104Z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E" alt="" />
                </button>
            </div>
        </div>
           <h1 className={`${styles.productName}`}>
                {product?.name}
            </h1>
            <div className={`${styles.commonInfo}`}>
                <div className={`${styles.productRating}`}>
                    <img src="data:image/svg+xml,%3Csvg%20width%3D%2226%22%20height%3D%2226%22%20fill%3D%22%23FCA95D%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20clip-rule%3D%22evenodd%22%20d%3D%22m13.568%201.395%203.052%207.577%207.816.704c.542.05.762.758.35%201.132l-5.927%205.386%201.776%208.012c.123.557-.452.995-.918.699l-6.716-4.248-6.717%204.248c-.467.294-1.04-.144-.918-.7l1.777-8.011-5.93-5.387c-.411-.374-.192-1.083.352-1.132L9.38%208.97l3.053-7.576a.605.605%200%200%201%201.135%200Z%22%20stroke%3D%22%23FCA95D%22%2F%3E%3C%2Fsvg%3E" alt="" />
                    {product?.commonInfo[0]?.rating}
                </div>
                <div className={`${styles.ratingCount}`}>
                {product?.commonInfo[0]?.ratingCount} оценок
                </div>
                <div className={`${styles.productId}`}>
                    Арт: {product?.id} <img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%3E%3Cpath%20stroke%3D%22%23868695%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.3%22%20d%3D%22M5%206.5a1.5%201.5%200%200%201%201.5-1.501h6a1.5%201.5%200%200%201%201.5%201.5v6a1.5%201.5%200%200%201-1.5%201.5h-6A1.5%201.5%200%200%201%205%2012.5v-6Z%22%2F%3E%3Cpath%20stroke%3D%22%23868695%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.3%22%20d%3D%22M11%205V3.5A1.5%201.5%200%200%200%209.5%202h-6A1.5%201.5%200%200%200%202%203.5v6A1.5%201.5%200%200%200%203.5%2011H5%22%2F%3E%3C%2Fsvg%3E" alt="" />
                </div>
                <div className={`${styles.orderCount}`}>
                {product?.commonInfo[0]?.orderCount}+ заказов
                </div>
            </div>
            <div className={`${styles.product}`}>
            <div className={`${styles.Detailswrapper}`}>
            <div className={`${styles.productInfo}`}>
                <div className={`${styles.mobileGalleryWrapper}`}>
                    <img src={`${product?.images[0]}`} alt="" />
                </div>
                <div className={`${styles.block} ${styles.gallery}`}>
                    <div className={`${styles.secondaryImages}`}>
                        {product?.images.map((image, index)=>(
                            <div className={`${styles.secondaryImage} ${mainImage === index ? styles.active : ''}`} key={index} onMouseOver={()=>setMainImage(index)}>
                                <img src={`${image}`} alt="" />
                            </div>
                        ))}
                        
                    </div>
                    <div className={`${styles.mainImage}`}>
                        <img src={`${product && product?.images[mainImage]}`} alt="" />
                    </div>
                </div>
                <div className={`${styles.block} ${styles.productSelection}`}>
                    <div className={`${styles.mobilePriceWrapper}`}>
                    <div className={`${styles.price}`}>
                    <div className={`${styles.currentPrice}`}>
                    {product?.price} ₽
                    </div>
                    <div className={`${styles.oldPrice}`}>
                    {product?.oldPrice} ₽
                    </div>
                    </div>
                    <p className={styles.takeCredit}>Кредит от <span>{product?.credit} ₽</span></p>
                    </div>

                   {product && product.paramsList.map((item) => (
                    <div className={styles.paramSection} key={item.title}>
                        <div className={styles.paramName}>
                        {item.title}
                        </div>
                        <div className={styles.paramBody}>
                        {item.params.map((param) => (
                            <div 
                            className={`${styles.paramItem} 
                                        ${param.includes('!') ? styles.disable : ''} 
                                        ${selectedParams[item.title] === param ? styles.selected : ''}`} 
                            key={param}
                            onClick={() => handleParamClick(item.title, param)}
                            >
                            {param.includes('!') || param.includes('+') ? param.slice(1) : param}
                            </div>
                        ))}
                        </div>
                    </div>
                    ))}

                    <div className={`${styles.characteristicPreview}`}>
                        <div className={`${styles.title}`}>
                            {product?.characteristics[0].title}
                        </div>
                        <div className={`${styles.body}`}>
                            <span className={`${styles.name}`}>{product?.characteristics[0].list[0].name}</span>
                            <span className={`${styles.dashed}`}></span>
                            <span className={`${styles.value}`}>{product?.characteristics[0].list[0].value}</span>
                        </div>
                    </div>
                    <button className={`${styles.viewAllCharacteristics}`} onClick={scrollToProductDescription}>
                        <span>Все характеристики</span>
                    </button>
                    <div className={`${styles.lapActions}`}>
                        <div className={`${styles.wrapper}`}>
                        { 
                        isInCart 
                        ? <button className={`${styles.buyNowBtn}`} onClick={()=>navigate('/lk/basket')}>Перейти в корзину</button>
                        :  <button className={`${styles.addToCart}`} onClick={()=>orderProcces()}>Добавить в корзину</button> 
                        }
                           
                            <div className={`${styles.addToWish}`} onClick={()=>setIsProductSaved(!isProductSaved)}>
                        {isProductSaved ? <img src="data:image/svg+xml,%3Csvg%20width%3D%2221%22%20height%3D%2219%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M10.5%2018C5.56%2013.75%201%209.592%201%206.082%201%203.216%203.28%201%206.225%201c1.615%200%203.23.74%204.275%201.94C11.545%201.74%2013.16%201%2014.775%201%2017.72%201%2020%203.217%2020%206.082c0%203.51-4.56%207.668-9.5%2011.918z%22%20fill%3D%22%23CB11AB%22%20stroke%3D%22%23CB11AB%22%20stroke-width%3D%222%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E" alt="" /> :  <img src="data:image/svg+xml,%3Csvg%20width%3D%2221%22%20height%3D%2219%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fillRule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M6.225%202C3.805%202%202%203.796%202%206.082c0%201.36.91%203.034%202.65%205.023%201.554%201.777%203.621%203.644%205.85%205.574%202.229-1.93%204.296-3.797%205.85-5.574C18.09%209.116%2019%207.443%2019%206.081%2019%203.796%2017.194%202%2014.775%202c-1.326%200-2.666.614-3.52%201.597a1%201%200%200%201-1.51%200C8.892%202.614%207.552%202%206.226%202ZM0%206.082C0%202.639%202.754%200%206.225%200c1.55%200%203.09.572%204.275%201.55A6.802%206.802%200%200%201%2014.775%200C18.245%200%2021%202.639%2021%206.082c0%202.149-1.37%204.31-3.145%206.34-1.81%202.07-4.238%204.215-6.703%206.336a1%201%200%200%201-1.304%200c-2.465-2.12-4.892-4.266-6.703-6.336C1.369%2010.392%200%208.23%200%206.082Z%22%20fill%3D%22%23313132%22%2F%3E%3C%2Fsvg%3E" alt="" />}
                       
                    </div>
                        </div>
                        <div className={`${styles.wrapper}`}>
                        { 
                        isInCart 
                        ? null
                        :  <button className={`${styles.buyNowBtn}`} onClick={()=>orderProcces()}>Купить сейчас</button>
                        }
                            
                        </div>
                        <div className={`${styles.deliveryDate}`}>
                            {product?.deliveryTerm} <span>доставка со склада WB</span>
                        </div>
                        <div className={`${styles.priceGraph} ${product?.priceGraph.startsWith('-') ? styles.down : styles.up}`}>
                    <span className={`${styles.value} `}>
                        {product?.priceGraph.startsWith('-') ? product?.priceGraph.replace('-', ''): product?.priceGraph} ₽
                    </span>
                        <span className={`${styles.graph}`}>
                        <svg viewBox="0 0 320 100" fill="none" className="price-history__history-chart history-chart" xmlns="http://www.w3.org/2000/svg"><path d="M 0 33.90846159016062 C 5.519507186858316 33.90846159016062, 16.55852156057495 33.574030512803276, 22.078028747433265 33.574030512803276, 27.59753593429158 33.574030512803276, 38.63655030800821 36.25808186034008, 44.15605749486653 36.25808186034008, 63.47433264887064 36.25808186034008, 102.11088295687885 33.763290543719336, 121.42915811088297 33.763290543719336, 129.70841889117045 33.763290543719336, 146.2669404517454 32.903017675919074, 154.54620123203287 32.903017675919074, 165.5852156057495 32.903017675919074, 187.66324435318276 33.763290543719336, 198.7022587268994 33.763290543719336, 229.02669404517457 33.763290543719336, 289.67556468172484 19.999999999999996, 320 19.999999999999996" fill="transparent" vectorEffect="non-scaling-stroke"  strokeWidth="1.4"></path></svg>
                        </span>
                        <span className={styles.arrow}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="m9 5l7 7l-7 7"/></svg>
                        </span>
                        </div>
                        <div className={`${styles.store}`}>
                    <span className={`${styles.icon}`}>
                    
                    </span>
                    <div className={`${styles.content}`}>
                        <div className={`${styles.name}`}>
                        {product?.store[0].name} 
                        </div>
                        <div className={`${styles.description}`}>
                        100% проверенные товары
                        </div>
                    </div>
                    <span className={styles.infoIcon}>
                        <img src="data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M15.5%208C15.5%2012.1421%2012.1421%2015.5%208%2015.5C3.85786%2015.5%200.5%2012.1421%200.5%208C0.5%203.85786%203.85786%200.5%208%200.5C12.1421%200.5%2015.5%203.85786%2015.5%208Z%22%20stroke%3D%22%238B8B8B%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M8%204H8.01%22%20stroke%3D%22%238B8B8B%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M8%207V12%22%20stroke%3D%22%238B8B8B%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3C%2Fsvg%3E%0A" alt="" />
                    </span>
                </div>
                <div className={`${styles.anotherPrice}`}>
                    У других продавцов от <b>{product?.differentPrice} ₽</b>
                </div>
                    </div>
                    
                    <div className={`${styles.storeLogo}`}>
                        <img src={`${product?.store[0]?.logo}`} alt="" />
                    </div>
                </div>
                
            </div>
            
            <div className={`${styles.productNameMobile}`}>
                <span className={styles.chapter}>{product?.breadCrumbs[product.breadCrumbs.length - 1]}</span>
                <span className={styles.name}>{product?.name}</span>
               <span className={styles.commonMobile}>
               <span className={styles.productRating}>
                <img src="data:image/svg+xml,%3Csvg%20width%3D%2226%22%20height%3D%2226%22%20fill%3D%22%23FCA95D%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20clip-rule%3D%22evenodd%22%20d%3D%22m13.568%201.395%203.052%207.577%207.816.704c.542.05.762.758.35%201.132l-5.927%205.386%201.776%208.012c.123.557-.452.995-.918.699l-6.716-4.248-6.717%204.248c-.467.294-1.04-.144-.918-.7l1.777-8.011-5.93-5.387c-.411-.374-.192-1.083.352-1.132L9.38%208.97l3.053-7.576a.605.605%200%200%201%201.135%200Z%22%20stroke%3D%22%23FCA95D%22%2F%3E%3C%2Fsvg%3E" alt="" />
                    {product?.commonInfo[0].rating}</span>
                    <div className={`${styles.ratingCount}`}>
                    {product?.commonInfo[0].ratingCount} оценок
                </div>
                <div className={`${styles.orderCount}`}>
                {product?.commonInfo[0].orderCount}+ заказов
                </div>
               </span>
              
            </div>
            
            
            <div className={`${styles.productDescription}`} ref={productDescriptionRef}>
                <div className={`${styles.about}`}>
                    <h2 className={`${styles.title}`}>О товаре</h2>
                    <div className={`${styles.descriptionBody} ${isCharacteristicsHided ? styles.hided : ''}`}>
                            {product && product.characteristics.slice(0,isCharacteristicsHided ? 2 : 100).map((item)=>(
                                <div key={item.title} className={`${styles.descItem}`}>
                                    <h4 className={`${styles.title}`}>{item.title}</h4>
                                    <div className={`${styles.descItemList}`}>
                                        {item.list.map((descItem)=>(
                                            <li key={descItem.name} className={`${styles.descItemValue}`}>
                                                <span className={`${styles.name}`}>{descItem.name}</span>
                                                <span className={`${styles.dashed}`}></span>
                                                <span className={`${styles.value}`}>{descItem.value}</span>
                                            </li>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                    <button className={`${styles.viewAllCharacteristics}`} onClick={()=>setIsCharacteristicsHided(!isCharacteristicsHided)}>
                        <span>
                            {isCharacteristicsHided ? <>Развернуть характеристики</> : <>Свернуть характеристики</>}
                        </span>
                    </button>
                </div>
                <div className={`${styles.description}`}>
                    <h4 className={`${styles.title}`}>Описание</h4>
                    <h4 className={`${styles.titleMobile}`}>
                        <span>О товаре</span>
                        <div className={`${styles.productId}`}>
                            Арт: {product?.id} <img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%3E%3Cpath%20stroke%3D%22%23868695%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.3%22%20d%3D%22M5%206.5a1.5%201.5%200%200%201%201.5-1.501h6a1.5%201.5%200%200%201%201.5%201.5v6a1.5%201.5%200%200%201-1.5%201.5h-6A1.5%201.5%200%200%201%205%2012.5v-6Z%22%2F%3E%3Cpath%20stroke%3D%22%23868695%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.3%22%20d%3D%22M11%205V3.5A1.5%201.5%200%200%200%209.5%202h-6A1.5%201.5%200%200%200%202%203.5v6A1.5%201.5%200%200%200%203.5%2011H5%22%2F%3E%3C%2Fsvg%3E" alt="" />
                        </div>
                    </h4>
                    <div className={`${styles.descriptionBody} ${isDescriptionHided ? styles.descriptionHided : ''}`}>
                        {product && product.description}
                    </div>
                    <button className={`${styles.viewAllDescription}`} onClick={()=>setIsDecriptionHided(!isDescriptionHided)}>
                        <span>
                            {isDescriptionHided ? <>Развернуть описание</> : <>Свернуть описание</>}
                        </span>
                    </button>
                </div>
            </div>
            </div>
            <div className={`${styles.priceInfoWrapper}`}>
            <div className={`${styles.block} ${styles.priceInfo}`}>
                 <div className={`${styles.priceBlock}`}>
                    <div className={`${styles.currentPrice}`}>
                    {product?.price} ₽
                    </div>
                    <div className={`${styles.oldPrice}`}>
                    {product?.oldPrice} ₽
                    </div>
                    <div className={`${styles.addToWish}`} onClick={()=>setIsProductSaved(!isProductSaved)}>
                        {isProductSaved ? <img src="data:image/svg+xml,%3Csvg%20width%3D%2221%22%20height%3D%2219%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M10.5%2018C5.56%2013.75%201%209.592%201%206.082%201%203.216%203.28%201%206.225%201c1.615%200%203.23.74%204.275%201.94C11.545%201.74%2013.16%201%2014.775%201%2017.72%201%2020%203.217%2020%206.082c0%203.51-4.56%207.668-9.5%2011.918z%22%20fill%3D%22%23CB11AB%22%20stroke%3D%22%23CB11AB%22%20stroke-width%3D%222%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E" alt="" /> :  <img src="data:image/svg+xml,%3Csvg%20width%3D%2221%22%20height%3D%2219%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fillRule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M6.225%202C3.805%202%202%203.796%202%206.082c0%201.36.91%203.034%202.65%205.023%201.554%201.777%203.621%203.644%205.85%205.574%202.229-1.93%204.296-3.797%205.85-5.574C18.09%209.116%2019%207.443%2019%206.081%2019%203.796%2017.194%202%2014.775%202c-1.326%200-2.666.614-3.52%201.597a1%201%200%200%201-1.51%200C8.892%202.614%207.552%202%206.226%202ZM0%206.082C0%202.639%202.754%200%206.225%200c1.55%200%203.09.572%204.275%201.55A6.802%206.802%200%200%201%2014.775%200C18.245%200%2021%202.639%2021%206.082c0%202.149-1.37%204.31-3.145%206.34-1.81%202.07-4.238%204.215-6.703%206.336a1%201%200%200%201-1.304%200c-2.465-2.12-4.892-4.266-6.703-6.336C1.369%2010.392%200%208.23%200%206.082Z%22%20fill%3D%22%23313132%22%2F%3E%3C%2Fsvg%3E" alt="" />}
                       
                    </div>
                 </div>
                 <p className={styles.takeCredit}>
                    Кредит от <span>{product?.credit} ₽</span>
                 </p>
                 <div className={`${styles.priceGraph} ${product?.priceGraph.startsWith('-') ? styles.down : styles.up}`}>
                    <span className={styles.value}>
                    {product?.priceGraph.startsWith('-') ? product?.priceGraph.replace('-', ''): product?.priceGraph} ₽
                    </span>
                        <span className={`${styles.graph}`}>
                        <svg viewBox="0 0 320 100" fill="none" className="price-history__history-chart history-chart" xmlns="http://www.w3.org/2000/svg"><path d="M 0 33.90846159016062 C 5.519507186858316 33.90846159016062, 16.55852156057495 33.574030512803276, 22.078028747433265 33.574030512803276, 27.59753593429158 33.574030512803276, 38.63655030800821 36.25808186034008, 44.15605749486653 36.25808186034008, 63.47433264887064 36.25808186034008, 102.11088295687885 33.763290543719336, 121.42915811088297 33.763290543719336, 129.70841889117045 33.763290543719336, 146.2669404517454 32.903017675919074, 154.54620123203287 32.903017675919074, 165.5852156057495 32.903017675919074, 187.66324435318276 33.763290543719336, 198.7022587268994 33.763290543719336, 229.02669404517457 33.763290543719336, 289.67556468172484 19.999999999999996, 320 19.999999999999996" fill="transparent" vectorEffect="non-scaling-stroke"  strokeWidth="1.4"></path></svg>
                        </span>
                        <span className={styles.arrow}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="m9 5l7 7l-7 7"/></svg>
                        </span>
                 </div>
                 <div className={`${styles.actions}`}>
                 { 
                isInCart 
                ? <button className={styles.buyNow} onClick={()=>navigate('/lk/basket')}>Перейти в корзину</button>
                : <>
                <button className={`${styles.addToCart}`} onClick={()=>orderProcces()}>Добавить в корзину</button>
                 <button className={`${styles.buyNow}`} onClick={()=>orderProcces()}>Купить сейчас</button>
                </> 
                }
                 
                 </div>

                 <div className={`${styles.delivery}`}>
                 <span>{product?.deliveryTerm} </span> доставка со склада WB
                 </div>
                 
            </div>

                <div className={`${styles.store}`}>
                    <span className={`${styles.icon}`}>
                    </span>
                    <div className={`${styles.content}`}>
                        <div className={`${styles.name}`}>
                        {product?.store[0]?.name} 
                        </div>
                        <div className={`${styles.description}`}>
                        100% проверенные товары
                        </div>
                    </div>
                    <span className={styles.infoIcon}>
                        <img src="data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M15.5%208C15.5%2012.1421%2012.1421%2015.5%208%2015.5C3.85786%2015.5%200.5%2012.1421%200.5%208C0.5%203.85786%203.85786%200.5%208%200.5C12.1421%200.5%2015.5%203.85786%2015.5%208Z%22%20stroke%3D%22%238B8B8B%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M8%204H8.01%22%20stroke%3D%22%238B8B8B%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M8%207V12%22%20stroke%3D%22%238B8B8B%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3C%2Fsvg%3E%0A" alt="" />
                    </span>
                </div>
                <div className={`${styles.anotherPrice}`}>
                    У других продавцов от <b>{product?.differentPrice} ₽</b>
                </div>
            </div>

            </div>
            <div className={`${styles.certificateVeriffied}`}>
                   <p className={styles.veriffied}>
                    <img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2220%22%20fill%3D%22none%22%3E%3Cpath%20stroke%3D%22%23242424%22%20stroke-width%3D%221.5%22%20d%3D%22M13.984%203.794c.74.15%201.187.616%201.22%201.108.224%203.203-.13%2010.206-6.704%2013.982-.31.177-.69.177-1%200C.926%2015.108.572%208.104.795%204.902c.035-.492.481-.958%201.22-1.108%202.023-.41%203.857-1.418%205.031-2.181a1.784%201.784%200%200%201%201.908%200c1.175.763%203.008%201.77%205.03%202.181Z%22%2F%3E%3Cpath%20stroke%3D%22%23242424%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-miterlimit%3D%2210%22%20stroke-width%3D%221.5%22%20d%3D%22m11.744%207.5-4.726%204.948-2.095-2.187%22%2F%3E%3C%2Fsvg%3E" alt="" />
                    <span>Качество подтверждено</span>
                    </p>    
                    <p>
                    Вся информация основывается на последних сведениях от производителя
                    </p>                     
            </div>
            
           
            
        </div>
        <div className={`${styles.deliveryTermsMobile}`}>
                <h3>{product?.deliveryTerm}</h3>
                <p>
                    доставка со склада WB
                </p>
        </div>
        <div className={`${styles.storeInfo}`}>
                <span className={styles.storeName}>
                    {product?.store[0].name}
                    <img src="data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fillRule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M15.979%200%207.272%208.723%204.63%206.117%203%207.725l4.272%204.213L16%203.208V16H0V0h15.979Z%22%20fill%3D%22%23CB11AB%22%2F%3E%3C%2Fsvg%3E" alt="" />
                </span>
                <p>
                    100% проверенные товары
                </p>
        </div>
        <div className={`${styles.mobileActionsWrapper}`}>
            <div className={`${styles.mobileActions}`}>
            { 
                isInCart 
                ? <button className={`${styles.buyNow} ${styles.toCart}`} onClick={()=>navigate('/lk/basket')}>Перейти в корзину</button>
                : <>
                 <button className={`${styles.buyNow}`} onClick={()=>orderProcces()}>Купить сейчас</button>
                <button  className={`${styles.addToCart}`} onClick={()=>orderProcces()}>В корзину</button>
                </>
                }

               
            </div>
            <div className={`${styles.deliveryTerms}`}>
                Доставка <span>{product?.deliveryTerm}</span>
            </div>
        </div>
       </>}

        {isLoading && isPhone === 'true' &&  <>
        <div className={`${styles.loaderWrapper}`}>
        </div>
        <div className={`${styles.loader}`}></div>
        
        </>}
        
        
      </div>
    </>
  )
}

export default Product
