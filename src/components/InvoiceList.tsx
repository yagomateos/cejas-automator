import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Eye, Calendar, TrendingUp, Trash2 } from "lucide-react";
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

interface InvoiceListProps {
  data: ProcessedRow[];
  onDelete?: (invoice: ProcessedRow) => void;
}

interface GroupedInvoices {
  [key: string]: {
    facturas: ProcessedRow[];
    total: number;
    count: number;
  };
}

export const InvoiceList = ({ data, onDelete }: InvoiceListProps) => {
  const [selectedInvoice, setSelectedInvoice] = useState<ProcessedRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Agrupar facturas por mes/año
  const groupedInvoices: GroupedInvoices = data.reduce((acc, factura) => {
    const [day, month, year] = factura.fecha.split('/');
    const key = `${month}/${year}`;
    const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric'
    });

    if (!acc[key]) {
      acc[key] = {
        facturas: [],
        total: 0,
        count: 0,
      };
    }

    const importe = parseFloat(factura.importeConIva.replace('€', ''));
    acc[key].facturas.push(factura);
    acc[key].total += importe;
    acc[key].count += 1;

    return acc;
  }, {} as GroupedInvoices);

  // Ordenar por fecha descendente
  const sortedPeriods = Object.entries(groupedInvoices).sort((a, b) => {
    const [monthA, yearA] = a[0].split('/');
    const [monthB, yearB] = b[0].split('/');
    return new Date(parseInt(yearB), parseInt(monthB) - 1).getTime() -
           new Date(parseInt(yearA), parseInt(monthA) - 1).getTime();
  });

  const handleViewInvoice = (invoice: ProcessedRow) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-3">
      <Accordion type="multiple" className="space-y-3">
        {sortedPeriods.map(([period, group]) => {
          const [month, year] = period.split('/');
          const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric'
          });

          return (
            <AccordionItem key={period} value={period} className="border-none">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <AccordionTrigger className="hover:no-underline p-6">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold capitalize">{monthName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {group.count} facturas
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                        <TrendingUp className="h-5 w-5" />
                        €{group.total.toFixed(2)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Total del periodo
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="px-6 pb-6 pt-2 space-y-2">
                    {group.facturas.map((factura, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-accent/5 hover:bg-accent/10 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => handleViewInvoice(factura)}>
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-mono font-medium">{factura.numeroFactura}</p>
                              <Badge variant="outline" className="text-xs">
                                {factura.concepto}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {factura.cliente} • {factura.fecha}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="font-bold">{factura.importeConIva}</p>
                            <p className="text-xs text-muted-foreground">{factura.formaPago}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleViewInvoice(factura)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(factura);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Modal de detalle */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detalle de Factura
            </DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Número de Factura</p>
                  <p className="font-mono text-lg font-bold">{selectedInvoice.numeroFactura}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Fecha</p>
                  <p className="text-lg font-medium">{selectedInvoice.fecha}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cliente</p>
                    <p className="font-medium">{selectedInvoice.cliente}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Forma de Pago</p>
                    <Badge>{selectedInvoice.formaPago}</Badge>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Concepto</p>
                <p className="font-medium mb-4">{selectedInvoice.concepto}</p>

                <div className="bg-accent/10 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Imponible (sin IVA)</span>
                    <span className="font-medium">{selectedInvoice.precioSinIva}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IVA (21%)</span>
                    <span className="font-medium">
                      €{(parseFloat(selectedInvoice.importeConIva.replace('€', '')) -
                         parseFloat(selectedInvoice.precioSinIva.replace('€', ''))).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg text-primary">{selectedInvoice.importeConIva}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
