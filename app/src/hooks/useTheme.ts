import { ToggleCustomEvent } from "@ionic/core";
import { useEffect, useState } from "react";

export const getIsDark = ()=>{
  let theme =localStorage.getItem('theme');

if(theme){return theme==='dark'?true:false }else{
  localStorage.setItem('theme','dark')
  return true
}}
document.body.classList.toggle("dark", getIsDark());

const useTheme = () => {
  const [isDark, setDarkTheme] = useState(getIsDark());

  // Listen for the toggle check/uncheck to toggle the dark theme
  const toggleTheme = () => {
    setDark(!isDark);
  };

  // Add or remove the "dark" class on the document body
  const setDark = (darkMode: boolean) => {
    document.body.classList.toggle("dark", darkMode);
    document.body.setAttribute('data-theme',darkMode?'dark':'light')
    localStorage.setItem('theme',darkMode?'dark':'light')
    setDarkTheme(darkMode);
  };

  useEffect(() => {
    console.log('isDark :>> ', isDark);
  }, [isDark]);

  return { setDark, toggleTheme, isDark };
};

export default useTheme;
