import { ArrowLeft, ChevronLeft, ChevronRight, FileText, Calendar, User, CreditCard, DollarSign, Hash, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProcessedRow {
  fecha: string;
  concepto: string;
  importeConIva: string;
  precioSinIva: string;
  numeroFactura: string;
  formaPago: string;
  cliente: string;
}

interface InvoiceDetailProps {
  invoice: ProcessedRow;
  onClose: () => void;
  onDelete?: (invoice: ProcessedRow) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export const InvoiceDetail = ({
  invoice,
  onClose,
  onDelete,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}: InvoiceDetailProps) => {
  const importeConIva = parseFloat(invoice.importeConIva.replace('€', ''));
  const precioSinIva = parseFloat(invoice.precioSinIva.replace('€', ''));
  const iva = importeConIva - precioSinIva;

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline ml-2">Volver</span>
            </Button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold truncate">Factura {invoice.numeroFactura}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">{invoice.fecha}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Navegación */}
            {(hasPrevious || hasNext) && (
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPrevious}
                  disabled={!hasPrevious}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNext}
                  disabled={!hasNext}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm(`¿Eliminar la factura ${invoice.numeroFactura}?`)) {
                    onDelete(invoice);
                    onClose();
                  }
                }}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Eliminar</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Header Card */}
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Número de Factura</p>
                  <h2 className="text-2xl sm:text-3xl font-bold font-mono">{invoice.numeroFactura}</h2>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Importe Total</p>
              <p className="text-3xl sm:text-4xl font-bold text-primary">{invoice.importeConIva}</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Cliente */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg flex-shrink-0">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Cliente</p>
                <p className="text-base sm:text-lg font-semibold break-words">{invoice.cliente}</p>
              </div>
            </div>
          </Card>

          {/* Fecha */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg flex-shrink-0">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Fecha de Emisión</p>
                <p className="text-base sm:text-lg font-semibold">{invoice.fecha}</p>
              </div>
            </div>
          </Card>

          {/* Forma de Pago */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg flex-shrink-0">
                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Forma de Pago</p>
                <Badge variant="outline" className="text-sm sm:text-base">
                  {invoice.formaPago}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Concepto */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg flex-shrink-0">
                <Hash className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Concepto</p>
                <p className="text-base sm:text-lg font-semibold break-words">{invoice.concepto}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Desglose de Precios */}
        <Card className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="h-6 w-6 text-primary" />
            <h3 className="text-lg sm:text-xl font-bold">Desglose de Precios</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3">
              <span className="text-sm sm:text-base text-muted-foreground">Base Imponible (sin IVA)</span>
              <span className="text-base sm:text-lg font-semibold">{invoice.precioSinIva}</span>
            </div>

            <Separator />

            <div className="flex justify-between items-center py-3">
              <span className="text-sm sm:text-base text-muted-foreground">IVA (21%)</span>
              <span className="text-base sm:text-lg font-semibold">€{iva.toFixed(2)}</span>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center py-4 bg-primary/5 px-4 rounded-lg">
              <span className="text-lg sm:text-xl font-bold">Total a Pagar</span>
              <span className="text-2xl sm:text-3xl font-bold text-primary">{invoice.importeConIva}</span>
            </div>
          </div>
        </Card>

        {/* Footer Info */}
        <div className="text-center text-xs sm:text-sm text-muted-foreground py-4">
          <p>Factura generada automáticamente</p>
        </div>
      </div>
    </div>
  );
};
