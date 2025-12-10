import { Upload, FileText } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils/cn";

type Props = {
  onFileChange: (file: File) => void;
  isLoading: boolean;
};

export function FileUpload({ onFileChange, isLoading }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "text/csv" || file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      onFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  return (
    <div
      className={cn(
        "min-h-[60vh] rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center space-y-6 p-8",
        isDragOver
          ? "border-blue-500 bg-blue-50 shadow-xl scale-105"
          : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50"
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <div className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          <Upload className={cn("h-10 w-10 text-blue-600 transition-transform", isDragOver && "scale-110")} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isDragOver ? "Drop your file here" : "Upload your product data"}
          </h2>
          <p className="text-gray-600 mb-4">
            Drag and drop a CSV or Excel file, or click to browse
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>CSV</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>XLSX</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>XLS</span>
            </div>
          </div>
        </div>
        {!isLoading && (
          <Button variant="outline" className="mt-4">
            Choose File
          </Button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isLoading}
      />
    </div>
  );
}
