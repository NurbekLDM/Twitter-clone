import { useRouter } from 'next/router'

export default function LanguageSwitcher() {
 
  const router = useRouter()
  
  const changeLanguage = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale })
  }
  
  return (
    <div>
      <button onClick={() => changeLanguage('uz')}>O`zbek</button>
      <button onClick={() => changeLanguage('ru')}>Русский</button>
      <button onClick={() => changeLanguage('en')}>English</button>
    </div>
  )
}