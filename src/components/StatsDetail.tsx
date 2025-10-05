import { ArrowLeft, BarChart3, FileSpreadsheet, TrendingUp, Users, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProcessedRow {
  fecha: string;
  concepto: string;
  importeConIva: string;
  precioSinIva: string;
  numeroFactura: string;
  formaPago: string;
  cliente: string;
}

interface StatsDetailProps {
  type: 'ingresos' | 'facturas' | 'ticket' | 'clientes';
  data: ProcessedRow[];
  onClose: () => void;
}

export const StatsDetail = ({ type, data, onClose }: StatsDetailProps) => {
  const totalIngresos = data.reduce((sum, row) => {
    const amount = parseFloat(row.importeConIva.replace("€", ""));
    return sum + amount;
  }, 0);

  const clientCounts: Record<string, number> = {};
  const clientRevenue: Record<string, number> = {};
  data.forEach(row => {
    if (row.cliente !== "Consumidor final") {
      clientCounts[row.cliente] = (clientCounts[row.cliente] || 0) + 1;
      const amount = parseFloat(row.importeConIva.replace("€", ""));
      clientRevenue[row.cliente] = (clientRevenue[row.cliente] || 0) + amount;
    }
  });

  const topClients = Object.entries(clientCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([client, count]) => ({
      cliente: client,
      visitas: count,
      ingresos: clientRevenue[client] || 0
    }));

  // Agrupar por mes
  const monthlyData: Record<string, { ingresos: number; facturas: number }> = {};
  data.forEach(row => {
    const [, month, year] = row.fecha.split("/");
    const monthKey = `${month}/${year}`;
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { ingresos: 0, facturas: 0 };
    }
    const amount = parseFloat(row.importeConIva.replace("€", ""));
    monthlyData[monthKey].ingresos += amount;
    monthlyData[monthKey].facturas += 1;
  });

  const monthlyList = Object.entries(monthlyData)
    .sort((a, b) => {
      const [monthA, yearA] = a[0].split('/');
      const [monthB, yearB] = b[0].split('/');
      return new Date(parseInt(yearB), parseInt(monthB) - 1).getTime() -
             new Date(parseInt(yearA), parseInt(monthA) - 1).getTime();
    })
    .map(([period, stats]) => {
      const [month, year] = period.split('/');
      const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric'
      });
      return { period: monthName, ...stats };
    });

  const renderContent = () => {
    switch (type) {
      case 'ingresos':
        return (
          <div className="space-y-4">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <DollarSign className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Ingresos Acumulados</p>
                  <h2 className="text-4xl font-bold text-primary">€{totalIngresos.toFixed(2)}</h2>
                </div>
              </div>
            </Card>

            <h3 className="text-lg font-semibold mt-6 mb-4">Ingresos por Mes</h3>
            <div className="space-y-3">
              {monthlyList.map((month) => (
                <Card key={month.period} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium capitalize">{month.period}</p>
                      <p className="text-sm text-muted-foreground">{month.facturas} facturas</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">€{month.ingresos.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        Promedio: €{(month.ingresos / month.facturas).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'facturas':
        return (
          <div className="space-y-4">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <FileSpreadsheet className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Facturas Emitidas</p>
                  <h2 className="text-4xl font-bold text-primary">{data.length}</h2>
                </div>
              </div>
            </Card>

            <h3 className="text-lg font-semibold mt-6 mb-4">Facturas por Mes</h3>
            <div className="space-y-3">
              {monthlyList.map((month) => (
                <Card key={month.period} className="p-4">
                  <div className="flex justify-between items-center">
                    <p className="font-medium capitalize">{month.period}</p>
                    <div className="text-right">
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        {month.facturas} facturas
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        €{month.ingresos.toFixed(2)} total
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'ticket':
        const ticketPromedio = totalIngresos / data.length;
        return (
          <div className="space-y-4">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ticket Promedio por Factura</p>
                  <h2 className="text-4xl font-bold text-primary">€{ticketPromedio.toFixed(2)}</h2>
                </div>
              </div>
            </Card>

            <h3 className="text-lg font-semibold mt-6 mb-4">Promedio por Mes</h3>
            <div className="space-y-3">
              {monthlyList.map((month) => (
                <Card key={month.period} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium capitalize">{month.period}</p>
                      <p className="text-sm text-muted-foreground">{month.facturas} facturas</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        €{(month.ingresos / month.facturas).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">por factura</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'clientes':
        return (
          <div className="space-y-4">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Clientes Únicos Registrados</p>
                  <h2 className="text-4xl font-bold text-primary">{topClients.length}</h2>
                </div>
              </div>
            </Card>

            <h3 className="text-lg font-semibold mt-6 mb-4">Ranking de Clientes</h3>
            <div className="space-y-3">
              {topClients.map((client, index) => (
                <Card key={client.cliente} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">#{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{client.cliente}</p>
                      <p className="text-sm text-muted-foreground">{client.visitas} visitas</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">€{client.ingresos.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        €{(client.ingresos / client.visitas).toFixed(2)}/visita
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
    }
  };

  const titles = {
    ingresos: 'Total de Ingresos',
    facturas: 'Total de Facturas',
    ticket: 'Ticket Promedio',
    clientes: 'Clientes Únicos'
  };

  const icons = {
    ingresos: BarChart3,
    facturas: FileSpreadsheet,
    ticket: TrendingUp,
    clientes: Users
  };

  const Icon = icons[type];

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline ml-2">Volver</span>
            </Button>
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <h1 className="text-base sm:text-lg font-bold">{titles[type]}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {renderContent()}
      </div>
    </div>
  );
};
