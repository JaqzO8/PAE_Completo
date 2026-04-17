import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  MessageSquare,
  HelpCircle,
  BarChart3,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import {
  Button,
  Input,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  Skeleton,
  ScrollArea,
} from "../../../desingSystem/primitives";
import { ParticipantsSheet } from "../../../features/groups/components/ParticipantsSheet";
import { getGroupDetail, type GroupDetail as GroupDetailType } from "../../../features/groups/services/groupsService";
import { useToast } from "../../../hooks/useToast";
import styles from "../../../features/groups/components/groups.module.css";

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [group, setGroup] = useState<GroupDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    loadGroupDetail();
  }, [id]);

  const loadGroupDetail = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await getGroupDetail(id);
      setGroup(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cargar el grupo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    toast({
      title: "Mensaje enviado",
      description: "Tu mensaje ha sido publicado en el chat.",
    });
    setMessage("");
  };

  const handleLeaveGroup = () => {
    toast({
      title: "Saliste del grupo",
      description: "Has abandonado esta comunidad.",
    });
    navigate("/docente/grupos");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <p>No se encontró el grupo</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Botón de Regreso */}
      <Button
        variant="ghost"
        className="gap-2 pl-0 hover:bg-transparent text-neutral-600 hover:text-brand-action"
        onClick={() => navigate("/docente/grupos")}
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Mis Comunidades
      </Button>

      {/* Contenedor Principal estilo Chat */}
      <div className={styles.chatContainer}>
        {/* Header Clickeable */}
        <div
          className={styles.chatHeader}
          onClick={() => setShowParticipants(true)}
        >
          <Avatar className={styles.chatHeaderAvatar}>
            <AvatarImage src={group.avatar} alt={group.name} />
            <AvatarFallback className="bg-white/30 text-white font-bold">
              {group.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className={styles.chatHeaderInfo}>
            <h1 className={styles.chatHeaderTitle}>{group.name}</h1>
            <p className={styles.chatHeaderStatus}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {group.status}
            </p>
          </div>
        </div>

        {/* Tabs de Navegación */}
        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <TabsList className={styles.chatTabs}>
            <TabsTrigger value="chat" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="forums" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              Foros
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analítica
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Chat */}
          <TabsContent value="chat" className="flex-1 flex flex-col m-0">
            <ScrollArea className={styles.chatMessages}>
              {group.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.messageBubble} ${
                    msg.authorRole === "docente" ? styles.messageBubbleTeacher : ""
                  }`}
                >
                  <Avatar className={styles.messageAvatar}>
                    <AvatarImage src={msg.avatar} alt={msg.author} />
                    <AvatarFallback className="bg-neutral-200 text-neutral-600 text-xs font-bold">
                      {msg.author.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className={styles.messageContent}>
                    <span className={styles.messageAuthor}>{msg.author}</span>
                    <div
                      className={`${styles.messageText} ${
                        msg.authorRole === "docente" ? styles.messageTextTeacher : ""
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className={styles.messageTime}>{msg.timestamp}</span>
                  </div>
                </div>
              ))}
            </ScrollArea>

            {/* Input de Mensaje */}
            <div className={styles.chatInput}>
              <Input
                placeholder="Escribe un mensaje..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className={styles.chatInputField}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className={styles.chatSendButton}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </TabsContent>

          {/* TAB 2: Foros */}
          <TabsContent value="forums" className="flex-1 m-0">
            <div className={styles.forumList}>
              {group.forums.map((forum) => (
                <div key={forum.id} className={styles.forumItem}>
                  <div className={styles.forumHeader}>
                    <Avatar className={styles.forumAvatar}>
                      <AvatarImage src={forum.authorAvatar} alt={forum.author} />
                      <AvatarFallback className="bg-neutral-100 text-neutral-600 font-bold text-xs">
                        {forum.author.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className={styles.forumTitle}>{forum.title}</h3>
                      <div className={styles.forumMeta}>
                        <span>Por {forum.author}</span>
                        <span>•</span>
                        <span>{forum.replies} respuestas</span>
                        <span>•</span>
                        <span>{forum.lastReply}</span>
                      </div>
                    </div>
                    {forum.isResolved && (
                      <div className={styles.forumResolved}>
                        <CheckCircle className="h-4 w-4" />
                        Resuelto
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB 3: Analítica (Solo Docente) */}
          <TabsContent value="analytics" className="flex-1 m-0">
            <div className={styles.analyticsGrid}>
              <Card className={styles.analyticsCard}>
                <h3 className={styles.analyticsTitle}>Mensajes Totales</h3>
                <p className={styles.analyticsStat}>{group.analytics.totalMessages}</p>
                <p className={styles.analyticsSubtext}>En los últimos 30 días</p>
              </Card>

              <Card className={styles.analyticsCard}>
                <h3 className={styles.analyticsTitle}>Miembros Activos</h3>
                <p className={styles.analyticsStat}>{group.analytics.activeMembers}</p>
                <p className={styles.analyticsSubtext}>
                  de {group.membersCount} totales
                </p>
              </Card>

              <Card className={styles.analyticsCard}>
                <h3 className={styles.analyticsTitle}>Tiempo de Respuesta Promedio</h3>
                <p className={styles.analyticsStat}>{group.analytics.avgResponseTime}</p>
                <p className={styles.analyticsSubtext}>Entre mensajes</p>
              </Card>

              <Card className={styles.analyticsCard}>
                <h3 className={styles.analyticsTitle}>Tasa de Participación</h3>
                <div className="flex items-center gap-2">
                  <p className={styles.analyticsStat}>
                    {group.analytics.participationRate}%
                  </p>
                  <TrendingUp className="h-5 w-5 text-success-progress" />
                </div>
                <p className={styles.analyticsSubtext}>+5% vs mes anterior</p>
              </Card>

              {/* Top Contributors */}
              <Card className={`${styles.analyticsCard} md:col-span-2`}>
                <h3 className={styles.analyticsTitle}>Principales Contribuidores</h3>
                <div className={styles.contributorsList}>
                  {group.analytics.topContributors.map((contributor, index) => (
                    <div key={index} className={styles.contributorItem}>
                      <Avatar className={styles.contributorAvatar}>
                        <AvatarImage src={contributor.avatar} alt={contributor.name} />
                        <AvatarFallback className="bg-brand-action/10 text-brand-action font-bold text-xs">
                          {contributor.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={styles.contributorInfo}>
                        <p className={styles.contributorName}>{contributor.name}</p>
                        <p className={styles.contributorMessages}>
                          {contributor.messages} mensajes
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sheet de Participantes */}
      <ParticipantsSheet
        open={showParticipants}
        onOpenChange={setShowParticipants}
        participants={group.participants}
        groupName={group.name}
        onLeave={handleLeaveGroup}
      />
    </div>
  );
}