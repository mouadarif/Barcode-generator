import { forwardRef } from "react";
import { useBarcodeStore } from "@/stores/useBarcodeStore";
import BarcodeCell from "@/components/preview/BarcodeCell";

const PAGE_SIZES = {
  A4: { width: 210, height: 297 },
  A1: { width: 594, height: 841 },
} as const;

const DEFAULT_SPACING = 16;

interface PrintContentProps {
  selectedPages?: number[]; // 1-based page numbers
}

export const PrintContent = forwardRef<HTMLDivElement, PrintContentProps>(({ selectedPages }, ref) => {
  const { data, config, lineSpacing, columnSpacing } = useBarcodeStore();

  if (data.length === 0) {
    return null;
  }

  const columns = Math.max(config.columns, 1);
  const rowsPerPage = Math.max(config.rows, 1);
  const itemsPerPage = columns * rowsPerPage;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const pageSize = PAGE_SIZES[config.pageFormat] ?? PAGE_SIZES.A4;
  const pagePadding = Math.max(config.margin, 0);

  // Calculate available height for content
  const availableHeight = (pageSize.height - pagePadding * 2) * 3.7795; // Convert mm to px
  
  // Calculate total spacing between rows
  const totalSpacing = rowsPerPage > 1 ? (DEFAULT_SPACING * (rowsPerPage - 1)) : 0;
  
  // Calculate height per row
  const rowHeight = (availableHeight - totalSpacing) / rowsPerPage;
  
  // Calculate optimal barcode height
  const optimalBarcodeHeight = Math.max(
    30, // Minimum barcode height
    Math.min(
      150, // Maximum barcode height
      rowHeight - config.globalSettings.cellPadding * 2 - config.globalSettings.fontSize - config.globalSettings.textMargin - 20
    )
  );

  return (
    <div ref={ref} style={{ width: "100%" }}>
      <style>
        {`
          @media print {
            @page {
              size: ${pageSize.width}mm ${pageSize.height}mm;
              margin: 0;
            }
            .print-page {
              page-break-after: always;
              break-after: page;
              width: ${pageSize.width}mm !important;
              height: ${pageSize.height}mm !important;
              padding: ${pagePadding}mm !important;
              margin: 0 !important;
              box-sizing: border-box !important;
              overflow: hidden !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: flex-start !important;
            }
            .print-page:last-child {
              page-break-after: auto;
            }
            .print-row {
              display: flex !important;
              width: 100% !important;
            }
            .print-cell {
              flex: 1 !important;
              min-width: 0 !important;
            }
          }
          @media screen {
            .print-page {
              width: ${pageSize.width}mm;
              min-height: ${pageSize.height}mm;
              padding: ${pagePadding}mm;
              margin-bottom: 20mm;
              background: white;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              display: flex;
              flex-direction: column;
            }
            .print-row {
              display: flex;
              width: 100%;
            }
            .print-cell {
              flex: 1;
              min-width: 0;
            }
          }
        `}
      </style>
      {Array.from({ length: totalPages }, (_, pageIndex) => {
        const pageNumber = pageIndex + 1;
        if (selectedPages && selectedPages.length > 0 && !selectedPages.includes(pageNumber)) {
          return null;
        }
        const pageStartIndex = pageIndex * itemsPerPage;
        const remainingItems = Math.max(data.length - pageStartIndex, 0);
        const rowsInPage = Math.min(rowsPerPage, Math.ceil(remainingItems / columns));

        if (rowsInPage <= 0) {
          return null;
        }

        return (
          <div key={`page-${pageIndex}`} className="print-page">
            {Array.from({ length: rowsInPage }, (_, rowOffset) => {
              const currentRowIndex = pageIndex * rowsPerPage + rowOffset;
              const rowStartIndex = pageStartIndex + rowOffset * columns;
              const rowSpacing = lineSpacing.get(currentRowIndex) ?? DEFAULT_SPACING;

              return (
                <div key={`row-${rowOffset}`} style={{ marginBottom: rowOffset < rowsInPage - 1 ? `${rowSpacing}px` : 0 }}>
                  <div className="print-row">
                    {Array.from({ length: columns }, (_, colIndex) => {
                      const dataIndex = rowStartIndex + colIndex;
                      const item = dataIndex < data.length ? data[dataIndex] : undefined;
                      const spacingAfterColumn = columnSpacing.get(colIndex) ?? DEFAULT_SPACING;
                      const isLastColumn = colIndex === columns - 1;

                      return (
                        <div
                          key={item ? item.id : `empty-${colIndex}`}
                          className="print-cell"
                          style={{
                            marginRight: isLastColumn ? 0 : `${spacingAfterColumn}px`,
                            minHeight: `${rowHeight}px`,
                          }}
                        >
                          {item && (
                            <BarcodeCell
                              value={item.value}
                              text={item.text}
                              row={currentRowIndex}
                              col={colIndex}
                              customBarcodeHeight={optimalBarcodeHeight}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
});

PrintContent.displayName = "PrintContent";
