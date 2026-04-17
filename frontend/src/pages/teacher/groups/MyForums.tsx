import { useState } from "react";
import { ClipboardList, Plus, Search } from "lucide-react";
import { Input, Button, Skeleton } from "../../../desingSystem/primitives";
import { ForumCard } from "../../../features/forums/components/ForumCard";
import { ForumDetailModal } from "../../../features/forums/components/ForumDetailModal";
import { useForums } from "../../../features/forums/hooks/useForums";
import styles from "../../../features/forums/components/forums.module.css";

const TeacherMyForums = () => {
  const { forums, isLoading, toggleLike, report } = useForums(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedForumId, setSelectedForumId] = useState<string | null>(null);

  const filteredForums = forums.filter(forum =>
    forum.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    forum.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReport = (forumId: string) => {
    const reason = prompt("¿Por qué deseas reportar este foro?");
    if (reason) {
      report(forumId, reason);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-action/10 rounded-xl">
            <ClipboardList className="h-6 w-6 text-brand-action" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary-contrast">Mis Foros</h1>
            <p className="text-muted-foreground">Administra las preguntas que has publicado.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar en mis foros..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button className="gap-2 bg-brand-action hover:bg-brand-action/90 whitespace-nowrap">
            <Plus className="h-4 w-4" />
            Nuevo Foro
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.forumsGrid}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-96 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredForums.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50/50">
          <ClipboardList className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
          <p className="text-lg font-medium">No has creado ningún foro</p>
          <p className="text-sm mt-2">Crea tu primera pregunta para comenzar</p>
          <Button className="mt-6 gap-2 bg-brand-action hover:bg-brand-action/90">
            <Plus className="h-4 w-4" />
            Crear Foro
          </Button>
        </div>
      ) : (
        <div className={styles.forumsGrid}>
          {filteredForums.map((forum) => (
            <ForumCard
              key={forum.id}
              forum={forum}
              onLike={toggleLike}
              onReport={handleReport}
              onClick={setSelectedForumId}
            />
          ))}
        </div>
      )}

      {selectedForumId && (
        <ForumDetailModal 
          forumId={selectedForumId}
          onClose={() => setSelectedForumId(null)}
        />
      )}
    </div>
  );
};

export default TeacherMyForums;