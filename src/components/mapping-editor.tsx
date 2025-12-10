import { MapPin, X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { ProductFieldName, Mapping } from "@/core/domain/product";

type Props = {
  headers: string[];
  mapping: Mapping;
  onMappingChange: (field: string, value: string) => void;
};

export function MappingEditor({ headers, mapping, onMappingChange }: Props) {
  const handleMappingChange = (field: string, value: string) => {
    onMappingChange(field, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Field Mapping
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-3">
          {Object.keys(mapping).map((field) => (
            <div
              key={field}
              className="flex items-center space-x-2 rounded-md p-2 transition-colors hover:bg-gray-50"
            >
              <label className="w-32 font-medium text-gray-700">{field.replace(/_/g, " ")}</label>
              <Select
                value={mapping[field as ProductFieldName] || ""}
                onValueChange={(value) => handleMappingChange(field, value)}
              >
                <SelectTrigger className="flex-1 cursor-pointer">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {headers.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleMappingChange(field, "")}
                className="h-8 w-8 cursor-pointer p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
