import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye } from "lucide-react";

import { Product } from "@/core/domain/product";

type Props = { products: Product[] };

export function ProductsPreview({ products }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Products Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="table">
          <TabsList>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>
          <TabsContent value="table">
            <div className="h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {products[0] &&
                      Object.keys(products[0].toObject()).map((field) => (
                        <TableHead key={field} className="min-w-[120px]">{field.replace(/_/g, " ")}</TableHead>
                      ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p, i) => (
                    <TableRow key={i}>
                      {Object.values(p.toObject()).map((v, j) => (
                        <TableCell key={j} className="min-w-[120px]">{v}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="json">
            <ScrollArea className="h-96">
              <div className="overflow-x-auto">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(
                    products.map((p) => p.toObject()),
                    null,
                    2,
                  )}
                </pre>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
