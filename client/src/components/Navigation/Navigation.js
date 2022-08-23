import React, { useContext } from 'react'

import NavigationItems from './NavigationItems/NavigationItems'
import Button from '../Button/Button'
import Panel from '../Panel/Panel'
import AudioPlayer from './AudioPlayer/AudioPlayer'
import { AuthContext  } from '../../context/AuthContext'
import './Navigation.css'

const Navigation = props => {
    const auth = useContext(AuthContext)

    const logoutHandler = () => {
        auth.logout()
        window.location.reload()
    }

    let panel = (
        <Panel>
            <Button class='nav-signup' link='/signup'>Зарегистрироваться</Button>
            <Button class='nav-login' link='/login'>Войти</Button>
        </Panel>
    )

    if (auth.isAuthenticated) {
        panel = (
            <Panel>
                <p className='userNameP'>{auth.userName}</p>
                <Button class='nav-login' onClick={logoutHandler}>Выйти</Button>
            </Panel>
        )
    }
    
    return (
        <>
            <div className='navItemsContainer' style={{ paddingBottom: document.documentElement.clientHeight - 350 }}>
                <NavigationItems />
            </div>
            {panel}
            <AudioPlayer home={props.home}/>
        </>
    )
}

export default Navigation