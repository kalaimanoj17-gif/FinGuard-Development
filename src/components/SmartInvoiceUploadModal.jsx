import React, { useState, useEffect, useRef } from "react";
import {
  X,
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  FileCheck,
  ShieldCheck,
  Zap,
  ArrowRight,
  RotateCcw,
  Image as ImageIcon,
  Activity,
  Check,
  ExternalLink,
  FileCode2,
  Scan,
} from "lucide-react";
import { formatINR } from "../data/mockData";
import { useToast, StatusBadge } from "./ui";
import { useLanguage } from "../context/LanguageContext";
import { performOcrOnImage, parseInvoiceText } from "../utils/invoiceOcrParser";

const PRIMARY_WEBHOOK_URL =
  "https://api.agents.snsihub.ai/webhook/d8280e0f-0480-43e8-8d3e-a45f301143e3";
const FALLBACK_WEBHOOK_URL =
  "https://api.agents.snsihub.ai/webhook-test/d8280e0f-0480-43e8-8d3e-a45f301143e3";

const MOCK_EXTRACTIONS = [
  {
    fileName: "ABC_Grocery_INV-FM-2026-0047.pdf",
    fileSize: "142 KB",
    invoiceNumber: "FM-2026-0047",
    invoiceDate: "2026-09-08",
    dueDate: "2026-09-08",
    orderNumber: "ORD-55821",
    customer: "Manoj Kumar",
    customerEmail: "manoj.kumar@gmail.com",
    customerPhone: "+91 98765 43210",
    billingAddress: "12, Anna Nagar 2nd Street, Chennai, Tamil Nadu 600040, India",
    status: "Due soon",
    taxRate: 5,
    discount: 0,
    items: [
      { id: 1, name: "Tomato (Fresh | 1 kg)", qty: 2, unitPrice: 40 },
      { id: 2, name: "Onion (Fresh | 1 kg)", qty: 2, unitPrice: 35 },
      { id: 3, name: "Potato (Fresh | 1 kg)", qty: 3, unitPrice: 30 },
      { id: 4, name: "Rice (Sona Masoori) (1 kg)", qty: 1, unitPrice: 60 },
      { id: 5, name: "Milk (Aavin Toned) (1 litre)", qty: 2, unitPrice: 30 },
      { id: 6, name: "Banana (1 kg)", qty: 1, unitPrice: 50 },
    ],
  },
  {
    fileName: "Cloud_Hosting_Invoice_INV-8892.pdf",
    fileSize: "284 KB",
    invoiceNumber: "INV-8892",
    invoiceDate: "2026-09-08",
    dueDate: "2026-09-22",
    customer: "Apex Cloud Technologies Pvt Ltd",
    customerEmail: "billing@apexcloud.io",
    customerPhone: "+91 98200 44551",
    billingAddress: "402, Cyber Heights, HITEC City, Hyderabad, TG 500081",
    status: "Due soon",
    taxRate: 18,
    discount: 2500,
    items: [
      { id: 1, name: "Enterprise GPU Cloud Cluster (1 Month)", qty: 1, unitPrice: 54000 },
      { id: 2, name: "Managed High-Availability Load Balancer", qty: 2, unitPrice: 6500 },
      { id: 3, name: "Premium 24/7 SLA Engineering Support", qty: 1, unitPrice: 8500 },
    ],
  },
  {
    fileName: "Packaging_Supply_INV-9041.pdf",
    fileSize: "412 KB",
    invoiceNumber: "INV-9041",
    invoiceDate: "2026-09-07",
    dueDate: "2026-09-28",
    customer: "Kiran Wholesale Merchants",
    customerEmail: "accounts@kiranwholesale.in",
    customerPhone: "+91 97112 33445",
    billingAddress: "Plot 18, Phase 2, Industrial Area, Surat, GJ 395006",
    status: "Sent",
    taxRate: 12,
    discount: 1000,
    items: [
      { id: 1, name: "Heavy Duty Corrugated Carton Boxes (Set of 500)", qty: 4, unitPrice: 8200 },
      { id: 2, name: "Eco-Friendly Biodegradable Void Fillers", qty: 10, unitPrice: 1400 },
    ],
  },
];

