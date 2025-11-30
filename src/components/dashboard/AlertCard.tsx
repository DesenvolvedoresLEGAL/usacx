
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Clock, Users, MessageSquare } from "lucide-react";

export const AlertCard = () => {
  const alerts: any[] = [];

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-5 w-5" />
          Alertas e Avisos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum alerta no momento.
          </p>
        ) : alerts.map((alert, index) => (
          <Alert 
            key={index} 
            className={`${alert.urgent ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}
          >
            <alert.icon className="h-4 w-4" />
            <AlertTitle className={alert.urgent ? 'text-red-800' : 'text-yellow-800'}>
              {alert.title}
            </AlertTitle>
            <AlertDescription className={alert.urgent ? 'text-red-700' : 'text-yellow-700'}>
              {alert.description}
            </AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
};
