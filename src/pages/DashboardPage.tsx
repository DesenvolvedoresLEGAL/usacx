
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Icons } from "@/components/icons"; // Assuming Icons.clock, Icons.star, Icons.network are available or added
import { MessageSquare, Users, Clock, BarChart2, ListChecks, Award, PieChartIcon } from "lucide-react"; // Added ListChecks, Award, PieChartIcon

const DashboardPage = () => {
  const dashboardCards = [
    { 
      title: "Atendimentos ao Vivo", 
      icon: MessageSquare, 
      color: "text-blue-500",
      content: (
        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
          <li>Cliente A - Iniciado há 2m</li>
          <li>Cliente B - Iniciado há 5m</li>
          <li>Cliente C - Iniciado há 10m</li>
          <li className="font-semibold">Ver todos...</li>
        </ul>
      )
    },
    { 
      title: "Aguardando Atendimento", 
      icon: Clock, 
      color: "text-orange-500",
      content: (
        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
          <li>Cliente X - Esperando há 3m</li>
          <li>Cliente Y - Esperando há 7m</li>
          <li>Cliente Z - Esperando há 12m</li>
          <li className="font-semibold">Ver todos...</li>
        </ul>
      )
    },
    { 
      title: "Atendimentos por Canal", 
      icon: PieChartIcon, // Using PieChartIcon from lucide-react directly
      color: "text-green-500",
      content: (
        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
          <li>WhatsApp: 150</li>
          <li>Chat Web: 80</li>
          <li>Facebook Messenger: 45</li>
          <li className="font-semibold">Ver detalhes...</li>
        </ul>
      )
    },
    { 
      title: "Agentes Online", 
      icon: Users, 
      color: "text-teal-500",
      content: (
        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
          <li>Agente 1 (3 ativos)</li>
          <li>Agente 2 (5 ativos)</li>
          <li>Agente 3 (2 ativos)</li>
          <li className="font-semibold">Ver todos...</li>
        </ul>
      ) 
    },
    { 
      title: "Agentes em Destaque", 
      icon: Award, // Using Award from lucide-react directly
      color: "text-purple-500",
      content: (
        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
          <li>Dia: Agente X (15 atend.)</li>
          <li>Semana: Agente Y (70 atend.)</li>
          <li>Mês: Agente Z (250 atend.)</li>
          <li className="font-semibold">Ver ranking completo...</li>
        </ul>
      )
    },
    { 
      title: "Satisfação (CSAT/NPS)", 
      icon: Icons.smile, // Assuming Icons.smile exists
      color: "text-yellow-500",
      content: (
        <div className="text-sm text-muted-foreground space-y-1">
          <p>CSAT: 92%</p>
          <p>NPS: 75</p>
          {/* <p>CES: 2.1</p> */}
          <p className="font-semibold pt-1">Ver relatório detalhado...</p>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboardCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              {card.content}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Reminder about Supabase */}
      <Card className="bg-blue-50 border-blue-200 mt-8">
        <CardHeader>
          <CardTitle className="text-blue-700 text-lg">Próximos Passos: Backend e Dados Dinâmicos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-600">
            Este painel agora reflete a estrutura solicitada com dados estáticos. Para funcionalidades completas,
            como listas dinâmicas, métricas em tempo real e notificações,
            será necessário integrar com o backend (FastAPI) e o banco de dados (Supabase).
          </p>
          <p className="text-sm text-blue-600 mt-2">
            Lembre-se de conectar seu projeto Lovable ao Supabase para habilitar essas funcionalidades.
            Você pode fazer isso clicando no botão verde do Supabase na interface do Lovable.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
