import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Target, 
  MessageSquare, 
  Timer, 
  Star, 
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface OperationalGoals {
  dailyConversations: number;
  avgResponseTimeSeconds: number;
  minSatisfactionRating: number;
  resolutionRate: number;
}

interface AgentProgress {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  conversationsToday: number;
  avgResponseTime: number; // in seconds
  satisfactionRating: number | null;
  resolutionRate: number;
}

const defaultGoals: OperationalGoals = {
  dailyConversations: 30,
  avgResponseTimeSeconds: 120,
  minSatisfactionRating: 4,
  resolutionRate: 85,
};

export const GoalsDashboard = ({ teamId }: { teamId?: string | null }) => {
  const { organization } = useAuth();
  const [goals, setGoals] = useState<OperationalGoals>(defaultGoals);
  const [agentProgress, setAgentProgress] = useState<AgentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamTotals, setTeamTotals] = useState({
    totalConversations: 0,
    avgResponseTime: 0,
    avgSatisfaction: 0,
    avgResolution: 0,
  });

  useEffect(() => {
    if (organization?.settings) {
      const settings = organization.settings as any;
      if (settings.operational?.goals) {
        setGoals({ ...defaultGoals, ...settings.operational.goals });
      }
    }
  }, [organization]);

  useEffect(() => {
    loadAgentProgress();
  }, [organization?.id, teamId]);

  const loadAgentProgress = async () => {
    if (!organization?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get org members
      const { data: members } = await supabase
        .from('organization_members')
        .select('user_id')
        .eq('organization_id', organization.id);

      const userIds = members?.map(m => m.user_id) || [];
      if (userIds.length === 0) {
        setAgentProgress([]);
        setLoading(false);
        return;
      }

      // Get agent profiles
      let profilesQuery = supabase
        .from('agent_profiles')
        .select('id, user_id, display_name, avatar_url, team_id')
        .in('user_id', userIds);

      if (teamId) {
        profilesQuery = profilesQuery.eq('team_id', teamId);
      }

      const { data: profiles } = await profilesQuery;

      if (!profiles || profiles.length === 0) {
        setAgentProgress([]);
        setLoading(false);
        return;
      }

      const agentProfileIds = profiles.map(p => p.id);

      // Get today's date range
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Get conversations finished today per agent
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id, assigned_agent_id, started_at, finished_at, status')
        .in('assigned_agent_id', agentProfileIds)
        .gte('finished_at', today.toISOString())
        .lt('finished_at', tomorrow.toISOString());

      // Get all active/finished conversations for resolution rate
      const { data: allConversations } = await supabase
        .from('conversations')
        .select('id, assigned_agent_id, status')
        .in('assigned_agent_id', agentProfileIds)
        .gte('started_at', today.toISOString());

      // Calculate metrics per agent
      const progressData: AgentProgress[] = profiles.map(profile => {
        const agentConvs = conversations?.filter(c => c.assigned_agent_id === profile.id) || [];
        const allAgentConvs = allConversations?.filter(c => c.assigned_agent_id === profile.id) || [];
        
        // Calculate avg response time (simulated based on conversation duration)
        let avgResponseTime = 0;
        const convWithTimes = agentConvs.filter(c => c.started_at && c.finished_at);
        if (convWithTimes.length > 0) {
          const totalTime = convWithTimes.reduce((sum, c) => {
            const start = new Date(c.started_at).getTime();
            const end = new Date(c.finished_at!).getTime();
            return sum + (end - start);
          }, 0);
          avgResponseTime = Math.round((totalTime / convWithTimes.length) / 1000); // Convert to seconds
        }

        // Calculate resolution rate
        const finishedCount = allAgentConvs.filter(c => c.status === 'finished').length;
        const totalCount = allAgentConvs.length;
        const resolutionRate = totalCount > 0 ? Math.round((finishedCount / totalCount) * 100) : 0;

        return {
          id: profile.id,
          userId: profile.user_id,
          displayName: profile.display_name || 'Agente',
          avatarUrl: profile.avatar_url,
          conversationsToday: agentConvs.length,
          avgResponseTime,
          satisfactionRating: null, // Would need satisfaction data
          resolutionRate,
        };
      });

      // Sort by conversations count
      progressData.sort((a, b) => b.conversationsToday - a.conversationsToday);

      setAgentProgress(progressData);

      // Calculate team totals
      const totalConversations = progressData.reduce((sum, a) => sum + a.conversationsToday, 0);
      const agentsWithTime = progressData.filter(a => a.avgResponseTime > 0);
      const avgResponseTime = agentsWithTime.length > 0 
        ? Math.round(agentsWithTime.reduce((sum, a) => sum + a.avgResponseTime, 0) / agentsWithTime.length)
        : 0;
      const avgResolution = progressData.length > 0
        ? Math.round(progressData.reduce((sum, a) => sum + a.resolutionRate, 0) / progressData.length)
        : 0;

      setTeamTotals({
        totalConversations,
        avgResponseTime,
        avgSatisfaction: 4.2, // Simulated
        avgResolution,
      });

    } catch (error) {
      console.error('Error loading agent progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (current: number, goal: number, inverse: boolean = false) => {
    const percentage = inverse ? (goal / Math.max(current, 1)) * 100 : (current / goal) * 100;
    if (percentage >= 100) return 'text-green-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressPercentage = (current: number, goal: number, inverse: boolean = false) => {
    if (inverse) {
      // For metrics where lower is better (like response time)
      return Math.min(100, Math.round((goal / Math.max(current, 1)) * 100));
    }
    return Math.min(100, Math.round((current / goal) * 100));
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getTrendIcon = (current: number, goal: number, inverse: boolean = false) => {
    const isGood = inverse ? current <= goal : current >= goal;
    if (isGood) return <TrendingUp className="h-4 w-4 text-green-500" />;
    const percentage = inverse ? (goal / Math.max(current, 1)) * 100 : (current / goal) * 100;
    if (percentage >= 70) return <Minus className="h-4 w-4 text-yellow-500" />;
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Metas do Time
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Team Goals Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Metas da Operação
          </CardTitle>
          <CardDescription>
            Progresso do time em relação às metas definidas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Conversations Goal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Atendimentos Hoje</span>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(teamTotals.totalConversations, goals.dailyConversations * agentProgress.length)}
                <span className="text-sm font-bold">
                  {teamTotals.totalConversations} / {goals.dailyConversations * agentProgress.length}
                </span>
              </div>
            </div>
            <Progress 
              value={getProgressPercentage(teamTotals.totalConversations, goals.dailyConversations * agentProgress.length)} 
              className="h-2"
            />
          </div>

          {/* Response Time Goal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Tempo Médio de Resposta</span>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(teamTotals.avgResponseTime, goals.avgResponseTimeSeconds, true)}
                <span className="text-sm font-bold">
                  {formatTime(teamTotals.avgResponseTime)} / {formatTime(goals.avgResponseTimeSeconds)}
                </span>
              </div>
            </div>
            <Progress 
              value={getProgressPercentage(teamTotals.avgResponseTime, goals.avgResponseTimeSeconds, true)} 
              className="h-2"
            />
          </div>

          {/* Satisfaction Goal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Satisfação Média</span>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(teamTotals.avgSatisfaction, goals.minSatisfactionRating)}
                <span className="text-sm font-bold flex items-center gap-1">
                  {teamTotals.avgSatisfaction.toFixed(1)} / {goals.minSatisfactionRating}
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                </span>
              </div>
            </div>
            <Progress 
              value={getProgressPercentage(teamTotals.avgSatisfaction, goals.minSatisfactionRating) * 20} 
              className="h-2"
            />
          </div>

          {/* Resolution Rate Goal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Taxa de Resolução</span>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(teamTotals.avgResolution, goals.resolutionRate)}
                <span className="text-sm font-bold">
                  {teamTotals.avgResolution}% / {goals.resolutionRate}%
                </span>
              </div>
            </div>
            <Progress 
              value={getProgressPercentage(teamTotals.avgResolution, goals.resolutionRate)} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Individual Agent Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso Individual</CardTitle>
          <CardDescription>
            Performance de cada agente em relação às metas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {agentProgress.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              Nenhum agente encontrado
            </div>
          ) : (
            <div className="space-y-4">
              {agentProgress.map((agent) => {
                const convProgress = getProgressPercentage(agent.conversationsToday, goals.dailyConversations);
                const isOnTrack = convProgress >= 70;

                return (
                  <div key={agent.id} className="space-y-2 p-3 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={agent.avatarUrl || undefined} />
                          <AvatarFallback className="text-xs">
                            {agent.displayName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{agent.displayName}</p>
                          <p className="text-xs text-muted-foreground">
                            {agent.conversationsToday} de {goals.dailyConversations} atendimentos
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={isOnTrack ? "default" : "secondary"}
                        className={isOnTrack ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" : ""}
                      >
                        {convProgress}%
                      </Badge>
                    </div>
                    <Progress value={convProgress} className="h-1.5" />
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Timer className="h-3 w-3" />
                        {formatTime(agent.avgResponseTime || 0)}
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {agent.resolutionRate}% resolução
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalsDashboard;
