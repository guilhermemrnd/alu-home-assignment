"use client";

import { Database } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { useProductsData } from "@/hooks/use-products-data";

import { Chat } from "@/components/chat";
import { FileUpload } from "@/components/file-upload";
import { MappingEditor } from "@/components/mapping-editor";
import { ProductsPreview } from "@/components/products-preview";

export default function Home() {
  const {
    headers,
    mapping,
    products,
    messages,
    handleFileChange,
    handleSendMessage,
    handleReset,
    handleMappingChange,
    uploadError,
    chatError,
    isUploading,
    isChatting,
  } = useProductsData();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mx-auto max-w-screen-2xl space-y-4">
        <header className="flex items-center justify-between py-6">
          <div className="flex-1 text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Database className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Product Data Management</h1>
            </div>
            <p className="mx-auto max-w-xl text-base text-gray-600">
              Upload, map, preview, and chat with your product data using AI
            </p>
          </div>
          {headers.length > 0 && (
            <Button
              onClick={handleReset}
              variant="destructive"
              size="sm"
              className="transition-colors hover:bg-red-700 cursor-pointer"
            >
              Reset Session
            </Button>
          )}
        </header>

        {headers.length === 0 ? (
          <section className="min-h-[70vh] relative">
            <FileUpload onFileChange={handleFileChange} isLoading={isUploading} />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-xl">
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span>Uploading and processing file...</span>
                </div>
              </div>
            )}
            {uploadError && (
              <div className="mt-4 flex justify-center">
                <p className="text-sm text-red-600">{uploadError}</p>
              </div>
            )}
          </section>
        ) : (
          <section className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <ProductsPreview products={products} />
                <Chat
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isChatting}
                />
              </div>
              <MappingEditor
                headers={headers}
                mapping={mapping}
                onMappingChange={handleMappingChange}
              />
              {chatError && (
                <Alert variant="destructive">
                  <AlertDescription>{chatError}</AlertDescription>
                </Alert>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
