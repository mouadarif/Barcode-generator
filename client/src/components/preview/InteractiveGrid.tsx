import { useBarcodeStore } from "@/stores/useBarcodeStore";
import BarcodeCell from "./BarcodeCell";

const PAGE_SIZES = {
  A4: { width: 210, height: 297 },
  A1: { width: 594, height: 841 },
} as const;

const DEFAULT_SPACING = 16;

export default function InteractiveGrid() {
  const { data, config, lineSpacing, columnSpacing } = useBarcodeStore();

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">Aucune donnée</p>
          <p className="text-sm">Importez un fichier CSV ou Excel pour commencer</p>
        </div>
      </div>
    );
  }

  const columns = Math.max(config.columns, 1);
  const rowsPerPage = Math.max(config.rows, 1);
  const itemsPerPage = columns * rowsPerPage;
  const totalRows = Math.ceil(data.length / columns);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const pageSize = PAGE_SIZES[config.pageFormat] ?? PAGE_SIZES.A4;
  const pagePadding = Math.max(config.margin, 0);

  // Calculate available height for content
  const availableHeight = (pageSize.height - pagePadding * 2) * 3.7795; // Convert mm to px (1mm ≈ 3.7795px)
  
  // Calculate total spacing between rows
  const totalSpacing = rowsPerPage > 1 ? (DEFAULT_SPACING * (rowsPerPage - 1)) : 0;
  
  // Calculate height per row
  const rowHeight = (availableHeight - totalSpacing) / rowsPerPage;
  
  // Calculate optimal barcode height (leaving room for text and padding)
  const optimalBarcodeHeight = Math.max(
    30, // Minimum barcode height
    Math.min(
      150, // Maximum barcode height
      rowHeight - config.globalSettings.cellPadding * 2 - config.globalSettings.fontSize - config.globalSettings.textMargin - 20
    )
  );

  return (
    <div className="space-y-8">
      {Array.from({ length: totalPages }, (_, pageIndex) => {
        const pageStartIndex = pageIndex * itemsPerPage;
        const remainingItems = Math.max(data.length - pageStartIndex, 0);
        const rowsInPage = Math.min(rowsPerPage, Math.ceil(remainingItems / columns));

        if (rowsInPage <= 0) {
          return null;
        }

        return (
          <div
            key={`page-${pageIndex}`}
            className="preview-page bg-white shadow-lg mx-auto rounded"
            style={{
              width: `${pageSize.width}mm`,
              height: `${pageSize.height}mm`,
              padding: `${pagePadding}mm`,
              boxSizing: 'border-box',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            {Array.from({ length: rowsInPage }, (_, rowOffset) => {
              const currentRowIndex = pageIndex * rowsPerPage + rowOffset;
              const rowStartIndex = pageStartIndex + rowOffset * columns;
              const rowSpacing = lineSpacing.get(currentRowIndex) ?? DEFAULT_SPACING;
              const isLastRowOverall = currentRowIndex >= totalRows - 1;

              return (
                <div key={`page-${pageIndex}-row-${rowOffset}`} style={{ flex: '0 0 auto' }}>
                  <div className="flex">
                    {Array.from({ length: columns }, (_, colIndex) => {
                      const dataIndex = rowStartIndex + colIndex;
                      const item = dataIndex < data.length ? data[dataIndex] : undefined;
                      const spacingAfterColumn = columnSpacing.get(colIndex) ?? DEFAULT_SPACING;
                      const isLastColumn = colIndex === columns - 1;

                      return (
                        <div
                          key={item ? item.id : `placeholder-${pageIndex}-${rowOffset}-${colIndex}`}
                          className="flex-1 min-w-0"
                          style={{
                            marginRight: isLastColumn ? 0 : `${spacingAfterColumn}px`,
                            minHeight: `${rowHeight}px`,
                          }}
                        >
                          {item ? (
                            <BarcodeCell
                              value={item.value}
                              text={item.text}
                              row={currentRowIndex}
                              col={colIndex}
                              customBarcodeHeight={optimalBarcodeHeight}
                            />
                          ) : (
                            <div className="h-full w-full" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {rowOffset < rowsInPage - 1 && (
                    <div style={{ height: `${rowSpacing}px`, flex: '0 0 auto' }} />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
