"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function Program() {
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfLoaded, setPdfLoaded] = useState<boolean>(false);

  return (
    <div className="flex flex-row justify-center">
      {/* Load PDF first to get the number of pages */}
      <Document
        file="/Final-Program.pdf"
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages);
          setPdfLoaded(true);
        }}
        className="hidden" // Hide initial render
      />

      {/* Only show flipbook after PDF is loaded */}
      {pdfLoaded && (
        <HTMLFlipBook
          width={400}
          height={570}
          size="fixed"
          minWidth={300}
          maxWidth={500}
          minHeight={400}
          maxHeight={570}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          className="shadow-lg"
          startPage={0}
          drawShadow={true}
          flippingTime={1000}
          usePortrait={true}
          startZIndex={1}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
          style={{}}
        >
          {[...Array(numPages)].map((_, index) => (
            <div
              key={index}
              className="w-[400px] h-[600px] flex justify-center items-center bg-white overflow-hidden"
            >
              <Document file="/Final-Program.pdf">
                <Page pageNumber={index + 1} width={400} height={570} />
              </Document>
            </div>
          ))}
        </HTMLFlipBook>
      )}
    </div>
  );
}