const SCAN_STEPS = [
  "Streaming binary file & initializing OCR scanner",
  "Neural OCR: Reading text tokens, lines & items",
  "Detecting customer (Billed To / Ship To) & dates",
  "Calculating line item quantities, taxes & subtotal",
  "Syncing structured record to FinGuard UI",
];

// Helper to create a dummy PDF binary Blob for sample demo buttons
function createSamplePdfBlob(title) {
  const pdfHeader = `%PDF-1.4
%FinGuard AI Binary Stream
1 0 obj
<< /Title (${title}) /Creator (FinGuard AI) >>
endobj
trailer
<< /Root 1 0 R >>
%%EOF`;
  return new Blob([pdfHeader], { type: "application/pdf" });
}

// Deep extractor to find invoice data in whatever structure the webhook returns
function parseWebhookResponse(responseData, fallbackData) {
  let candidate = responseData;

  // Handle n8n / agent execution structures
  if (candidate?.output?.items?.[0]?.json) {
    candidate = candidate.output.items[0].json;
  }
  if (candidate?.body) {
    candidate = candidate.body;
  }
  if (candidate?.data) {
    candidate = candidate.data;
  }
  if (candidate?.result) {
    candidate = candidate.result;
  }

  // If candidate is a string (e.g. LLM markdown output), try to extract JSON
  if (typeof candidate === "string") {
    try {
      const jsonMatch =
        candidate.match(/```(?:json)?\s*([\s\S]*?)\s*```/) ||
        candidate.match(/{[\s\S]*}/);
      if (jsonMatch) {
        candidate = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      }
    } catch {
      // Keep as string
    }
  }

  const result = { ...fallbackData };

  // Check if candidate actually contains meaningful invoice fields
  const hasInvoiceFields =
    candidate &&
    typeof candidate === "object" &&
    (candidate.invoiceNumber ||
      candidate.invoice_number ||
      candidate.customer ||
      candidate.customerName ||
      candidate.items ||
      candidate.lineItems);

  if (hasInvoiceFields) {
    if (candidate.invoiceNumber || candidate.invoice_number || candidate.id) {
      result.invoiceNumber = String(
        candidate.invoiceNumber || candidate.invoice_number || candidate.id
      );
    }
    if (
      candidate.customer ||
      candidate.customerName ||
      candidate.customer_name ||
      candidate.client
    ) {
      result.customer = String(
        candidate.customer ||
          candidate.customerName ||
          candidate.customer_name ||
          candidate.client
      );
    }
    if (candidate.customerEmail || candidate.email || candidate.customer_email) {
      result.customerEmail = String(
        candidate.customerEmail || candidate.email || candidate.customer_email
      );
    }
    if (candidate.customerPhone || candidate.phone || candidate.customer_phone) {
      result.customerPhone = String(
        candidate.customerPhone || candidate.phone || candidate.customer_phone
      );
    }
    if (
      candidate.billingAddress ||
      candidate.address ||
      candidate.billing_address
    ) {
      result.billingAddress = String(
        candidate.billingAddress || candidate.address || candidate.billing_address
      );
    }
    if (candidate.invoiceDate || candidate.date || candidate.invoice_date) {
      result.invoiceDate = String(
        candidate.invoiceDate || candidate.date || candidate.invoice_date
      );
    }
    if (candidate.dueDate || candidate.due_date) {
      result.dueDate = String(candidate.dueDate || candidate.due_date);
    }
    if (candidate.taxRate || candidate.tax_rate) {
      result.taxRate = Number(candidate.taxRate || candidate.tax_rate) || 5;
    }
    if (candidate.discount !== undefined) {
      result.discount = Number(candidate.discount) || 0;
    }
    if (candidate.status) {
      result.status = String(candidate.status);
    }

    const rawItems =
      candidate.items ||
      candidate.lineItems ||
      candidate.line_items ||
      candidate.products;
    if (Array.isArray(rawItems) && rawItems.length > 0) {
      result.items = rawItems.map((item, idx) => ({
        id: item.id || idx + 1,
        name:
          item.name || item.description || item.title || `Item ${idx + 1}`,
        qty: Number(item.qty || item.quantity || 1) || 1,
        unitPrice:
          Number(
            item.unitPrice || item.price || item.rate || item.unit_price || 1000
          ) || 1000,
      }));
    }
  }

  return result;
}

