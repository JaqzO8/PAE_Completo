import { Plus } from "lucide-react";
import { Button, Skeleton } from "../../../desingSystem/primitives";
import { GroupCard } from "./GroupCard";
import { useTeacherGroups } from "../hooks/useTeacherGroups";
import styles from "./groups.module.css";

export function TeacherGroupList() {
  const { groups, isLoading, deleteGroup } = useTeacherGroups();

  if (isLoading) {
    return (
      <div className={styles.groupsGrid}>
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary-contrast">Mis Grupos de Estudio</h1>
          <p className="text-muted-foreground">Administra tus comunidades y alumnos.</p>
        </div>
        <Button className={styles.createButton}>
          <Plus className="h-4 w-4" /> Crear Grupo
        </Button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
          No tienes grupos activos. ¡Crea uno para empezar!
        </div>
      ) : (
        <div className={styles.groupsGrid}>
          {groups.map((group) => (
            <GroupCard 
              key={group.id} 
              group={group} 
              role="docente" 
              onDelete={deleteGroup} 
            />
          ))}
        </div>
      )}
    </div>
  );
}