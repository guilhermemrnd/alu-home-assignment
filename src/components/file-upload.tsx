import { Upload } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  onFileChange: (file: File) => void;
  isLoading: boolean;
};

export function FileUpload({ onFileChange, isLoading }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          File Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onFileChange(file);
              }
            }}
            disabled={isLoading}
          />
          {isLoading && <p className="text-sm text-gray-600">Uploading and processing file...</p>}
        </div>
      </CardContent>
    </Card>
  );
}
