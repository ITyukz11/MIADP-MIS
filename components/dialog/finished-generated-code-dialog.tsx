import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import { Label } from '@/components/ui/label';
import html2canvas from 'html2canvas'; // Import html2canvas
import { FaDownload, FaPrint } from 'react-icons/fa';
import { codeComponent, codeProvince, codeRegion, codeType } from '@/app/(app)/admin/generate-code/(datas)/data';
import { GenerateQRCodeWithLogo } from '../GenerateQrCodeWithLogo';


interface FinishedGeneratedCodeDialogProps {
    open: boolean;
    close: () => void;
    GeneratedCode: string;
    SubprojectTitle: string;
    SubprojectInformations: any
}

function FinishedGeneratedCode({ open, close, GeneratedCode, SubprojectTitle, SubprojectInformations }: FinishedGeneratedCodeDialogProps) {
    const [labelSubProjectInformations, setLabelSubProjectInformations] = useState<any>({})
    const [qrCode, setQrCode] = useState<string | null>(null);
    useEffect(() => {
        if (open) {
            // Create a copy of the SubprojectInformations object to store the label mappings
            let labelMapping: any = {};

            // Loop through each property of SubprojectInformations
            Object.entries(SubprojectInformations).forEach(([key, value]: [string, any]) => {
                // Find the corresponding label in codeProvince
                let component = codeComponent.find((item) => item.value === value);
                if (component) {
                    labelMapping[key] = component.label;
                }

                // Find the corresponding label in codeProvince
                let province = codeProvince.find((item) => item.value === value);
                if (province) {
                    labelMapping[key] = province.label;
                }

                // Find the corresponding label in codeRegion
                let region = codeRegion.find((item) => item.value === value);
                if (region) {
                    labelMapping[key] = region.label;
                }

                // Find the corresponding label in codeType
                let type = codeType.find((item) => item.value === value);
                if (type) {
                    labelMapping[key] = type.label;
                }
            });

            // Update the state with the mapped labels
            setLabelSubProjectInformations(labelMapping);
        }
    }, [open, SubprojectInformations]);


    useEffect(() => {
        if (open) {
            const duration = 15 * 1000; // 15 seconds
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

            const interval = setInterval(() => {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) {
                    clearInterval(interval);
                    return;
                }
                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
            }, 250);
            return () => clearInterval(interval);
        }
    }, [open]);

    // Function to download the div as an image
    const handleDownload = async () => {
        const element = document.getElementById('print-id');
        if (element) {
            const canvas = await html2canvas(element);
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = 'generated-code.png'; // Set the download file name
            link.click();
        }
    };
    const handlePrint = () => {
        const element = document.getElementById('print-id');
        if (element) {
            const printWindow = window.open('', '', 'height=800,width=600');
            if (printWindow) {
                printWindow.document.write('<html><head><title>Generate Code Subproject</title>');
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
                    }
    
                    .signatory-section {
                        font-size: 18px;
                        display: flex;
                        justify-content: space-between;
                        padding: 0 20px;
                    }
                   
    
                    /* Scale down content if it overflows */
                    @media print {
                        body {
                            zoom: 90%; /* Adjust zoom to fit content on the page */
                        }
                    }
                </style>
            `);
                printWindow.document.write('</head><body>');
                printWindow.document.write(`
                <div id="print-id">
                    <!-- Header with image -->
                    <div class="header">
                        <img src="/images/header.png" alt="Header Image" />
                        <h1>${SubprojectTitle}</h1>
                        <h2>Subproject ID Number</h2>
                    </div>
    
                    <div class="content">
    <div style="text-align: center; margin-bottom: 20px;">
        <img class="qrcode" src=${qrCode} alt="QR Code" />
        <div class="generated-code"><b>${GeneratedCode}</b></div>
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
            <td style="border: 1px solid black; padding: 8px;"><b>Component</b></td>
            <td style="border: 1px solid black; padding: 8px;">${labelSubProjectInformations.component}</td>
        </tr>
        ${SubprojectInformations.optionalEntrepSharedInfra ? `
        <tr>
            <td style="border: 1px solid black; padding: 8px;"><b>Optional Enterprise Shared Infrastructure</b></td>
            <td style="border: 1px solid black; padding: 8px;">${SubprojectInformations.optionalEntrepSharedInfra}</td>
        </tr>
        ` : ''}
        <tr>
            <td style="border: 1px solid black; padding: 8px;"><b>Region</b></td>
            <td style="border: 1px solid black; padding: 8px;">${labelSubProjectInformations.region}</td>
        </tr>
        <tr>
            <td style="border: 1px solid black; padding: 8px;"><b>Province</b></td>
            <td style="border: 1px solid black; padding: 8px;">${labelSubProjectInformations.province}</td>
        </tr>
        <tr>
            <td style="border: 1px solid black; padding: 8px;"><b>Type</b></td>
            <td style="border: 1px solid black; padding: 8px;">${labelSubProjectInformations.type}</td>
        </tr>
        <tr>
            <td style="border: 1px solid black; padding: 8px;"><b>Ancestral Domain Location</b></td>
            <td style="border: 1px solid black; padding: 8px;">${SubprojectInformations.adLocation}</td>
        </tr>
    </table>
</div>

    
                    <div class="signatory-section">
                        <div class="signatory">
                            <b>Generated By:</b><br /><br />
                            Errol Robyn M. Abella<br />
                            Programmer<br />
                        </div>
    
                        <div class="signatory">
                            <b>Noted By:</b><br /><br />
                            Nelson C. Faustino<br />
                            M&E Head<br />
                        </div>
                    </div>
    
                    <!-- Footer with image -->
                    <div class="footer">
                        <img src="/images/footer.png" alt="Footer Image" />
                    </div>
                </div>
            `);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.print();
            }
        } else {
            console.error("Element with id 'print-id' not found.");
        }
    };





    useEffect(() => {
        const {
            component,
            province,
            region,
            type
        } = labelSubProjectInformations;


        // Generate formatted QR code data
        const qrData =
            `
        Subproject title ${SubprojectTitle}\n
        Component: ${component}\n
         Province: ${province}\n
        Region: ${region}\n
        Type: ${type}
  `;

        // Generate the QR code
        GenerateQRCodeWithLogo(qrData).then(setQrCode).catch(console.error);
    }, [labelSubProjectInformations, SubprojectTitle]);

    return (
        <Dialog open={open} onOpenChange={close}>
            <DialogContent className="w-full flex items-center flex-col">
                <DialogHeader>
                    <DialogTitle>🎉🎉CONGRATULATIONS!🎉🎉</DialogTitle>
                    <DialogDescription>
                        You have now generated a new code!
                    </DialogDescription>
                </DialogHeader>
                <div
                    id='print-id'
                    style={{
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '100%',
                        width: '100%',
                        padding: '20px', // Add padding for better presentation
                    }}
                >
                    <div className='flex flex-col'>
                        <Label className='w-full font-semibold text-xl'>{GeneratedCode}</Label>
                        <Label className='w-full italic text-center'>{SubprojectTitle}</Label>
                    </div>
                </div>
                <DialogFooter className='flex justify-between w-full'>
                    <div className='w-full'>
                        <Button onClick={handlePrint}><FaPrint /></Button>
                    </div>
                    <Button onClick={close}>Continue</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default FinishedGeneratedCode;