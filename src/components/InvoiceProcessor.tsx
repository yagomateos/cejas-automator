import { useState, useRef } from "react";
import { Upload, Download, FileSpreadsheet, Settings, BarChart3, Search, FileDown, TrendingUp, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "./ThemeToggle";
import * as XLSX from "xlsx";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";

interface ProcessedRow {
  fecha: string;
  concepto: string;
  importeConIva: string;
  precioSinIva: string;
  numeroFactura: string;
  formaPago: string;
  cliente: string;
}

interface PriceConfig {
  [key: string]: string;
}

export const InvoiceProcessor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processedData, setProcessedData] = useState<ProcessedRow[]>([]);
  const [filteredData, setFilteredData] = useState<ProcessedRow[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [invoicePrefix, setInvoicePrefix] = useState("FAC-");
  const [invoiceStart, setInvoiceStart] = useState(1);
  const [editingCell, setEditingCell] = useState<{ row: number; field: keyof ProcessedRow } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [conceptMap, setConceptMap] = useState<PriceConfig>({
    "20": "Diseño de cejas",
    "10": "Depilación de cejas",
    "40": "Tratamiento facial",
    "60": "Pack de belleza facial",
    "220": "Tratamiento combinado",
    "600": "Alquiler local",
  });

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

      // Check if file is already processed (has column headers like "Fecha", "Concepto", etc.)
      const firstRow = rows[0];
      const isAlreadyProcessed =
        firstRow.some(cell => cell && cell.toLowerCase().includes('fecha')) &&
        firstRow.some(cell => cell && cell.toLowerCase().includes('concepto')) &&
        firstRow.some(cell => cell && cell.toLowerCase().includes('importe'));

      if (isAlreadyProcessed) {
        // File is already processed, just return it as is
        const dataRows = rows.slice(1).filter(row => row.some(cell => cell && cell.toString().trim()));

        const processed: ProcessedRow[] = dataRows.map((row, index) => {
          // Map the already processed data
          const fecha = row[0] || "";
          const concepto = row[1] || "";
          let importeConIva = row[2] || "";
          let precioSinIva = row[3] || "";
          const formaPago = row[5] || paymentMethods[0];
          const cliente = row[6] || "Consumidor final";

          // Clean up amounts (remove € symbol if present)
          importeConIva = importeConIva.toString().trim();
          precioSinIva = precioSinIva.toString().trim();

          if (!importeConIva.startsWith('€')) {
            importeConIva = `€${importeConIva}`;
          }
          if (!precioSinIva.startsWith('€')) {
            precioSinIva = `€${precioSinIva}`;
          }

          return {
            fecha,
            concepto,
            importeConIva,
            precioSinIva,
            numeroFactura: `${invoicePrefix}${String(invoiceStart + index).padStart(3, "0")}`,
            formaPago,
            cliente,
          };
        }).filter(row => row.fecha && row.concepto);

        setProcessedData(processed);
        setFilteredData(processed);
        toast({
          title: "¡Procesado exitosamente!",
          description: `${processed.length} facturas procesadas`,
        });
        return;
      }

      // Find the header row index (look for "Importe")
      let headerRowIndex = -1;
      let importeColumnIndex = -1;
      let observacionesColumnIndex = -1;

      for (let i = 0; i < rows.length; i++) {
        const importeIdx = rows[i].findIndex(cell =>
          cell && cell.toString().toLowerCase().trim() === 'importe'
        );
        const observacionesIdx = rows[i].findIndex(cell =>
          cell && cell.toString().toLowerCase().trim() === 'observaciones'
        );

        if (importeIdx !== -1) {
          headerRowIndex = i;
          importeColumnIndex = importeIdx;
          observacionesColumnIndex = observacionesIdx !== -1 ? observacionesIdx : -1;
          break;
        }
      }

      // If not found, try default positions
      if (headerRowIndex === -1 || importeColumnIndex === -1) {
        headerRowIndex = 3;
        importeColumnIndex = 5;
        observacionesColumnIndex = 7;
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

          // Extract client name from "Observaciones" column
          let clienteName = "Consumidor final";

          if (observacionesColumnIndex !== -1 && row[observacionesColumnIndex]) {
            const observacionesCol = row[observacionesColumnIndex].toString();

            // Try to extract name from "Recibido: nombre" or "RECIBIDO: nombre"
            const observacionesMatch = observacionesCol.match(/RECIBIDO:\s*(.+)/i);
            if (observacionesMatch) {
              clienteName = observacionesMatch[1].trim();
              // Capitalize first letter of each word
              clienteName = clienteName
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            }
          }

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
            cliente: clienteName,
          };
        })
        .filter((row): row is ProcessedRow => row !== null)
        .sort((a, b) => {
          const dateA = new Date(a.fecha.split("/").reverse().join("-"));
          const dateB = new Date(b.fecha.split("/").reverse().join("-"));
          return dateA.getTime() - dateB.getTime();
        });

      processed.forEach((row, index) => {
        row.numeroFactura = `${invoicePrefix}${String(invoiceStart + index).padStart(3, "0")}`;
      });

      setProcessedData(processed);
      setFilteredData(processed);
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

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredData(processedData);
      return;
    }

    const filtered = processedData.filter(row =>
      Object.values(row).some(value =>
        value.toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const handleCellEdit = (rowIndex: number, field: keyof ProcessedRow, value: string) => {
    const updated = [...processedData];
    updated[rowIndex][field] = value;
    setProcessedData(updated);
    setFilteredData(updated);
    setEditingCell(null);
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
      ...filteredData.map(row =>
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

  const downloadExcel = () => {
    if (processedData.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map(row => ({
        Fecha: row.fecha,
        Concepto: row.concepto,
        "Importe (con IVA)": row.importeConIva,
        "Precio sin IVA": row.precioSinIva,
        "Número de factura": row.numeroFactura,
        "Forma de pago": row.formaPago,
        Cliente: row.cliente,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Facturas");
    XLSX.writeFile(workbook, `facturas_procesadas_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const getStats = () => {
    if (processedData.length === 0) return null;

    const totalIngresos = processedData.reduce((sum, row) => {
      const amount = parseFloat(row.importeConIva.replace("€", ""));
      return sum + amount;
    }, 0);

    const serviceCounts: Record<string, number> = {};
    const serviceRevenue: Record<string, number> = {};
    processedData.forEach(row => {
      serviceCounts[row.concepto] = (serviceCounts[row.concepto] || 0) + 1;
      const amount = parseFloat(row.importeConIva.replace("€", ""));
      serviceRevenue[row.concepto] = (serviceRevenue[row.concepto] || 0) + amount;
    });

    const clientCounts: Record<string, number> = {};
    const clientRevenue: Record<string, number> = {};
    processedData.forEach(row => {
      if (row.cliente !== "Consumidor final") {
        clientCounts[row.cliente] = (clientCounts[row.cliente] || 0) + 1;
        const amount = parseFloat(row.importeConIva.replace("€", ""));
        clientRevenue[row.cliente] = (clientRevenue[row.cliente] || 0) + amount;
      }
    });

    const topClients = Object.entries(clientCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([client, count]) => ({
        cliente: client,
        visitas: count,
        ingresos: clientRevenue[client] || 0
      }));

    // Agrupar por mes
    const monthlyData: Record<string, { ingresos: number; facturas: number }> = {};
    processedData.forEach(row => {
      const [, month, year] = row.fecha.split("/");
      const monthKey = `${month}/${year}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { ingresos: 0, facturas: 0 };
      }
      const amount = parseFloat(row.importeConIva.replace("€", ""));
      monthlyData[monthKey].ingresos += amount;
      monthlyData[monthKey].facturas += 1;
    });

    const monthlyChart = Object.entries(monthlyData)
      .sort((a, b) => {
        const [monthA, yearA] = a[0].split("/");
        const [monthB, yearB] = b[0].split("/");
        return new Date(`${yearA}-${monthA}`).getTime() - new Date(`${yearB}-${monthB}`).getTime();
      })
      .map(([month, data]) => ({
        mes: month,
        ingresos: parseFloat(data.ingresos.toFixed(2)),
        facturas: data.facturas
      }));

    // Datos para gráfico de servicios
    const servicesChart = Object.entries(serviceCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([servicio, cantidad]) => ({
        servicio,
        cantidad,
        ingresos: parseFloat((serviceRevenue[servicio] || 0).toFixed(2))
      }));

    // Formas de pago
    const paymentCounts: Record<string, number> = {};
    processedData.forEach(row => {
      paymentCounts[row.formaPago] = (paymentCounts[row.formaPago] || 0) + 1;
    });

    const paymentChart = Object.entries(paymentCounts).map(([metodo, cantidad]) => ({
      metodo,
      cantidad
    }));

    const ticketPromedio = totalIngresos / processedData.length;

    return {
      totalIngresos,
      totalFacturas: processedData.length,
      ticketPromedio,
      serviceCounts,
      topClients,
      monthlyChart,
      servicesChart,
      paymentChart,
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background p-4 md:p-8">
      <ThemeToggle />
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Procesador de Facturas
          </h1>
          <p className="text-lg text-muted-foreground">
            Automatiza tus facturas en segundos
          </p>
        </div>

        {/* Configuración */}
        <Card className="p-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="prefix">Prefijo de factura</Label>
              <Input
                id="prefix"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                placeholder="FAC-"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="start">Número inicial</Label>
              <Input
                id="start"
                type="number"
                value={invoiceStart}
                onChange={(e) => setInvoiceStart(parseInt(e.target.value) || 1)}
                min="1"
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurar precios
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Configuración de Precios</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {Object.entries(conceptMap).map(([price, concept]) => (
                    <div key={price} className="flex gap-4 items-center">
                      <Input
                        value={price}
                        disabled
                        className="w-24"
                        prefix="€"
                      />
                      <Input
                        value={concept}
                        onChange={(e) => {
                          const updated = { ...conceptMap };
                          updated[price] = e.target.value;
                          setConceptMap(updated);
                        }}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

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

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Ingresos</p>
                  <p className="text-2xl font-bold">€{stats.totalIngresos.toFixed(2)}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Facturas</p>
                  <p className="text-2xl font-bold">{stats.totalFacturas}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Ticket Promedio</p>
                  <p className="text-2xl font-bold">€{stats.ticketPromedio.toFixed(2)}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Clientes Únicos</p>
                  <p className="text-2xl font-bold">{stats.topClients.length}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {processedData.length > 0 && (
          <Card className="p-6 shadow-card animate-slide-up">
            <Tabs defaultValue="table">
              <TabsList className="mb-4">
                <TabsTrigger value="table">Tabla</TabsTrigger>
                <TabsTrigger value="stats">Estadísticas</TabsTrigger>
              </TabsList>

              <TabsContent value="table" className="space-y-4">
                <div className="flex flex-wrap gap-4 justify-between items-center">
                  <div className="flex-1 min-w-[250px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por cliente, concepto, etc..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={downloadCSV} variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      CSV
                    </Button>
                    <Button onClick={downloadExcel}>
                      <FileDown className="mr-2 h-4 w-4" />
                      Excel
                    </Button>
                  </div>
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
                      {filteredData.map((row, index) => (
                        <tr
                          key={index}
                          className="border-b border-border/50 hover:bg-accent/5 transition-colors"
                        >
                          <td
                            className="p-3 text-sm cursor-pointer"
                            onClick={() => setEditingCell({ row: index, field: "fecha" })}
                          >
                            {editingCell?.row === index && editingCell?.field === "fecha" ? (
                              <Input
                                value={row.fecha}
                                onChange={(e) => handleCellEdit(index, "fecha", e.target.value)}
                                onBlur={() => setEditingCell(null)}
                                autoFocus
                                className="h-8"
                              />
                            ) : (
                              row.fecha
                            )}
                          </td>
                          <td
                            className="p-3 text-sm font-medium cursor-pointer"
                            onClick={() => setEditingCell({ row: index, field: "concepto" })}
                          >
                            {editingCell?.row === index && editingCell?.field === "concepto" ? (
                              <Input
                                value={row.concepto}
                                onChange={(e) => handleCellEdit(index, "concepto", e.target.value)}
                                onBlur={() => setEditingCell(null)}
                                autoFocus
                                className="h-8"
                              />
                            ) : (
                              row.concepto
                            )}
                          </td>
                          <td className="p-3 text-sm">{row.importeConIva}</td>
                          <td className="p-3 text-sm">{row.precioSinIva}</td>
                          <td className="p-3 text-sm font-mono">{row.numeroFactura}</td>
                          <td
                            className="p-3 text-sm cursor-pointer"
                            onClick={() => setEditingCell({ row: index, field: "formaPago" })}
                          >
                            {editingCell?.row === index && editingCell?.field === "formaPago" ? (
                              <Input
                                value={row.formaPago}
                                onChange={(e) => handleCellEdit(index, "formaPago", e.target.value)}
                                onBlur={() => setEditingCell(null)}
                                autoFocus
                                className="h-8"
                              />
                            ) : (
                              row.formaPago
                            )}
                          </td>
                          <td
                            className="p-3 text-sm text-muted-foreground cursor-pointer"
                            onClick={() => setEditingCell({ row: index, field: "cliente" })}
                          >
                            {editingCell?.row === index && editingCell?.field === "cliente" ? (
                              <Input
                                value={row.cliente}
                                onChange={(e) => handleCellEdit(index, "cliente", e.target.value)}
                                onBlur={() => setEditingCell(null)}
                                autoFocus
                                className="h-8"
                              />
                            ) : (
                              row.cliente
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="stats">
                {stats && (
                  <div className="space-y-6">
                    {/* Gráfico de evolución mensual */}
                    {stats.monthlyChart.length > 0 && (
                      <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          Evolución de Ingresos por Mes
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={stats.monthlyChart}>
                            <defs>
                              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="mes" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="ingresos" stroke="#6366f1" fillOpacity={1} fill="url(#colorIngresos)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </Card>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Gráfico de servicios */}
                      <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Servicios más Vendidos</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={stats.servicesChart}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="servicio" angle={-45} textAnchor="end" height={100} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="cantidad" fill="#6366f1" name="Cantidad vendida" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Card>

                      {/* Gráfico de formas de pago */}
                      <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Distribución de Formas de Pago</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={stats.paymentChart}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ metodo, percent }) => `${metodo}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="cantidad"
                            >
                              {stats.paymentChart.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#ec4899'][index % 3]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </Card>
                    </div>

                    {/* Top clientes con ingresos */}
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Top 5 Clientes
                      </h3>
                      <div className="space-y-3">
                        {stats.topClients.map((client) => (
                          <div key={client.cliente} className="flex justify-between items-center p-3 bg-accent/5 rounded-lg">
                            <div>
                              <p className="font-medium">{client.cliente}</p>
                              <p className="text-sm text-muted-foreground">{client.visitas} visitas</p>
                            </div>
                            <p className="text-lg font-bold text-primary">€{client.ingresos.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Ingresos por servicio */}
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Ingresos por Servicio</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.servicesChart} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="servicio" type="category" width={150} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="ingresos" fill="#10b981" name="Ingresos (€)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        )}
      </div>
    </div>
  );
};
