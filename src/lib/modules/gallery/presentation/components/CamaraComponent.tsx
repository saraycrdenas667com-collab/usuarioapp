import { Ionicons } from '@expo/vector-icons'; // <-- 1. Importamos Ionicons
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CameraComponentProps {
  onImageCaptured: (uri: string) => void
}

export default function CameraComponent({ onImageCaptured }: CameraComponentProps) {
   // Permisos de la cámara con expo-camera
  const [permission, requestPermission] = useCameraPermissions()
  // Función para abrir la cámara solicitando permisos primero
  const openCamera = async () => {
    if (!permission || !permission.granted) {
      const permissionResult = await requestPermission()
      if (!permissionResult.granted) {
        alert("Se necesitan permisos para usar la cámara.")
        return
      }
    }
    setCameraVisible(true)
  }
  // Estado para controlar si el visor de la cámara está abierto en pantalla completa
  const [cameraVisible, setCameraVisible] = useState(false)
  // Estado para la dirección de la cámara ('front' o 'back')
  const [facing, setFacing] = useState<'front' | 'back'>('back')

  // Función para tomar la foto usando la referencia de CameraView
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 1 })
        if (photo && photo.uri) {
          setTempUri(photo.uri)
          setPreviewVisible(true)
        }
      } catch (error) {
        console.error("Error al tomar la foto:", error)
      }
    }
  }
  // Referencia para capturar la foto con la cámara personalizada
  const cameraRef = useRef<any>(null)

  // Estados para la vista previa de la foto tomada
  const [tempUri, setTempUri] = useState<string | null>(null)
  const [previewVisible, setPreviewVisible] = useState(false)

  // Función para alternar entre cámara trasera y delantera
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'))
  }

  // Confirmar foto y mandarla al componente padre (GalleryView)
  const confirmImage = () => {
    if (tempUri) {
      onImageCaptured(tempUri)
      setPreviewVisible(false)
      setTempUri(null)
      setCameraVisible(false) // Cierra la cámara por completo al guardar
    }
  }

  return (
    <>
      {/* Botón principal en el modal de la galería para abrir tu propia cámara */}
      <TouchableOpacity style={styles.button} onPress={openCamera}>
        <Text style={styles.text}>Usar Cámara</Text>
      </TouchableOpacity>

      {/* Modal de pantalla completa para mostrar la cámara personalizada */}
      <Modal visible={cameraVisible} animationType="slide">
        <View style={styles.container}>
          {/* Visor de la cámara */}
          <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
            
            {/* Contenedor de tus botones personalizados flotantes */}
            <View style={styles.customControls}>
              
              {/* 1. Botón de Cancelar / Cerrar con icono de "close" */}
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={() => setCameraVisible(false)}
              >
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>

              {/* 2. Botón de Disparo Principal (Círculo blanco) */}
              <TouchableOpacity 
                style={styles.captureButtonOuter} 
                onPress={takePicture}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>

              {/* 3. Botón para Voltear la Cámara con icono de "camera-reverse" */}
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={toggleCameraFacing}
              >
                <Ionicons name="camera-reverse" size={28} color="#fff" />
              </TouchableOpacity>

            </View>
          </CameraView>
        </View>
      </Modal>

      {/* Modal secundario de vista previa (para confirmar o repetir la foto) */}
      <Modal visible={previewVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Vista previa</Text>
            
            {tempUri && <Image source={{ uri: tempUri }} style={styles.previewImage} />}

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.btnCancel} 
                onPress={() => setPreviewVisible(false)}
              >
                <Text style={styles.btnText}>Repetir</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.btnConfirm} 
                onPress={confirmImage}
              >
                <Text style={styles.btnText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  button: { 
    backgroundColor: '#6c5ce7', 
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
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  // Barra inferior flotante sobre la cámara para tus botones personalizados
  customControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Estilo del botón de disparo idéntico al de la foto que mandaste
  captureButtonOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  captureButtonInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#fff',
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
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