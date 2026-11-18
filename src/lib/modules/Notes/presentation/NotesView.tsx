// Interfaz de usuario para la vista de notas
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { Note } from "../domain/note.entity";
import { getAllNotes } from "../infraestructure/notesDatasource";

import { NoteCard } from "./components/NoteCard";
import { NoteForm } from "./components/NoteForm";

export function NotesView({
  userId,
  email,
}: {
  userId: string | null;
  email: string | undefined;
}) {
  // Estados: notes (arreglo de notas) y noteSelected (nota activa en el modal)
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteSelected, setNoteSelected] = useState<Note | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Cargar notas desde Supabase
  const loadNotes = async () => {
    setLoading(true);
    const data = await getAllNotes();
    setNotes(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // Abrir modal con una nota vacía para crearla
  const onNewNote = () => {
    setNoteSelected({
      id: "",
      title: "",
      description: "",
      created_at: "",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mis Notas</Text>
          {email ? <Text style={styles.subtitle}>{email}</Text> : null}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={onNewNote}>
          <Text style={styles.addButtonText}>+ Nueva Nota</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" style={styles.loader} />
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NoteCard note={item} onPress={(selected) => setNoteSelected(selected)} />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No tienes notas aún. Toca "+ Nueva Nota" para crear la primera.
            </Text>
          }
        />
      )}

      {/* Modal con el formulario de notas */}
      <NoteForm
        noteSelected={noteSelected}
        onClose={() => setNoteSelected(null)}
        onSaved={loadNotes}
        onDeleted={loadNotes}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  addButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  loader: {
    marginTop: 40,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 40,
    fontSize: 15,
  },
});


