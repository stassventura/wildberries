import React, { useState, useEffect } from 'react';
import styles from './Address.module.scss'
import { YMaps, Map, Placemark } from 'react-yandex-maps';
import axios from 'axios';
import OutsideClickHandler from 'react-outside-click-handler';
import pointsList from './pointsList.json'
interface Props{
  setIsDeliveryMethodActive: (value: boolean) => void;
  setDeliveryMethod: (value: string) => void;
  deliveryMethod: string;
  setDeliveryAddress: (value: string) => void;
  deliveryAddress: string
}

const deliveryMethods = [
  {slug: 'point', name: 'Пункт выдачи'},
  {slug: 'courier', name: 'Курьером'},
]



const SelectAddress = ({setIsDeliveryMethodActive, deliveryMethod, setDeliveryMethod, setDeliveryAddress, deliveryAddress}: Props) => {
  const [markCoords, setMarkCoords] = useState<[number, number] | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [city, setCity] = useState('')
  const [isPrivateHouse, setIsPrivateHouse] = useState(false)
  const [isAddressDetailsActive, setIsAddressDetailsActive] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>([55.76, 37.64]); 
  const [mapZoom, setMapZoom] = useState<number>(10);
  const [appartament, setAppartament] = useState('')
  const [entrance, setEntrance] = useState('')
  const [intercom, setIntercom] = useState('')
  const [floor, setFloor] = useState('')
  const [isHouse, setIsHouse] = useState('')
  const [isRussia, setIsRussia] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [isMapLoading, setIsMapLoading] = useState(false)

  const handleMapClick = async (e: any) => {
    const coords = e.get('coords');
    setMarkCoords(coords);
    setIsAddressDetailsActive(true)
    const result = await getAddress(coords);

};
const logAddressInfo = async (coords: [number, number]) => {
  const result = await getAddress(coords);

};

  useEffect(() => {
    if(deliveryMethod === 'point'){
      setIsMapLoading(true)
    }
  }, [deliveryMethod])

  useEffect(() => {
    if(isMapLoading){
      setTimeout(() => {
        setIsMapLoading(false)
      }, 4000);
    }
  }, [isMapLoading])
  
  useEffect(() => {
    setDeliveryMethod('courier')
  }, [setDeliveryMethod])
  
  useEffect(() => {
    if(isPrivateHouse){
      setAppartament('Номер')
    }else{
      setAppartament('')

    }
  }, [isPrivateHouse])
  
  const getAddress = async (coords: [number, number]) => {
    const API_KEY = process.env.REACT_APP_YANDEX_API;
    const url = `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${API_KEY}&geocode=${coords[1]},${coords[0]}`;

    try {
        const response = await axios.get(url);
        const geoObject = response.data.response.GeoObjectCollection.featureMember[0].GeoObject;
        const kind = geoObject.metaDataProperty.GeocoderMetaData.kind;
        const isAddress = (kind === "house" || kind === "entrance");

        const components = geoObject.metaDataProperty.GeocoderMetaData.Address.Components;

        const city = components.find((component: any) => component.kind === "locality")?.name;
        const street = components.find((component: any) => component.kind === "street")?.name;
        const house = components.find((component: any) => component.kind === "house")?.name;
        const district = components.find((component: any) => component.kind === "district")?.name; 

        let formattedAddress = "";
        if (street) {
            formattedAddress += `${street}`;
            if (city) setCity(city);

        } else if (district) { 
            formattedAddress += `${city}, ${district}`;
            setCity('');

        }
        if (isAddress && house) {
            formattedAddress += `, ${house}`;
        }

        const country = response.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails.Country.CountryNameCode;
        const isRussia = (country === "RU");
        setDeliveryAddress(formattedAddress)
        setIsHouse(`${isAddress}`)
        setIsRussia(`${isRussia}`)
        return { address: formattedAddress, isAddress, isRussia };
    } catch (error) {
        console.error("Ошибка при получении адреса:", error);
        return null;
    }
};
const formatSuggestions = (suggestionsData: any[]) => {
  if (!suggestionsData || !Array.isArray(suggestionsData)) {
    return [];
  }

  return suggestionsData.map(suggestion => {
    const titleText = suggestion.title?.text || "";
    const subtitleText = suggestion.subtitle?.text || "";
    return `${titleText}, ${subtitleText}`;
  });
};


  const getCoordinatesFromAddress = async (address: string) => {
    const API_KEY = '86dbbec5-614b-4106-8958-f4b20a4c251b';
    const url = `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${API_KEY}&geocode=${address}`;

    try {
        const response = await axios.get(url);
        const geoObject = response.data.response.GeoObjectCollection.featureMember[0].GeoObject;
        const coordinates = geoObject.Point.pos.split(' ').map(Number).reverse(); 

        logAddressInfo(coordinates);
        getAddress(coordinates)
        setMarkCoords(coordinates);
        setIsAddressDetailsActive(true)
        setMapCenter(coordinates);
        setMapZoom(18); 

        return coordinates;
    } catch (error) {
        console.error("Ошибка при получении координат:", error);
        return null;
    }
};

const handleKeyDown = (e: any) => {
  if (e.key === 'ArrowDown') {
    if (activeSuggestionIndex < suggestions.length - 1) {
      setActiveSuggestionIndex(activeSuggestionIndex + 1);
      setSearchValue(suggestions[activeSuggestionIndex + 1]);
    }
  } else if (e.key === 'ArrowUp') {
    if (activeSuggestionIndex > 0) {
      setActiveSuggestionIndex(activeSuggestionIndex - 1);
      setSearchValue(suggestions[activeSuggestionIndex - 1]);
    }
  } else if (e.key === 'Enter') {
    if (activeSuggestionIndex >= 0) {
      handleSuggestionClick(suggestions[activeSuggestionIndex]);
    } else {
      getCoordinatesFromAddress(searchValue);
    }
  }
};

const handleInputKeyPress = (event: any) => {
  if (event.key === 'Enter') {
    getCoordinatesFromAddress(searchValue);
    setSuggestions([]);
  }
};


const fetchSuggestions = async (query: string) => {
  if (!query.trim()) {
    return [];
  }
  const API_KEY = '67911bea-6ac8-413b-914b-7d487187f5fe';
  const url = `https://suggest-maps.yandex.ru/v1/suggest?apikey=${API_KEY}&text=${query}&results=5&lang=ru_RU&type=house`;
  
  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error("Ошибка при получении подсказок:", error);
    return [];
  }
};


