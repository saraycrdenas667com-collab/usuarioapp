import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import CameraComponent from './CamaraComponent'
import ImagePickerComponent from './ImagePicker'
import ImagePreview from './ImagePreview'

export default function GalleryView() {
  const [images, setImages] = useState<string[]>([])
  const [modalVisible, setModalVisible] = useState(false)

  
  const handleAddImage = (uri: string) => {
    setImages((prev) => [uri, ...prev])
    setModalVisible(false)
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Galería</Text>
        <Text style={styles.counter}>{images.length} fotos</Text>
      </View>

      <FlatList
        data={images}
        keyExtractor={(_, index) => index.toString()}
        numColumns={2}
        style={{ flex: 1 }}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => <ImagePreview uri={item} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay fotos aún. Presiona el botón + para agregar.</Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.signOutContainer}>
        <TouchableOpacity style={styles.signOutButton} onPress={() => supabase.auth.signOut()}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Origen de la imagen</Text>
            
            <CameraComponent onImageCaptured={handleAddImage} />
            <ImagePickerComponent onImageSelected={handleAddImage} />

            <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#e6f2f5', 
    paddingTop: 60 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'baseline', 
    paddingHorizontal: 24, 
    marginBottom: 20 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#2d3436' 
  },
  counter: { 
    fontSize: 16, 
    color: '#636e72', 
    fontWeight: '600' 
  },
  grid: { 
    flexGrow: 1, 
    paddingHorizontal: 12 
  },
  emptyContainer: { 
    marginTop: 80, 
    alignItems: 'center', 
    paddingHorizontal: 40 
  },
  emptyText: { 
    textAlign: 'center', 
    color: '#b2bec3', 
    fontSize: 14 
  },
  footer: { 
    alignItems: 'center', 
    marginVertical: 16 
  },
  fab: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    backgroundColor: '#ff7675', 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 4 
  },
  fabText: { 
    fontSize: 36, 
    color: '#fff', 
    fontWeight: '300', 
    marginTop: -2 
  },
  signOutContainer: { 
    paddingHorizontal: 24, 
    paddingBottom: 20 
  },
  signOutButton: { 
    backgroundColor: '#d63031', 
    padding: 10, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  signOutText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    width: 280, 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 20, 
    alignItems: 'center', 
    elevation: 5 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#2d3436', 
    marginBottom: 16 
  },
  modalButtonCancel: { 
    width: '100%', 
    backgroundColor: '#e17055', 
    padding: 12, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 5 
  },
  modalButtonTextCancel: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
})