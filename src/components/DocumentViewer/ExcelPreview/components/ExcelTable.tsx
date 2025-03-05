
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExcelData } from "../types";

interface ExcelTableProps {
  data: ExcelData;
}

export const ExcelTable = ({ data }: ExcelTableProps) => {
  const { headers, rows } = data;

  return (
    <div className="border rounded-md overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={index} className="font-bold">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex} className={rowIndex === rows.length - 1 ? "font-bold" : ""}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className={cellIndex === 0 ? "font-semibold" : ""}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
