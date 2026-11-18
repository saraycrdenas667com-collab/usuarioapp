// Componente para mostrar una nota en la vista de notas
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Note } from "../../domain/note.entity";

interface Props {
  note: Note;
  onPress: (note: Note) => void;
}

export function NoteCard({ note, onPress }: Props) {
  // Formatear fecha legible si existe
  const formattedDate = note.created_at
    ? new Date(note.created_at).toLocaleDateString()
    : "";

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(note)} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.title}>{note.title}</Text>
        {formattedDate ? <Text style={styles.date}>{formattedDate}</Text> : null}
      </View>
      {note.description ? (
        <Text style={styles.description} numberOfLines={3}>
          {note.description}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
});