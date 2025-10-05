import { useState, useRef } from "react";
import { Upload, Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface ProcessedRow {
  fecha: string;
  concepto: string;
  importeConIva: string;
  precioSinIva: string;
  numeroFactura: string;
  formaPago: string;
  cliente: string;
}

export const InvoiceProcessor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processedData, setProcessedData] = useState<ProcessedRow[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const conceptMap: Record<string, string> = {
    "20": "Diseño de cejas",
    "10": "Depilación de cejas",
    "40": "Tratamiento facial",
    "60": "Pack de belleza facial",
    "220": "Tratamiento combinado",
    "600": "Alquiler local",
  };

  const paymentMethods = ["Transferencia bancaria", "Ingreso en cuenta", "Bizum"];

  const parseCSV = (text: string): string[][] => {
    const lines = text.split("\n").filter(line => line.trim());
    return lines.map(line => {
      const values: string[] = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          values.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      return values;
    });
  };

  const processFile = async (selectedFile: File) => {
    try {
      let rows: string[][];

      // Check if it's an Excel file or CSV
      if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];
        rows = jsonData.map(row => row.map(cell => String(cell || "")));
      } else {
        const text = await selectedFile.text();
        rows = parseCSV(text);
      }

      if (rows.length < 2) {
        toast({
          title: "Error",
          description: "El archivo está vacío o no tiene datos válidos",
          variant: "destructive",
        });
        return;
      }

      // Find the header row index (look for "Importe")
      let headerRowIndex = -1;
      let importeColumnIndex = -1;

      for (let i = 0; i < rows.length; i++) {
        const foundIndex = rows[i].findIndex(cell =>
          cell && cell.toString().toLowerCase().trim() === 'importe'
        );
        if (foundIndex !== -1) {
          headerRowIndex = i;
          importeColumnIndex = foundIndex;
          break;
        }
      }

      // If not found, try default positions
      if (headerRowIndex === -1 || importeColumnIndex === -1) {
        headerRowIndex = 3;
        importeColumnIndex = 5;
      }

      const dataRows = rows.slice(headerRowIndex + 1).filter(row => row.some(cell => cell && cell.toString().trim()));

      const processed: ProcessedRow[] = dataRows
        .map((row, index) => {
          // Try to get date from different columns
          let fecha = "";
          if (row[0] && row[0].toString().trim()) {
            fecha = row[0].toString();
          } else if (row[1] && row[1].toString().trim()) {
            fecha = row[1].toString();
          } else if (row[2] && row[2].toString().trim()) {
            fecha = row[2].toString();
          }

          let importe = row[importeColumnIndex] || "";

          importe = importe.toString().replace(/[€\s]/g, "").replace(",", ".");
          const importeNum = parseFloat(importe);

          if (isNaN(importeNum)) return null;

          const concepto = conceptMap[importeNum.toString()] || "Cejas";
          const precioSinIva = (importeNum / 1.21).toFixed(2);
          const numeroFactura = String(index + 1).padStart(3, "0");
          const formaPago = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

          return {
            fecha: parseDate(fecha),
            concepto,
            importeConIva: `€${importeNum.toFixed(2)}`,
            precioSinIva: `€${precioSinIva}`,
            numeroFactura,
            formaPago,
            cliente: "Consumidor final",
          };
        })
        .filter((row): row is ProcessedRow => row !== null)
        .sort((a, b) => {
          const dateA = new Date(a.fecha.split("/").reverse().join("-"));
          const dateB = new Date(b.fecha.split("/").reverse().join("-"));
          return dateA.getTime() - dateB.getTime();
        });

      processed.forEach((row, index) => {
        row.numeroFactura = String(index + 1).padStart(3, "0");
      });

      setProcessedData(processed);
      toast({
        title: "¡Procesado exitosamente!",
        description: `${processed.length} facturas procesadas`,
      });
    } catch (error) {
      toast({
        title: "Error al procesar",
        description: "Hubo un problema al procesar el archivo CSV",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const parseDate = (dateStr: string): string => {
    if (!dateStr) return new Date().toLocaleDateString("es-ES");
    
    const cleaned = dateStr.replace(/['"]/g, "").trim();
    
    if (cleaned.includes("/")) {
      const parts = cleaned.split("/");
      if (parts.length === 3) {
        const day = parts[0].padStart(2, "0");
        const month = parts[1].padStart(2, "0");
        const year = parts[2].length === 2 ? "20" + parts[2] : parts[2];
        return `${day}/${month}/${year}`;
      }
    }
    
    return new Date().toLocaleDateString("es-ES");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      processFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const isValid = validExtensions.some(ext => droppedFile?.name.toLowerCase().endsWith(ext));
    
    if (isValid) {
      setFile(droppedFile);
      processFile(droppedFile);
    } else {
      toast({
        title: "Archivo inválido",
        description: "Por favor, sube un archivo CSV o Excel (.xlsx, .xls)",
        variant: "destructive",
      });
    }
  };

  const downloadCSV = () => {
    if (processedData.length === 0) return;

    const headers = [
      "Fecha",
      "Concepto",
      "Importe (con IVA)",
      "Precio sin IVA",
      "Número de factura",
      "Forma de pago",
      "Cliente",
    ];

    const escapeCSV = (value: string) => {
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...processedData.map(row =>
        [
          escapeCSV(row.fecha),
          escapeCSV(row.concepto),
          escapeCSV(row.importeConIva),
          escapeCSV(row.precioSinIva),
          escapeCSV(row.numeroFactura),
          escapeCSV(row.formaPago),
          escapeCSV(row.cliente),
        ].join(",")
      ),
    ].join("\n");

    // Add UTF-8 BOM for proper encoding
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `facturas_procesadas_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Procesador de Facturas
          </h1>
          <p className="text-lg text-muted-foreground">
            Automatiza tus facturas en segundos
          </p>
        </div>

        <Card className="p-8 shadow-elegant border-2 hover:border-primary/50 transition-all duration-300">
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              isDragging
                ? "border-primary bg-primary/5 scale-105"
                : "border-border hover:border-primary/50 hover:bg-accent/5"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">
              Arrastra tu archivo aquí
            </h3>
            <p className="text-muted-foreground mb-6">
              CSV o Excel (.xlsx, .xls)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="shadow-lg hover:shadow-xl transition-all"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Seleccionar archivo
            </Button>
            {file && (
              <p className="mt-4 text-sm text-muted-foreground">
                Archivo: <span className="font-medium text-foreground">{file.name}</span>
              </p>
            )}
          </div>
        </Card>

        {processedData.length > 0 && (
          <Card className="p-6 shadow-card animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Facturas Procesadas</h2>
              <Button onClick={downloadCSV} className="shadow-md hover:shadow-lg transition-all">
                <Download className="mr-2 h-4 w-4" />
                Descargar CSV
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold text-sm">Fecha</th>
                    <th className="text-left p-3 font-semibold text-sm">Concepto</th>
                    <th className="text-left p-3 font-semibold text-sm">Con IVA</th>
                    <th className="text-left p-3 font-semibold text-sm">Sin IVA</th>
                    <th className="text-left p-3 font-semibold text-sm">Nº Factura</th>
                    <th className="text-left p-3 font-semibold text-sm">Pago</th>
                    <th className="text-left p-3 font-semibold text-sm">Cliente</th>
                  </tr>
                </thead>
                <tbody>
                  {processedData.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-border/50 hover:bg-accent/5 transition-colors"
                    >
                      <td className="p-3 text-sm">{row.fecha}</td>
                      <td className="p-3 text-sm font-medium">{row.concepto}</td>
                      <td className="p-3 text-sm">{row.importeConIva}</td>
                      <td className="p-3 text-sm">{row.precioSinIva}</td>
                      <td className="p-3 text-sm font-mono">{row.numeroFactura}</td>
                      <td className="p-3 text-sm">{row.formaPago}</td>
                      <td className="p-3 text-sm text-muted-foreground">{row.cliente}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
