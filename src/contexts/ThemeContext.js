import React, { createContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ThemeContext = createContext()

const ThemeContextProvider = ({ children }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(false)
    const [hasTheme, setHasTheme] = useState(false)

    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme)
    }

    const getTheme = () => {
        AsyncStorage.getItem('theme').then((result) => {
            if (result === 'true') {
                setIsDarkTheme(true)
            }
            setHasTheme(true)
        })
    }

    useEffect(() => {
        getTheme()
    }, [])

    useEffect(() => {
        if (hasTheme)
            AsyncStorage.setItem('theme', JSON.stringify(isDarkTheme))
    }, [isDarkTheme])

    return <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>{ children }</ThemeContext.Provider>

}

export { ThemeContext, ThemeContextProvider }