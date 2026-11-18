// Image, StyleSheet, View: Componentes básicos de React Native para estructurar tarjetas visuales y pintar imágenes.
import { Image, StyleSheet, View } from 'react-native'

// ImagePreviewProps: Contrato de TypeScript que define las propiedades que este componente espera recibir obligatoriamente (en este caso, la uri de la foto).
interface ImagePreviewProps {
  uri: string
}


// Componente ImagePreview: Funciona como el elemento visual individual ("niño") que se encarga únicamente de recibir una ruta de imagen y dibujarla con estilo de tarjeta.
export default function ImagePreview({ uri }: ImagePreviewProps) {
  return (
    // imageCard: Contenedor principal con bordes redondeados y dimensiones fijas para la cuadrícula
    <View style={styles.imageCard}>
      {/* thumbnail: Pinta la imagen usando la URI recibida, ajustándola con resizeMode="cover" para que no se deforme */}
      <Image source={{ uri }} style={styles.thumbnail} resizeMode="cover" />
    </View>
  )
}

// styles: Objeto de estilos visuales que definen el tamaño, los márgenes y las esquinas redondeadas de cada tarjeta de foto
const styles = StyleSheet.create({
  imageCard: {
    flex: 1,
    margin: 8,
    height: 130,
    // maxWidth: '46%': Asegura que entren exactamente dos tarjetas por fila en la cuadrícula sin colapsar el diseño
    maxWidth: '46%', 
    backgroundColor: '#b2bec3',
    borderRadius: 16,
    // overflow: 'hidden': Corta cualquier contenido que sobresalga de los bordes redondeados de la tarjeta
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
})