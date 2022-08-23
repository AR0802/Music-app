import React, { useContext } from 'react'

import NavigationItem from './NavigationItem/NavigationItem'
import { AuthContext } from '../../../context/AuthContext'
import './NavigationItems.css'

const NavigationItems = props => {
    const auth = useContext(AuthContext)
    
    return (
        <div className='NavigationItems'>
            <NavigationItem link='/'>Главная</NavigationItem>
            <NavigationItem link='/search'>Поиск</NavigationItem>
            <NavigationItem link='/collection/tracks'>Любимые треки</NavigationItem>
            <NavigationItem link='/collection/playlists'>Любимые плейлисты</NavigationItem>
            <NavigationItem link={'/add-playlist?cid=' + auth.userId}>Создать плейлист</NavigationItem>
            {
                auth.status === 'gmrqgjqerpgjeogjgpoiqejhpqiehjqkmglrmvqemrvklq' ? (
                    <>
                        <NavigationItem link='/admin/add-track'>Добавить трек</NavigationItem>
                        <NavigationItem link='/admin/add-playlist'>Добавить плейлист</NavigationItem>
                    </> 
                ) : null
            }
        </div>
    )
}

export default NavigationItems