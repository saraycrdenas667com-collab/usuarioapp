// Componente Modal con el formulario de notas para capturar, editar o eliminar una nota
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { Note } from "../../domain/note.entity";
import { createNote, deleteNote, updateNote } from "../../infraestructure/notesDatasource";

interface Props {
  noteSelected: Note | null;
  onClose: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}

export function NoteForm({ noteSelected, onClose, onSaved, onDeleted }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Determinar si es edición (tiene id) o nueva nota (id vacío)
  const isEditing = Boolean(noteSelected && noteSelected.id !== "");

  useEffect(() => {
    if (noteSelected) {
      setTitle(noteSelected.title);
      setDescription(noteSelected.description ?? "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [noteSelected]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Campo requerido", "Por favor ingresa un título para la nota.");
      return;
    }

    setLoading(true);
    let success = false;
 
    if (isEditing && noteSelected) {
      const updated = await updateNote({
        ...noteSelected,
        title: title.trim(),
        description: description.trim() || null,
      });
      success = updated !== null;
    } else {
      const created = await createNote(title.trim(), description.trim());
      success = created !== null;
    }

    setLoading(false);

    if (success) {
      onSaved();
      onClose();
    } else {
      Alert.alert("Error", "No se pudo guardar la nota. Intenta de nuevo.");
    }
  };

  const handleDelete = () => {
    if (!noteSelected || !isEditing) return;

    Alert.alert(
      "Eliminar nota",
      "¿Estás seguro de que deseas eliminar esta nota?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            const deleted = await deleteNote(noteSelected.id);
            setLoading(false);

            if (deleted) {
              onDeleted();
              onClose();
            } else {
              Alert.alert("Error", "No se pudo eliminar la nota.");
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={noteSelected !== null}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.heading}>
            {isEditing ? "Editar Nota" : "Nueva Nota"}
          </Text>

          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            placeholder="Escribe el título..."
            value={title}
            onChangeText={setTitle}
            editable={!loading}
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Escribe los detalles de tu nota..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!loading}
          />

          {loading ? (
            <ActivityIndicator size="large" color="#2563EB" style={{ marginVertical: 16 }} />
          ) : (
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.button, styles.saveBtn]} onPress={handleSave}>
                <Text style={styles.saveText}>
                  {isEditing ? "Actualizar" : "Guardar"}
                </Text>
              </TouchableOpacity>

              {isEditing && (
                <TouchableOpacity style={[styles.button, styles.deleteBtn]} onPress={handleDelete}>
                  <Text style={styles.deleteText}>Eliminar</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={onClose}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 14,
    backgroundColor: "#F9FAFB",
  },
  textArea: {
    height: 100,
  },
  actions: {
    gap: 10,
    marginTop: 6,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  saveBtn: {
    backgroundColor: "#2563EB",
  },
  saveText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  deleteBtn: {
    backgroundColor: "#FEE2E2",
  },
  deleteText: {
    color: "#DC2626",
    fontWeight: "700",
    fontSize: 15,
  },
  cancelBtn: {
    backgroundColor: "#F3F4F6",
  },
  cancelText: {
    color: "#4B5563",
    fontWeight: "600",
    fontSize: 15,
  },
});