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
  onDeleteMonth?: (period: string, invoices: ProcessedRow[]) => void;
}

interface GroupedInvoices {
  [key: string]: {
    facturas: ProcessedRow[];
    total: number;
    count: number;
  };
}

export const InvoiceList = ({ data, onDelete, onDeleteMonth }: InvoiceListProps) => {
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
                <AccordionTrigger className="hover:no-underline p-4 sm:p-6">
                  <div className="flex items-center justify-between w-full gap-2">
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                      <div className="p-2 sm:p-3 bg-primary/10 rounded-lg flex-shrink-0">
                        <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <div className="text-left min-w-0">
                        <h3 className="text-sm sm:text-xl font-bold capitalize truncate">{monthName}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {group.count} {group.count === 1 ? 'factura' : 'facturas'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="flex items-center gap-1 sm:gap-2 text-base sm:text-2xl font-bold text-primary">
                          <TrendingUp className="h-3 w-3 sm:h-5 sm:w-5" />
                          €{group.total.toFixed(2)}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                          Total del periodo
                        </p>
                      </div>
                      {onDeleteMonth && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`¿Borrar todas las ${group.count} facturas de ${monthName}?`)) {
                              onDeleteMonth(period, group.facturas);
                            }
                          }}
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="px-3 sm:px-6 pb-4 sm:pb-6 pt-2 space-y-2">
                    {group.facturas.map((factura, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 sm:p-4 bg-accent/5 hover:bg-accent/10 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 cursor-pointer" onClick={() => handleViewInvoice(factura)}>
                          <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-mono font-medium text-xs sm:text-sm">{factura.numeroFactura}</p>
                              <Badge variant="outline" className="text-xs">
                                {factura.concepto}
                              </Badge>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                              {factura.cliente} • {factura.fecha}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <div className="text-right">
                            <p className="font-bold text-sm sm:text-base">{factura.importeConIva}</p>
                            <p className="text-xs text-muted-foreground hidden sm:block">{factura.formaPago}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 sm:group-hover:opacity-100 sm:opacity-100 transition-opacity h-8 w-8 p-0"
                            onClick={() => handleViewInvoice(factura)}
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 sm:group-hover:opacity-100 sm:opacity-100 transition-opacity text-destructive hover:text-destructive h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(factura);
                              }}
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detalle de Factura
            </DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Número de Factura</p>
                  <p className="font-mono text-base sm:text-lg font-bold break-all">{selectedInvoice.numeroFactura}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Fecha</p>
                  <p className="text-base sm:text-lg font-medium">{selectedInvoice.fecha}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cliente</p>
                    <p className="font-medium break-words">{selectedInvoice.cliente}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Forma de Pago</p>
                    <Badge>{selectedInvoice.formaPago}</Badge>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Concepto</p>
                <p className="font-medium mb-4 break-words">{selectedInvoice.concepto}</p>

                <div className="bg-accent/10 p-3 sm:p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-sm text-muted-foreground">Base Imponible (sin IVA)</span>
                    <span className="font-medium text-sm sm:text-base">{selectedInvoice.precioSinIva}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-sm text-muted-foreground">IVA (21%)</span>
                    <span className="font-medium text-sm sm:text-base">
                      €{(parseFloat(selectedInvoice.importeConIva.replace('€', '')) -
                         parseFloat(selectedInvoice.precioSinIva.replace('€', ''))).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center gap-2">
                    <span className="font-bold text-base sm:text-lg">Total</span>
                    <span className="font-bold text-base sm:text-lg text-primary">{selectedInvoice.importeConIva}</span>
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
