import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Eye, Calendar, TrendingUp, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InvoiceDetail } from "./InvoiceDetail";

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
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [showDetail, setShowDetail] = useState(false);

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

  const handleViewInvoice = (invoice: ProcessedRow, index: number) => {
    console.log('📄 Abriendo factura:', invoice.numeroFactura, 'índice:', index);
    setSelectedInvoice(invoice);
    setSelectedIndex(index);
    setShowDetail(true);
    console.log('✅ showDetail ahora es:', true);
  };

  const handleNext = () => {
    if (selectedIndex < data.length - 1) {
      const nextIndex = selectedIndex + 1;
      setSelectedInvoice(data[nextIndex]);
      setSelectedIndex(nextIndex);
    }
  };

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      const prevIndex = selectedIndex - 1;
      setSelectedInvoice(data[prevIndex]);
      setSelectedIndex(prevIndex);
    }
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedInvoice(null);
    setSelectedIndex(-1);
  };

  return (
    <>
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
                <div className="relative">
                  <AccordionTrigger className="hover:no-underline p-4 sm:p-6 pr-12 sm:pr-16">
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
                      <div className="text-right">
                        <div className="flex items-center gap-1 sm:gap-2 text-base sm:text-2xl font-bold text-primary">
                          <TrendingUp className="h-3 w-3 sm:h-5 sm:w-5" />
                          €{group.total.toFixed(2)}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                          Total del periodo
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  {onDeleteMonth && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9 p-0 z-10"
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

                <AccordionContent>
                  <div className="px-3 sm:px-6 pb-4 sm:pb-6 pt-2 space-y-2">
                    {group.facturas.map((factura, localIndex) => {
                      // Encontrar el índice global de esta factura en el array completo
                      const globalIndex = data.findIndex(f => f.numeroFactura === factura.numeroFactura);

                      return (
                        <div
                          key={localIndex}
                          className="flex items-center justify-between p-3 sm:p-4 bg-accent/5 hover:bg-accent/10 rounded-lg transition-colors group"
                        >
                          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 cursor-pointer" onClick={() => handleViewInvoice(factura, globalIndex)}>
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
                              onClick={() => handleViewInvoice(factura, globalIndex)}
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
                      );
                    })}
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          );
        })}
        </Accordion>
      </div>

      {/* Detalle de Factura en Pantalla Completa */}
      {showDetail && selectedInvoice && (
        <InvoiceDetail
          invoice={selectedInvoice}
          onClose={handleCloseDetail}
          onDelete={onDelete}
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasNext={selectedIndex < data.length - 1}
          hasPrevious={selectedIndex > 0}
        />
      )}
    </>
  );
};
