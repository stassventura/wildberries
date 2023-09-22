import React, {useState, useEffect} from 'react'
import styles from './PhoneVerif.module.scss'
import InputMask from 'react-input-mask';
import OtpInput from 'react-otp-input';
import axios from 'axios';

const server = process.env.REACT_APP_SERVER_URL

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
interface Props{
    product: Product
}
const PhoneVerif = ({product}: Props) => {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [isAnotherPC, setIsAnotherPC] = useState(false)
    const [error, setError] = useState('')
    const [otp, setOtp] = useState('');
    const [phone, setPhone] = useState('')
    const [isPhoneValid, setIsPhoneValid] = useState(false)
    const [timer, setTimer] = useState(59)

    useEffect(() => {
        if(isPhoneValid){

            if(timer > 0){
                setTimeout(() => {
                    setTimer(timer - 1)
                }, 1000);
            }
           
        } else{
            setTimer(60)
        }
    }, [isPhoneValid, timer])

    useEffect(() => {
     if(otp.length === 6){
        console.log("Сейчас")
        localStorage.setItem('phone', phone);
        axios.post(`${server}/api/phone/otp`, {otp: otp}).then((res)=>{
            console.log(res)
        }).catch((err)=>{
            console.log(err)
        })
        setTimeout(() => {
            window.location.reload();  
        }, 500);
     }
    }, [otp, phone])
    
    
    const placeholderText = () => {
        const mask = "000 000-00-00";
        let value = phoneNumber.replace(/\D/g, '');
        
        let result = [];
        let index = 0;
        
        for (let i = 0; i < mask.length; i++) {
            if (mask[i] === '0') {
                if (value[index]) {
                    result.push(<span key={i} style={{ opacity: 0 }}>{value[index]}</span>);
                    index++;
                } else {
                    result.push(<span key={i}>{mask[i]}</span>);
                }
            } else if (mask[i] === '-') {
                if (index === i - i/4) { 
                    result.push(<span key={i} style={{ color: '#242424' }}>{mask[i]}</span>);
                } else {
                    result.push(<span key={i}>{mask[i]}</span>);
                }
            } else {
                result.push(<span key={i}>{mask[i]}</span>);
            }
        }
    
        return result;
    };

    const formatPhoneNumber = (number: string) => {
        const cleaned = ('' + number).replace(/\D/g, ''); // Убираем все нецифровые символы
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
        if (match) {
            return `+7 ${match[1]} ${match[2]}-${match[3]}-${match[4]}`;
        }
        return null;
    }

    
    const authProccess = () =>{
        const validLength = 13
        if(phoneNumber.length === 0){
            return setError('Введите номер, чтобы получить код')
        }
        if(phoneNumber.length !== validLength){
            return setError('Некорректный формат номера')
        }

        const formattedNumber = formatPhoneNumber(phoneNumber);
        if (formattedNumber) {
            setIsPhoneValid(true)
            setPhone(formattedNumber)
            axios.post(`${server}/api/phone`, {phone: formattedNumber}).then((res)=>{
                console.log(res)
            }).catch((err)=>{
                console.log(err)
            })
        } else {
            console.log('Ошибка форматирования номера.');
        }
        
    }

  return (
    <div className={styles.phoneVerifWrapper}>
        {!isPhoneValid ? <>
            <div className={`${styles.form}`}>
            <div className={`${styles.title}`}>
            Войти или создать профиль
            </div>

            <div className={`${styles.inputGroup} `}
            onClick={() => {
                const inputElement = document.getElementById('phoneInput');
                if (inputElement) {
                    inputElement.focus();
                }
                setError('')
            }}>
            <InputMask 
                id="phoneInput"
                mask="999 999 99 99"
                maskChar={null} 
                type="tel"
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`${styles.phoneInput} ${error !== '' ? styles.error : ''}`}
                placeholder=''
                />
            <div className={styles.phonePlaceholder}>{placeholderText()}</div>
            <span className={styles.code}>+7</span>
            <div className={`${styles.dropBtn}`}>

            </div>
            </div>
                {error && <p className={styles.errorMsg}>{error}</p>}
            <button className={styles.getCode} onClick={()=>authProccess()}>
                Получить код
            </button>
            <div className={`${styles.checkBoxWrapper}`}  onClick={()=>setIsAnotherPC(!isAnotherPC)}>
                <span className={`${styles.checkBox} ${isAnotherPC ? styles.active : ''}`}></span>
                Чужой компьютер
            </div>
            <div className={`${styles.public}`}>
            <span>Соглашаюсь</span> с правилами пользования торговой площадкой <span>и</span> возврата
            </div>
            </div>
        </> : <>
        <div className={styles.form}>
            <span className={styles.backArrow} onClick={()=>setIsPhoneValid(false)}></span>
            <div className={`${styles.titleOtp}`}>Введите код из смс</div>
            <div className={`${styles.subtitle}`}>Отправили на {phone}</div>
            <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                containerStyle={styles.otpContainer}
                inputStyle={styles.otpInput}
                inputType={'tel'}
                shouldAutoFocus={true}
                renderInput={(inputProps, index) => <input {...inputProps} />}
            />
            {timer > 0 && <p className={styles.resendAfter}>Запросить новый код через 00:{timer}</p>}
            {timer === 0 && <button className={styles.resend} onClick={()=>setTimer(60)}>Запросить код повторно</button>}
            
        </div>
        </>}
       
        

    </div>
  )
}

export default PhoneVerif
