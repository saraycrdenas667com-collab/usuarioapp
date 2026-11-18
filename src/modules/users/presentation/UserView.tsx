import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { View } from 'react-native'



import { NotesView } from '@/lib/modules/Notes/presentation/NotesView'
import Auth from './components/Auth'

 //Componente UserView
 //Propósito: Administrar el estado global de autenticación de la sesión mediante Supabase
 //y decidir qué interfaz renderizar (Autenticación o la Galería modular).
 
export function UserView() {
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | undefined>(undefined)

  useEffect(() => {
    // 1. Obtiene la sesión activa actual al montar el componente por primera vez
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id)
        setEmail(session.user.email)
      }
    })

    // 2. Escucha en tiempo real los cambios de estado (eventos de login y cierre de sesión)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id)
        setEmail(session.user.email)
      } else {
        setUserId(null)
        setEmail(undefined)
      }
    })

    // 3. Limpia la suscripción al desmontar el componente para evitar fugas de memoria
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <View style={{ flex: 1 }}>
      {/* Renderiza la pantalla de galeria en lugar de la de usuario cuando exista un id de usuario activo*/}
      {userId ? <NotesView userId={userId} email={email} /> : <Auth />}
    </View>
  )
}