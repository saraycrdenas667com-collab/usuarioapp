//ImagePicker: La herramienta de Expo que nos permite gestionar el acceso a la galería y archivos multimedia del dispositivo.
import * as ImagePicker from 'expo-image-picker'
//Componentes de React Native: Image, Modal, StyleSheet, Text, TouchableOpacity y View para construir la interfaz del selector.
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

//ImagePickerComponentProps: Contrato de TypeScript que le exige a este componente recibir obligatoriamente una función llamada onImageSelected,
// la cual recibe un texto (uri) para entregárselo al componente padre (GalleryView) cuando se confirme la selección.
interface ImagePickerComponentProps {
  onImageSelected: (uri: string) => void
}
//Componente ImagePickerComponent: Gestiona de forma aislada los permisos, la selección de imágenes desde la galería del celular y su vista previa.
export default function ImagePickerComponent({ onImageSelected }: ImagePickerComponentProps) {
  //pickImage: Función asíncrona que solicita permisos de galería y abre la interfaz de archivos multimedia del dispositivo.
  const pickImage = async () => {
    //requestMediaLibraryPermissionsAsync(): Pide autorización formal al usuario para entrar a la galería de fotos.
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    
    //Si el usuario niega el permiso, muestra una alerta en pantalla y frena la ejecución.
    if (!permissionResult.granted) {
      alert("Se necesitan permisos para acceder a la galería.")
      return
    }

    //launchImageLibraryAsync: Abre el selector de fotos del sistema, filtrando solo imágenes y permitiendo edición/recorte.
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })

    //Si el usuario elige una foto y no cancela, guarda la ruta temporalmente y abre el modal de vista previa.
    if (!result.canceled && result.assets && result.assets.length > 0) {
      onImageSelected(result.assets[0].uri)
    }
  }

  return (
    //Fragmento vacío para retornar múltiples elementos hermanos sin alterar la estructura visual.
    <>
      {/*Botón principal estilizado en azul para activar la función pickImage al presionarlo*/}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.text}>Galería</Text>
      </TouchableOpacity>
    </>
  )
}

//styles: Objeto de estilos visuales que definen el diseño del botón de galería y del modal de vista previa interna
const styles = StyleSheet.create({
  button: { 
    backgroundColor: '#0984e3', 
    padding: 12, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginBottom: 10, 
    width: '100%' 
  },
  text: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    width: 280, 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 20, 
    alignItems: 'center' 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    color: '#2d3436' 
  },
  previewImage: { 
    width: 200, 
    height: 200, 
    borderRadius: 10, 
    marginBottom: 15 
  },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%' 
  },
  btnCancel: { 
    backgroundColor: '#d63031', 
    padding: 10, 
    borderRadius: 8, 
    flex: 1, 
    marginRight: 5, 
    alignItems: 'center' 
  },
  btnConfirm: { 
    backgroundColor: '#00b894', 
    padding: 10, 
    borderRadius: 8, 
    flex: 1, 
    marginLeft: 5, 
    alignItems: 'center' 
  },
  btnText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
})