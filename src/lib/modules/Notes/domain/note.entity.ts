// Interfaz para Note (entidad principal)
export interface Note {
  id: string;
  title: string;
  description: string | null;
  // Es string porque en la base de datos de Supabase cuando se consulta una columna timestamptz (Timestamp with time zone)
  // serializa la fecha y la envía a través de la API como una cadena de texto
  created_at: string;
}