const handleInputChange = async (event: any) => {
  setSearchValue(event.target.value);
  
  const rawSuggestions = await fetchSuggestions(event.target.value);
  const formattedSuggestions = formatSuggestions(rawSuggestions);
  setSuggestions(formattedSuggestions);
};

const saveAddress = () =>{
  if(appartament === ''){
    return
  }
  let formattedAdress = `${city}, ${deliveryAddress}`
  if(appartament){
    formattedAdress += `, кв. ${appartament}`;
  }
  if(entrance){
    formattedAdress += `, ${entrance} подъезд`;
  }
  if(floor){
    formattedAdress += `, ${floor} этаж`;

  }

  setDeliveryAddress(formattedAdress)
  setIsDeliveryMethodActive(false)
}

const setCords = () =>{
  setIsDeliveryMethodActive(false)

}

const handleSuggestionClick = (suggestion: string) => {
  setSearchValue(suggestion); 
  setSuggestions([]); 
  getCoordinatesFromAddress(suggestion); 
};

const handleInputFocus = async () => {
  if (searchValue.trim() !== "") {
    const rawSuggestions = await fetchSuggestions(searchValue);
    const formattedSuggestions = formatSuggestions(rawSuggestions);
    setSuggestions(formattedSuggestions);
  }
};

const highlightMatches = (suggestion: any, input: any) => {
  const inputWords = input.split(' ').filter((word: any) => word.trim().length > 0);
  let highlightedSuggestion = suggestion;

  for (const word of inputWords) {
    const regex = new RegExp(`(${word})`, 'gi'); 
    highlightedSuggestion = highlightedSuggestion.replace(regex, '<b>$1</b>');
  }

  return highlightedSuggestion;
};

  const onPointClick = (point: string) =>{
    setDeliveryMethod('point')
    setDeliveryAddress(point)
    setIsDeliveryMethodActive(false)
  }
  return (
    <>
      <div className={styles.wrapper} >
        <span onClick={()=>{setIsDeliveryMethodActive(false); setDeliveryMethod(''); setDeliveryAddress('')}} className={styles.closeMenu}>Закрыть</span>
        <span onClick={()=>{setIsDeliveryMethodActive(false); setDeliveryMethod(''); setDeliveryAddress('')}} className={styles.closeMenuMobile}></span>
        {deliveryMethod === 'courier' && <>
        <div>
          <YMaps>
                <Map 
                  state={{ center: mapCenter, zoom: mapZoom  }} 
                  className={styles.mapContainer}
                  modules={["SuggestView"]}
                  onClick={handleMapClick}  
                >
              {markCoords && <Placemark geometry={markCoords} />}
            </Map>
          </YMaps>
        </div>
        </>}
        {deliveryMethod === 'point' && <div className={styles.mapPlaceholder}>
          <img src="https://i.ibb.co/L548NG7/Screenshot-10.png" alt="" />
          {isMapLoading ? <div className={`${styles.loader}`}></div> : <div className={styles.error}>Ошибка загрузки карты. Повторите попытку позже</div>}
          
          
        </div>}
        
      {deliveryMethod === 'courier' && 
                <div className={`${styles.searchAddressGroup}`}>
                <input 
                type="text" 
                className='form-control' 
                placeholder='Введите адрес'
                value={searchValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onKeyPress={handleInputKeyPress}
                onFocus={handleInputFocus}

                />
          <button className={styles.findAddress}>Найти</button>
          {searchValue!== '' && suggestions.length > 0 && (

          <>
          <OutsideClickHandler onOutsideClick={()=>setSuggestions([])}>
          <div className={styles.suggestionsList}>
            {suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className={`${styles.suggestionItem} ${index === activeSuggestionIndex ? styles.active : ''}`}
                onClick={() => handleSuggestionClick(suggestion)}
                dangerouslySetInnerHTML={{ __html: highlightMatches(suggestion, searchValue) }}
              />
            ))}
          </div>
          </OutsideClickHandler>

          </>
          )}

      </div>}
      <div className={`${styles.Sidebar}`}>
        <h1 className={`${styles.title}`}>Выберите способ доставки</h1>
        <div className={`${styles.tabsSwitch}`}>
          {deliveryMethods.map((item)=>(
            <div className={`${styles.tabItem} ${deliveryMethod === item.slug ? styles.activeTab : ''}`} key={item.slug} onClick={()=>setDeliveryMethod(item.slug)}>
              {item.name}
          </div>
          ))}
        </div>

        {deliveryMethod === 'courier' && <>
            <div className={`${styles.notSpecified}`}>
              <p><b>Куда привезти заказ?</b></p>
              <p>Укажите адрес на карте или найдите с помощью поиска</p>
            </div>
        </>}

        {deliveryMethod === 'point' && <>
        <div className={`${styles.pointsListContainer}`}>
        <div className={`${styles.pointsList}`}>
              {pointsList.map((item, index)=>(
                <div className={`${styles.pointItem}`} key={index} onClick={()=>onPointClick(item.address)}>
                <div className={`${styles.address}`}>
                {item.address}
                </div>
                <div className={`${styles.info}`}>
                  <span className={styles.rating}>{item.rating}</span> 
                </div>
            </div>
              ))}
            </div>

        </div>
           
        </>}
      </div>

      <div className={`${styles.addressDetails} ${isAddressDetailsActive ? styles.active: ''}`}>
        <p className={`${styles.addressStreet} ${city === '' ? styles.notFound: ''}`}>
        {deliveryAddress}
        </p>
        <p className={styles.city}>
        {city}
        </p>
          {isRussia === 'true' ? <>
          {isHouse === 'true' ? <>
          <div className={`${styles.form}`}>
          <div className={`${styles.appartament}`}>
            <div className={`${styles.inputGroup}`}>
            <p className={styles.title}>Квартира / офис</p>
            <input type="text" placeholder='Номер' value={appartament} onChange={(e)=>setAppartament(e.target.value)} disabled={isPrivateHouse} className={`${isPrivateHouse ? styles.disable: ''}`}/>
            </div>
           <div className={`${styles.checkboxWrapper}`}>
            <span className={`${styles.checkbox} ${isPrivateHouse ? styles.checkboxActive : ''}`} onClick={()=>setIsPrivateHouse(!isPrivateHouse)}></span>
            <span className={styles.label}>Частный дом</span>
           </div>
          </div>
            <div className={`${styles.additionalInformation}`}>
              <p className={`${styles.title}`}>Доп. информация для курьера</p>

              <div className={`${styles.additionalInfoInputs}`}>
              <div className={`${styles.inputGroup}`}>
              <p className={styles.title}>Подъезд</p>
              <input type="text" placeholder='Номер' value={entrance} onChange={(e)=>setEntrance(e.target.value)}/>
              </div>
              <div className={`${styles.inputGroup}`}>
              <p className={styles.title}>Домофон</p>
              <input type="text" placeholder='Номер' value={intercom} onChange={(e)=>setIntercom(e.target.value)}/>
              </div>
              <div className={`${styles.inputGroup}`}>
              <p className={styles.title}>Этаж</p>
              <input type="text" placeholder='Номер' value={floor} onChange={(e)=>setFloor(e.target.value)}/>
              </div>
              </div>
            </div>

            <button className={`${styles.selectAddress} ${appartament !== '' ? styles.activeBtn: ''}`} onClick={()=>saveAddress()}>Выбрать</button>
        </div>
          
          </> : <>
            <div className={`${styles.deliveryCords}`}>
            <div className={`${styles.title}`}>Координаты доставки:</div>
            <p className={styles.cordItem}>
            Широта: <span>{Number(markCoords?.[0]).toFixed(6)}</span>
            </p>
            <p className={styles.cordItem}>
            Широта: <span>{Number(markCoords?.[1]).toFixed(6)}</span>
            </p>
            <p className={styles.msgCoords}>
            Будьте внимательны, доставка будет осуществлена по выбранной точке на карте!
            </p>

            <button className={`${styles.selectAddress}`} onClick={()=>setCords()}>Выбрать</button>
            </div>
           
          </>}
         
          </> : <>
          
          <div className={`${styles.deliveryCords}`}>
            <div className={`${styles.title}`}>Координаты доставки:</div>
            <p className={styles.cordItem}>
            Широта: <span>{Number(markCoords?.[0]).toFixed(6)}</span>
            </p>
            <p className={styles.cordItem}>
            Широта: <span>{Number(markCoords?.[1]).toFixed(6)}</span>
            </p>
            <p className={styles.msgCoords}>
            Доставка недоступна
            </p>

            <button className={`${styles.inactiveBtn} ${appartament !== '' ? styles.activeBtn: ''}`}>Выбрать</button>
            </div>
          
          </>}
        
        <div className={styles.close} onClick={()=>setIsAddressDetailsActive(false)}></div>
      </div>
      
      </div>

    </>
  )
}

export default SelectAddress
