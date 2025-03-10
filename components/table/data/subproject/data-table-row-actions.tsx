"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaEye, FaPrint } from "react-icons/fa";
import { GenerateQRCodeWithLogo } from "@/components/GenerateQrCodeWithLogo";
import { Label } from "@/components/ui/label";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import { useSession } from "next-auth/react";

interface SubprojectDataTableRowActionsProps {
  rowData: any;
}

export function SubprojectDataTableRowActions({
  rowData,
}: SubprojectDataTableRowActionsProps) {
  const { data } = useSession();
  const [qrCode, setQrCode] = useState<string | null>(null);
  console.log("rowData: ", rowData);
  const generatePDF = async () => {
    const element = document.getElementById("print-id");
    if (element) {
      const canvas = await html2canvas(element);
      const imageData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();
      pdf.addImage(imageData, "PNG", 10, 10, 180, 0);

      // Save the PDF file to a URL or as a Blob URL
      const pdfBlob = pdf.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);

      return pdfUrl;
    }
    return null;
  };
  useEffect(() => {
    const { subprojectTitle, component, province, region, type } = rowData;

    // Generate formatted QR code data
    const qrData = `
    Subproject title ${subprojectTitle}\n
    Component: ${component}\n
    Province: ${province}\n
    Region: ${region}\n
    Type: ${type}
`;

    // Generate the QR code
    GenerateQRCodeWithLogo(qrData).then(setQrCode).catch(console.error);
  }, [rowData]);

  const handlePrint = async () => {
    const pdfUrl = await generatePDF();
    if (pdfUrl) {
      // Generate the QR code with the PDF URL
      const qrCodeData = await QRCode.toDataURL(pdfUrl);
    }
    const element = document.getElementById("print-id");
    if (element) {
      const printWindow = window.open("", "", "height=800,width=600");
      if (printWindow) {
        printWindow.document.write(
          `<html><head><title>${rowData.code}</title>`
        );
        printWindow.document.write(`
            <style>
                @page {
                    size: A4;
                    margin: 10mm;
                }

                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    height: 100vh; /* Full height of the page */
                }

                #print-id {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between; /* Ensures footer stays at bottom */
                    height: 100%;
                }

                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }

                .header img {
                    width: 100%;
                    height: auto;
                }

                .content {
                    flex-grow: 1; /* Takes up the remaining space */
                    margin-bottom: 20px;
                    text-align: center;
                    font-size: 12px;
                }

                .footer {
                    text-align: center;
                    margin-top: 20px;
                    width: 100%;
                    position: relative;
                    bottom: 0; /* Stays at the bottom of the page */
                }

                .footer img {
                    width: 100%;
                    height: auto;
                }

                .qrcode {
                    display: inline-block;
                    width: 150px;
                    height: 150px;
                }

                .generated-code {
                    display: inline-block;
                    vertical-align: top;
                    margin-left: 20px;
                    font-size: 17px;
                    font-weight: bold;
                    margin-top:60px;
                }

                .signatory-section {
                    font-size: 14px;
                    display: flex;
                    justify-content: space-between;
                    padding: 0 20px;
                }
                td{
                font-size: 14px;
                border: 1px solid black; 
                padding: 8px;
                }

                /* Scale down content if it overflows */
                @media print {
                    body {
                        zoom: 90%; /* Adjust zoom to fit content on the page */
                    }
                }
            </style>
        `);
        printWindow.document.write("</head><body>");
        printWindow.document.write(`
            <div id="print-id">
                <!-- Header with image -->
                <div class="header">
                    <img src="/images/header.png" alt="Header Image" />
                    <h1>Subproject ID Number</h1>
                </div>

                <div class="content">
<div style="text-align: center; margin-bottom: 20px;">
    <img class="qrcode" src=${qrCode} alt="QR Code" />
    <div class="generated-code"><b>${rowData.code}</b></div>
</div>

<hr />
<h1>Subproject Information:</h1>

<!-- Subproject Information as a Table -->
<table style="width: 100%; border-collapse: collapse; text-align: left;">
    <tr>
        <th style="border: 1px solid black; padding: 8px;">Field</th>
        <th style="border: 1px solid black; padding: 8px;">Details</th>
    </tr>
       <tr>
        <td><b>Subproject Title</b></td>
        <td>${rowData.subprojectTitle}</td>
    </tr>
    ${
      rowData.briefDescription
        ? `
        <tr>
            <td><b>Coordinate</b></td>
            <td>${rowData.briefDescription}</td>
        </tr>
    `
        : ""
    }

    <tr>
        <td><b>Component</b></td>
        <td>${rowData.component}</td>
    </tr>
    ${
      rowData.optionalEntrepSharedInfra
        ? `
    <tr>
        <td><b>Optional Enterprise Shared Infrastructure</b></td>
        <td>${rowData.optionalEntrepSharedInfra}</td>
    </tr>
    `
        : ""
    }
    <tr>
        <td><b>Region</b></td>
        <td>${rowData.region}</td>
    </tr>
    <tr>
        <td><b>Province</b></td>
        <td>${rowData.province}</td>
    </tr>
    <tr>
        <td><b>Type</b></td>
        <td>${rowData.type}</td>
    </tr>
    <tr>
        <td><b>Ancestral Domain Location</b></td>
        <td>${rowData.ancestralDomainLoc}</td>
    </tr>
       <tr>
        <td><b>Municipality</b></td>
        <td>${rowData.municipality}</td>
    </tr>
               <!-- Only show Coordinate row if there is data -->
    ${
      rowData.coordinate
        ? `
        <tr>
            <td><b>Coordinate</b></td>
            <td>${rowData.coordinate}</td>
        </tr>
    `
        : ""
    }
    
    <!-- Only show Physical Indicator row if there is data -->
    ${
      rowData.physicalIndicator
        ? `
        <tr>
            <td><b>Physical Indicator</b></td>
            <td>${rowData.physicalIndicator}</td>
        </tr>
    `
        : ""
    }
    
    <!-- Only show Total Estimate Project Cost row if there is data -->
    ${
      rowData.tepc
        ? `
        <tr>
            <td><b>Total Estimate Project Cost</b></td>
            <td>${rowData.tepc}</td>
        </tr>
    `
        : ""
    }
</table>

</div>
                <div class="signatory-section">
                    <div class="signatory">
                        <b>Generated By:</b><br /><br />
                            ${data?.user.name}<br />
                            ${data?.user.position}<br />
                    </div>
 <span style="block "><i>See attachment Notice to Commence</i></span>
                    <div class="signatory">
                        <b>Noted By:</b><br /><br />
                        Nelson C. Faustino<br />
                        M&E Head<br />
                         <span id="currentDate" style="display: block; margin-top: 30px;"></span>
                    </div>
                </div>

                <!-- Footer with image -->
                <div class="footer">
                    <img src="/images/footer.png" alt="Footer Image" />
                </div>
            </div>
            <script>
                // Ensure createdAt is a string
                const createdAt = "${rowData.createdAt}";

                // Function to format a date string as "Month Day, Year"
                function formatDate(dateString) {
                    const date = new Date(dateString);
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    return date.toLocaleDateString('en-US', options);
                }

                // Set the formatted date in the element with id "currentDate"
                document.getElementById('currentDate').textContent = formatDate(createdAt);
            </script>
        `);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.print();
      }
    } else {
      console.error("Element with id 'print-id' not found.");
    }
  };

  return (
    <div className="flex flex-row gap-2" id="print-id">
      <FaPrint
        className="w-5 h-5 text-green-800 cursor-pointer"
        onClick={() => handlePrint()}
      />
      {/* <FaEye className="w-5 h-5 text-blue-800 cursor-pointer"/> */}
    </div>
  );
}