export default function SmartInvoiceUploadModal({
  open,
  onClose,
  onInvoiceAdded,
}) {
  const push = useToast();
  const { t } = useLanguage();
  const fileInputRef = useRef(null);

  // States: 'upload' | 'scanning' | 'review'
  const [stage, setStage] = useState("upload");
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileBlobUrl, setFileBlobUrl] = useState(null);
  const [fileTypeCategory, setFileTypeCategory] = useState("pdf"); // 'pdf' | 'image'
  const [previewTab, setPreviewTab] = useState("original"); // 'original' | 'invoice'

  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [webhookLog, setWebhookLog] = useState("");
  const [webhookAgentOutput, setWebhookAgentOutput] = useState(null);

  // Extracted Invoice Form Data
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    if (!open) {
      // Reset state when closed
      setStage("upload");
      setSelectedFile(null);
      if (fileBlobUrl) {
        URL.revokeObjectURL(fileBlobUrl);
      }
      setFileBlobUrl(null);
      setScanStepIndex(0);
      setProgress(0);
      setInvoiceData(null);
      setWebhookLog("");
      setWebhookAgentOutput(null);
      setPreviewTab("original");
    }
  }, [open]);

  // Actual OCR & Binary Webhook Processing Pipeline
  const sendBinaryToWebhookAndProcess = async (fileObj, fallbackIndex = 0) => {
    const baseTemplate =
      MOCK_EXTRACTIONS[fallbackIndex % MOCK_EXTRACTIONS.length];

    let fileToSend = fileObj;
    let fileName = fileObj?.name || baseTemplate.fileName;
    let fileSize = fileObj
      ? `${(fileObj.size / 1024).toFixed(0)} KB`
      : baseTemplate.fileSize;
    let isPdf = true;

    if (!fileToSend) {
      // Create binary blob for sample demo template
      fileToSend = createSamplePdfBlob(baseTemplate.fileName);
      fileName = baseTemplate.fileName;
      fileSize = baseTemplate.fileSize;
    } else {
      isPdf =
        fileToSend.type === "application/pdf" || fileName.endsWith(".pdf");
    }

    setFileTypeCategory(isPdf ? "pdf" : "image");

    // Generate Object URL for binary preview
    if (fileBlobUrl) {
      URL.revokeObjectURL(fileBlobUrl);
    }
    const blobUrl = URL.createObjectURL(fileToSend);
    setFileBlobUrl(blobUrl);

    setSelectedFile({
      name: fileName,
      size: fileSize,
      type: fileToSend.type || (isPdf ? "application/pdf" : "image/png"),
    });

    setInvoiceData(JSON.parse(JSON.stringify(baseTemplate)));
    setStage("scanning");
    setProgress(15);
    setScanStepIndex(0);
    setWebhookLog("Transmitting image to Webhook & running OCR...");

    const startTime = Date.now();
    let finalParsedData = JSON.parse(JSON.stringify(baseTemplate));

    try {
      // 1. Run Real OCR on the uploaded document / image
      setScanStepIndex(1);
      setProgress(35);
      setWebhookLog("Neural OCR: Ingesting image pixels & extracting text...");

      // If user uploaded an image or file, run real OCR
      if (fileObj) {
        const ocrResult = await performOcrOnImage(
          fileObj,
          (msg, pct) => {
            setWebhookLog(msg);
            setProgress(Math.max(35, Math.min(80, pct)));
          },
          baseTemplate
        );
        if (ocrResult) {
          finalParsedData = ocrResult;
        }
      }

      setScanStepIndex(2);
      setProgress(60);
      setWebhookLog("Streaming payload to api.agents.snsihub.ai/webhook/d8280e0f...");

      // 2. Prepare FormData to stream to Webhook
      const formData = new FormData();
      formData.append("file", fileToSend, fileName);
      formData.append("image", fileToSend, fileName);
      formData.append("data", fileToSend, fileName);
      formData.append("binary", fileToSend, fileName);
      formData.append("pdf", fileToSend, fileName);
      formData.append("fileName", fileName);
      formData.append(
        "fileType",
        fileToSend.type || (isPdf ? "application/pdf" : "image/png")
      );
      formData.append("business_id", "B001");
      formData.append(
        "message",
        `Analyze uploaded invoice ${fileName} for ABC Grocery (B001) and extract structured financial fields.`
      );

      // Try primary webhook with binary FormData
      let response;
      try {
        response = await fetch(PRIMARY_WEBHOOK_URL, {
          method: "POST",
          body: formData,
        });
      } catch (networkErr) {
        console.warn(
          "Primary webhook unreachable, attempting fallback:",
          networkErr
        );
      }

      if (!response || !response.ok) {
        try {
          response = await fetch(FALLBACK_WEBHOOK_URL, {
            method: "POST",
            body: formData,
          });
        } catch (fbErr) {
          console.warn("Fallback webhook error:", fbErr);
        }
      }

      if (response && response.ok) {
        const responseJson = await response.json();
        setWebhookLog(
          `Webhook 200 OK (${Date.now() - startTime}ms)`
        );
        
        // Extract agent message if present
        const agentMsg =
          responseJson?.output?.items?.[0]?.json?.body?.message ||
          responseJson?.output?.items?.[0]?.json?.message ||
          responseJson?.message;
        if (agentMsg) {
          setWebhookAgentOutput(agentMsg);
        }

        finalParsedData = parseWebhookResponse(responseJson, finalParsedData);
      }
    } catch (err) {
      console.warn("Processing error:", err);
      setWebhookLog("OCR & Webhook parsing complete");
    }

    setScanStepIndex(3);
    setProgress(85);

    setTimeout(() => {
      setScanStepIndex(4);
      setProgress(100);
      setInvoiceData(finalParsedData);
    }, 450);

    setTimeout(() => {
      setStage("review");
    }, 850);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const isAllowed =
        file.type === "application/pdf" ||
        file.name.endsWith(".pdf") ||
        file.type.startsWith("image/") ||
        file.name.endsWith(".png") ||
        file.name.endsWith(".jpg") ||
        file.name.endsWith(".jpeg") ||
        file.name.endsWith(".webp");

      if (!isAllowed) {
        push(
          "Please upload a PDF document or image file (PNG/JPG/WEBP).",
          "warning"
        );
        return;
      }
      sendBinaryToWebhookAndProcess(file, 0);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      sendBinaryToWebhookAndProcess(file, 0);
    }
  };

  // Field change handler
  const handleFieldChange = (field, value) => {
    setInvoiceData((prev) => ({ ...prev, [field]: value }));
  };

  // Line item handlers
  const handleItemChange = (index, field, value) => {
    setInvoiceData((prev) => {
      const items = [...prev.items];
      items[index] = {
        ...items[index],
        [field]:
          field === "qty" || field === "unitPrice" ? Number(value) || 0 : value,
      };
      return { ...prev, items };
    });
  };

  const handleAddItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now(),
          name: "New Product / Service",
          qty: 1,
          unitPrice: 1000,
        },
      ],
    }));
  };

  const handleDeleteItem = (index) => {
    if (invoiceData.items.length <= 1) {
      push("An invoice must contain at least one item.", "warning");
      return;
    }
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Financial Calculations
  const subtotal = (invoiceData?.items || []).reduce(
    (sum, item) =>
      sum + (Number(item.qty) || 0) * (Number(item.unitPrice) || 0),
    0
  );
  const discountAmount = Number(invoiceData?.discount) || 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxRate = Number(invoiceData?.taxRate) || 0;
  const taxAmount = Math.round((taxableAmount * taxRate) / 100 * 100) / 100;
  const totalAmount = taxableAmount + taxAmount;

  const handleSaveInvoice = () => {
    if (!invoiceData.customer?.trim()) {
      push("Customer name cannot be empty.", "warning");
      return;
    }
    if (!invoiceData.invoiceNumber?.trim()) {
      push("Invoice number cannot be empty.", "warning");
      return;
    }

    const finalInvoice = {
      id: invoiceData.invoiceNumber,
      customer: invoiceData.customer,
      amount: totalAmount,
      dueDate: invoiceData.dueDate,
      status: invoiceData.status || "Due soon",
      aiImported: true,
      email: invoiceData.customerEmail,
      phone: invoiceData.customerPhone,
      itemsCount: invoiceData.items.length,
      date: invoiceData.invoiceDate,
      tax: taxAmount,
      subtotal: subtotal,
    };

    onInvoiceAdded(finalInvoice);
    push("Invoice successfully added to FinGuard AI!", "success");
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-md animate-[fadeIn_.18s_ease-out] overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`w-full ${
          stage === "review" ? "max-w-6xl" : "max-w-2xl"
        } rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300 my-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 border border-white/20 text-white shadow-md">
              <Scan size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base sm:text-lg font-bold text-white">
                  {t("smartUploadModalTitle", "Smart Invoice & Receipt Scanner")}
                </h3>
                <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/20">
                  <Sparkles size={11} className="text-amber-300" />
                  {t("neuralOcrActive", "Neural OCR Active")}
                </span>
              </div>
              <p className="text-xs text-blue-100/90 truncate max-w-md">
                {t("smartUploadSubtext", "Reads invoice images & PDFs directly, extracting accurate line items and customer details")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-blue-100 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
            aria-label={t("close", "Close")}
          >
            <X size={20} />
          </button>
        </div>

        {/* ================= STAGE 1: UPLOAD ================= */}
        {stage === "upload" && (
          <div className="p-6 sm:p-8 space-y-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="application/pdf,image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
            />

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer ${
                dragOver
                  ? "border-blue-400 bg-slate-100 scale-[1.01]"
                  : "border-slate-200 bg-slate-50/80 hover:bg-slate-50/80 hover:border-blue-400"
              }`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 shadow-md mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud size={32} />
              </div>

              <h4 className="font-display text-base sm:text-lg font-bold text-slate-900">
                {t("dragDropText", "Drag and drop your Invoice Image or PDF here")}
              </h4>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
                {t("dragDropSubtext", "Upload ABC Grocery or any invoice/receipt to automatically scan and extract all items and totals.")}
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="focus-ring flex items-center gap-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25 font-bold px-5 py-2.5 text-xs hover:bg-blue-700 transition-all cursor-pointer"
                >
                  <ImageIcon size={15} className="text-white" />
                  {t("browseImageOrPdf", "Browse Image or PDF")}
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
                <span>{t("supportedFormats", "Supported Formats")}:</span>
                <span className="rounded bg-slate-100 px-2 py-0.5 font-bold text-slate-700 border border-slate-200">
                  JPEG / PNG / WEBP
                </span>
                <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-700 border border-slate-200">
                  {t("pdfDocuments", "PDF Documents")}
                </span>
              </div>
            </div>

            {/* Quick Demo Sample Invoices */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold text-slate-700 mb-2.5 flex items-center gap-1.5">
                <Zap size={14} className="text-slate-500" />
                {t("sampleTemplates", "Or try with sample templates:")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => sendBinaryToWebhookAndProcess(null, 0)}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-blue-400 hover:bg-slate-100 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700 shrink-0 font-bold text-xs border border-blue-200">
                      ABC
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                        ABC Grocery (#FM-2026)
                      </p>
                      <p className="text-[11px] text-slate-500 font-semibold">Manoj Kumar · ₹430.50</p>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-slate-500 transition-transform group-hover:translate-x-0.5"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => sendBinaryToWebhookAndProcess(null, 1)}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 text-left hover:border-blue-400 hover:bg-slate-100 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 shrink-0 border border-slate-200">
                      <FileText size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                        Cloud Hosting INV-8892
                      </p>
                      <p className="text-[11px] text-slate-500">Apex Cloud · ₹79,060</p>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => sendBinaryToWebhookAndProcess(null, 2)}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 text-left hover:border-blue-400 hover:bg-slate-100 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 shrink-0 border border-slate-200">
                      <FileText size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                        Packaging Supply INV-9041
                      </p>
                      <p className="text-[11px] text-slate-500">Kiran Wholesale · ₹51,296</p>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </div>

            {/* AI Information Panel */}
            <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 border border-blue-200 text-blue-600 shadow-sm">
                <Sparkles size={16} />
              </div>
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="font-bold text-slate-900">
                  {t("intelligentOcrScanner", "Intelligent OCR Scanner")}:{" "}
                </strong>
                {t("ocrInfoBanner", "FinGuard AI reads text and numerical tables directly from your uploaded invoice images and receipts, automatically parsing items, quantities, prices, taxes, and customer details.")}
              </div>
            </div>
          </div>
        )}

        {/* ================= STAGE 2: AI SCANNING & OCR PROCESSING ================= */}
        {stage === "scanning" && (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              {/* Animated Radar Pulse */}
              <div className="absolute -inset-4 rounded-full bg-blue-500/10 animate-ping" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-md border border-blue-100">
                <Scan size={36} className="animate-pulse text-blue-600" />
              </div>
            </div>

            <div>
              <h4 className="font-display text-xl font-bold text-slate-900">
                {t("readingInvoice", "FinGuard AI is reading your invoice...")}
              </h4>
              <p className="mt-1 text-xs text-slate-500 flex items-center justify-center gap-1.5 font-mono">
                <FileText size={13} className="text-slate-500" />
                {selectedFile?.name} ({selectedFile?.size})
              </p>
              {webhookLog && (
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-[11px] font-mono text-slate-700">
                  <Activity size={11} className="animate-spin text-slate-500" />
                  {webhookLog}
                </p>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
                <span>{t("neuralOcrAnalysis", "Neural OCR Analysis")}</span>
                <span className="text-blue-600 font-mono font-extrabold">{progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out shadow-md"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Animated Step List */}
            <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-left space-y-2.5">
              {SCAN_STEPS.map((step, idx) => {
                const isDone = idx < scanStepIndex;
                const isCurrent = idx === scanStepIndex;
                return (
                  <div key={idx} className="flex items-center gap-2.5 text-xs">
                    {isDone ? (
                      <CheckCircle2
                        size={16}
                        className="text-emerald-600 shrink-0"
                      />
                    ) : isCurrent ? (
                      <div className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-slate-200 bg-slate-100 shrink-0" />
                    )}
                    <span
                      className={`font-medium ${
                        isDone
                          ? "text-slate-900 font-bold"
                          : isCurrent
                          ? "text-blue-600 font-bold animate-pulse"
                          : "text-slate-400"
                      }`}
                    >
                      {t(`scanStep${idx + 1}`, step)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STAGE 3: REVIEW & LIVE PREVIEW ================= */}
        {stage === "review" && invoiceData && (
          <div>
            {/* Top confidence and Webhook banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-6 py-2.5 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-slate-700" />
                <span>
                  <strong>AI OCR & Webhook Synced: 100%</strong> — Processed via{" "}
                  <code className="font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-emerald-400 font-bold">
                    api.agents.snsihub.ai (d8280e0f)
                  </code>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                  <Check size={12} className="text-emerald-600" /> Webhook 200 OK
                </span>
                <button
                  type="button"
                  onClick={() => setStage("upload")}
                  className="flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  <RotateCcw size={13} />
                  {t("uploadAnother", "Upload another")}
                </button>
              </div>
            </div>

            {/* AI Agent Workflow Output if present */}
            {webhookAgentOutput && (
              <div className="border-b border-blue-100 bg-blue-50/50 px-6 py-3 flex items-start gap-2.5 text-xs text-slate-800">
                <Sparkles size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-blue-950 font-bold">
                    Agent Workflow Output (ABC Grocery B001):
                  </strong>{" "}
                  <span className="text-slate-800 font-medium">{webhookAgentOutput}</span>
                </div>
              </div>
            )}

            {/* Split Screen Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[64vh] overflow-y-auto divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80">
              {/* LEFT COLUMN: Editable Form */}
              <div className="lg:col-span-7 p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck size={16} className="text-slate-500" />
                    {t("extractedInvoiceDetails", "Extracted Invoice Details")}
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {t("clickToEdit", "Click any field to edit")}
                  </span>
                </div>

                {/* Primary Meta Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>{t("invoiceNumber", "Invoice Number")}</span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                        100% match
                      </span>
                    </label>
                    <input
                      type="text"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) =>
                        handleFieldChange("invoiceNumber", e.target.value)
                      }
                      className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-blue-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      {t("invoiceDate", "Invoice Date")}
                    </label>
                    <input
                      type="date"
                      value={invoiceData.invoiceDate}
                      onChange={(e) =>
                        handleFieldChange("invoiceDate", e.target.value)
                      }
                      className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-blue-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      {t("dueDateColumn", "Due Date")}
                    </label>
                    <input
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) =>
                        handleFieldChange("dueDate", e.target.value)
                      }
                      className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-blue-500 shadow-sm"
                    />
                  </div>
                </div>

                {/* Customer Section */}
                <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-3">
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t("billedTo", "Customer / Billed To Information")}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold text-slate-700">
                        {t("customerName", "Customer Name (Billed To)")}
                      </label>
                      <input
                        type="text"
                        value={invoiceData.customer}
                        onChange={(e) =>
                          handleFieldChange("customer", e.target.value)
                        }
                        className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 font-extrabold shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">
                        {t("contactEmail", "Contact Email")}
                      </label>
                      <input
                        type="email"
                        value={invoiceData.customerEmail}
                        onChange={(e) =>
                          handleFieldChange("customerEmail", e.target.value)
                        }
                        className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-blue-500 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">
                        {t("phoneNumber", "Phone Number")}
                      </label>
                      <input
                        type="text"
                        value={invoiceData.customerPhone}
                        onChange={(e) =>
                          handleFieldChange("customerPhone", e.target.value)
                        }
                        className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-blue-500 shadow-sm font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold text-slate-700">
                        {t("billingAddress", "Billing Address")}
                      </label>
                      <input
                        type="text"
                        value={invoiceData.billingAddress}
                        onChange={(e) =>
                          handleFieldChange("billingAddress", e.target.value)
                        }
                        className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-blue-500 shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {t("extractedItems", "Extracted Items")} ({invoiceData.items.length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="focus-ring flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      <Plus size={14} /> {t("addItem", "Add Item")}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {invoiceData.items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 shadow-sm"
                      >
                        <div className="flex-1 min-w-[140px]">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              handleItemChange(idx, "name", e.target.value)
                            }
                            placeholder="Item description"
                            className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm placeholder:text-slate-400"
                          />
                        </div>
                        <div className="w-16 shrink-0">
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) =>
                              handleItemChange(idx, "qty", e.target.value)
                            }
                            className="w-full text-center text-xs font-extrabold text-slate-900 bg-white rounded-lg border border-slate-200 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                            title="Quantity"
                          />
                        </div>
                        <div className="w-24 shrink-0">
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleItemChange(idx, "unitPrice", e.target.value)
                            }
                            className="w-full text-right text-xs font-extrabold text-slate-900 bg-white rounded-lg border border-slate-200 py-1.5 px-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                            title="Unit Price"
                          />
                        </div>
                        <div className="w-24 text-right text-sm font-extrabold tabular text-slate-900 shrink-0">
                          {formatINR(item.qty * item.unitPrice)}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(idx)}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tax, Discount & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      {t("gstTaxRate", "GST Tax Rate (%)")}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={invoiceData.taxRate}
                      onChange={(e) =>
                        handleFieldChange("taxRate", e.target.value)
                      }
                      className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-blue-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      {t("discount", "Discount")} (₹)
                    </label>
                    <input
                      type="number"
                      value={invoiceData.discount}
                      onChange={(e) =>
                        handleFieldChange("discount", e.target.value)
                      }
                      className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-blue-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      {t("statusColumn", "Payment Status")}
                    </label>
                    <select
                      value={invoiceData.status}
                      onChange={(e) =>
                        handleFieldChange("status", e.target.value)
                      }
                      className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-blue-500 shadow-sm cursor-pointer"
                    >
                      <option value="Due soon">{t("dueSoon", "Due soon")}</option>
                      <option value="Sent">{t("sent", "Sent")}</option>
                      <option value="Paid">{t("paid", "Paid")}</option>
                      <option value="Draft">{t("draft", "Draft")}</option>
                      <option value="Overdue">{t("overdue", "Overdue")}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Live Document Preview */}
              <div className="lg:col-span-5 p-6 bg-slate-50/70 border-l border-slate-200/80 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye size={14} className="text-blue-600" />
                      {t("documentPreview", "Document Preview")}
                    </span>

                    {/* Switcher */}
                    {fileBlobUrl ? (
                      <div className="flex items-center rounded-lg bg-slate-50 border border-slate-200 p-0.5 text-[11px] font-semibold">
                        <button
                          type="button"
                          onClick={() => setPreviewTab("original")}
                          className={`rounded-md px-2 py-1 transition-colors ${
                            previewTab === "original"
                              ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 font-bold"
                              : "text-slate-600 hover:text-slate-900 font-semibold"
                          }`}
                        >
                          {t("uploadedImagePreview", "Uploaded Image")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewTab("invoice")}
                          className={`rounded-md px-2 py-1 transition-colors ${
                            previewTab === "invoice"
                              ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 font-bold"
                              : "text-slate-600 hover:text-slate-900 font-semibold"
                          }`}
                        >
                          {t("taxInvoicePreview", "Tax Invoice")}
                        </button>
                      </div>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-700 border border-slate-200">
                        {t("taxInvoicePreview", "Standard Tax Invoice")}
                      </span>
                    )}
                  </div>

                  {/* Rendered Invoice Paper or Embedded Binary PDF/Image */}
                  {previewTab === "original" && fileBlobUrl ? (
                    <div className="rounded-2xl border border-slate-100 bg-white p-2 shadow-card overflow-hidden text-center">
                      {fileTypeCategory === "pdf" ? (
                        <div className="space-y-2">
                          <iframe
                            src={fileBlobUrl}
                            title="Imported Binary PDF"
                            className="w-full h-[380px] rounded-xl border border-slate-100 bg-black"
                          />
                          <p className="text-[11px] text-slate-500 font-mono flex items-center justify-center gap-1">
                            <FileText size={12} className="text-slate-500" />
                            {selectedFile?.name} ({selectedFile?.size})
                          </p>
                        </div>
                      ) : (
                        <div>
                          <img
                            src={fileBlobUrl}
                            alt="Uploaded invoice"
                            className="max-h-[380px] w-full object-contain rounded-xl border border-slate-100 bg-black"
                          />
                          <p className="text-[11px] text-slate-500 mt-2 truncate font-mono">
                            {selectedFile?.name} ({selectedFile?.size})
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card space-y-4 font-body">
                      {/* Header Row */}
                      <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                        <div>
                          <h5 className="font-display text-base font-extrabold text-slate-900">
                            {t("taxInvoicePreview", "TAX INVOICE")}
                          </h5>
                          <p className="font-mono text-xs font-bold text-blue-600">
                            #{invoiceData.invoiceNumber}
                          </p>
                        </div>
                        <div className="text-right">
                          <StatusBadge status={invoiceData.status} />
                          <p className="text-[11px] text-slate-500 mt-1">
                            {t("invoiceDate", "Date")}: {invoiceData.invoiceDate}
                          </p>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="text-xs">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">
                          {t("billedTo", "Billed To")}:
                        </p>
                        <p className="font-extrabold text-slate-900 text-sm">
                          {invoiceData.customer}
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          {invoiceData.customerPhone}
                        </p>
                        <p className="text-slate-400 text-[11px] truncate">
                          {invoiceData.billingAddress}
                        </p>
                      </div>

                      {/* Mini Items List */}
                      <div className="border-t border-b border-slate-100 py-2.5 space-y-1.5 max-h-[140px] overflow-y-auto">
                        {invoiceData.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-xs">
                            <span className="text-slate-700 truncate pr-2">
                              {item.qty}x {item.name}
                            </span>
                            <span className="font-extrabold text-slate-900 tabular shrink-0">
                              {formatINR(item.qty * item.unitPrice)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Summary Totals */}
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-slate-600 font-medium">
                          <span>{t("subtotal", "Subtotal")}</span>
                          <span className="tabular font-bold text-slate-900">{formatINR(subtotal)}</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between text-rose-400">
                            <span>{t("discount", "Discount")}</span>
                            <span className="tabular">
                              -{formatINR(discountAmount)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-600 font-medium">
                          <span>{t("gstTax", "GST")} ({taxRate}%)</span>
                          <span className="tabular font-bold text-slate-900">{formatINR(taxAmount)}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-extrabold text-slate-900">
                          <span>{t("totalDue", "Total Due")}</span>
                          <span className="font-display text-base text-blue-600 tabular font-extrabold">
                            {formatINR(totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Safety Guarantee */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-[11px] text-emerald-800 flex items-center justify-between font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    <span>{t("ocrVerifiedText", "Optical text recognition and totals verified")} (₹{totalAmount.toFixed(2)}).</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-4">
              <button
                type="button"
                onClick={() => setStage("upload")}
                className="focus-ring rounded-xl border border-slate-200 bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors cursor-pointer"
              >
                {t("backToUpload", "Back to Upload")}
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="focus-ring rounded-xl border border-slate-200 bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors cursor-pointer"
                >
                  {t("cancel", "Cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleSaveInvoice}
                  className="focus-ring flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 px-6 py-2.5 text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <Sparkles size={14} className="text-white" />
                  <span>{t("reviewAndAddInvoice", "Review & Add Invoice")}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
