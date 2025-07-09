import { azureConfig } from './azure-config';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

// Set up PDF.js worker using local file to avoid CORS issues
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

/**
 * This module provides a simplified interface for Azure OpenAI service
 * interactions with real text extraction capabilities.
 */

// Define the response type for summarization operations
export interface SummaryResponse {
  summary: string;
  confidence: number;
  processingTimeMs: number;
}

/**
 * Extract text from PDF files using PDF.js
 */
async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'PDF processing error'}`);
  }
}

/**
 * Extract text from Word documents using mammoth
 */
async function extractTextFromWord(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting Word document text:', error);
    throw new Error('Failed to extract text from Word document');
  }
}

/**
 * Extract text from Excel/CSV files using xlsx
 */
async function extractTextFromSpreadsheet(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    let fullText = '';
    
    // Process each worksheet
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const csvData = XLSX.utils.sheet_to_csv(worksheet);
      fullText += `Sheet: ${sheetName}\n${csvData}\n\n`;
    });
    
    return fullText.trim();
  } catch (error) {
    console.error('Error extracting spreadsheet text:', error);
    throw new Error('Failed to extract text from spreadsheet');
  }
}

/**
 * Extract text from various file types using OCR for images
 */
async function extractTextFromImage(file: File): Promise<string> {
  // For images, we'll provide a detailed description for now
  // In a production environment, you'd use Azure Computer Vision OCR
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(`Image file: ${file.name}
      
This is an image file that would be processed using Azure Computer Vision's OCR capabilities in a production environment to extract any text content present in the image.

File details:
- Name: ${file.name}
- Type: ${file.type}
- Size: ${(file.size / 1024).toFixed(2)} KB

For actual text extraction from images, you would need to integrate with Azure Computer Vision API's Read API or OCR capabilities.`);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Extracts text from uploaded document files
 * Now with real text extraction capabilities for multiple file types
 */
export async function extractTextFromDocument(file: File): Promise<string> {
  try {
    // Handle text files directly
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            resolve(event.target.result);
          } else {
            reject(new Error('Failed to read text file'));
          }
        };
        reader.onerror = () => reject(new Error('Error reading text file'));
        reader.readAsText(file);
      });
    }
    
    // Handle PDF files
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const extractedText = await extractTextFromPDF(file);
      if (extractedText.trim().length === 0) {
        return `PDF Document: ${file.name}
        
This PDF file appears to be empty or contains only images/scanned content without extractable text. 
In a production environment, you would use Azure Computer Vision's OCR capabilities to extract text from image-based PDFs.

File size: ${(file.size / 1024).toFixed(2)} KB`;
      }
      return `PDF Document: ${file.name}\n\nExtracted Content:\n\n${extractedText}`;
    }
    
    // Handle Word documents
    if (file.type.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      const extractedText = await extractTextFromWord(file);
      if (extractedText.trim().length === 0) {
        return `Word Document: ${file.name}
        
This Word document appears to be empty or contains content that couldn't be extracted.

File size: ${(file.size / 1024).toFixed(2)} KB`;
      }
      return `Word Document: ${file.name}\n\nExtracted Content:\n\n${extractedText}`;
    }
    
    // Handle spreadsheet files
    if (file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
      const extractedText = await extractTextFromSpreadsheet(file);
      if (extractedText.trim().length === 0) {
        return `Spreadsheet: ${file.name}
        
This spreadsheet appears to be empty or contains no readable data.

File size: ${(file.size / 1024).toFixed(2)} KB`;
      }
      return `Spreadsheet: ${file.name}\n\nExtracted Data:\n\n${extractedText}`;
    }
    
    // Handle CSV files specifically
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            resolve(`CSV File: ${file.name}\n\nExtracted Data:\n\n${event.target.result}`);
          } else {
            reject(new Error('Failed to read CSV file'));
          }
        };
        reader.onerror = () => reject(new Error('Error reading CSV file'));
        reader.readAsText(file);
      });
    }
    
    // For unsupported file types, provide metadata
    return `Document: ${file.name}
    
File Details:
- Type: ${file.type || 'Unknown'}
- Size: ${(file.size / 1024).toFixed(2)} KB

This file type is not currently supported for automatic text extraction. 
Supported formats include: PDF, Word documents (.docx, .doc), Excel files (.xlsx, .xls), CSV files, and plain text files.

Please convert the file to a supported format or provide a summary of its contents.`;
    
  } catch (error) {
    console.error('Error extracting text from document:', error);
    throw new Error(`Failed to extract text from ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Analyzes an image using Azure Computer Vision services
 * For now provides detailed metadata, but could be extended with actual OCR
 */
export async function analyzeImage(file: File): Promise<string> {
  return await extractTextFromImage(file);
}

/**
 * Summarizes text content using Azure OpenAI
 * Makes an actual call to the Azure OpenAI API
 */
export async function summarizeWithAzureOpenAI(content: string): Promise<SummaryResponse> {
  const startTime = Date.now();
  
  // Validate configuration
  if (!azureConfig.apiKey || !azureConfig.endpoint || azureConfig.endpoint.includes("your-endpoint")) {
    throw new Error("Azure OpenAI is not properly configured");
  }

  try {
    // Construct the proper Azure OpenAI endpoint
    let endpoint = azureConfig.endpoint;
    if (!endpoint.startsWith('https://')) {
      endpoint = `https://${endpoint}`;
    }
    if (!endpoint.endsWith('/')) {
      endpoint += '/';
    }
    
    const apiUrl = `${endpoint}openai/deployments/${azureConfig.deploymentName}/chat/completions?api-version=${azureConfig.apiVersion}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': azureConfig.apiKey
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that creates concise, informative summaries. Extract the key points, main ideas, and important details from the provided content. Format your response in clear, readable paragraphs."
          },
          {
            role: "user",
            content: `Please summarize the following content:\n\n${content}`
          }
        ],
        max_tokens: 800,
        temperature: 0.3,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Azure OpenAI API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const processingTime = Date.now() - startTime;
    
    // Extract summary from the response
    const summary = data.choices && data.choices[0] && data.choices[0].message 
      ? data.choices[0].message.content.trim() 
      : "No summary could be generated";
    
    if (!summary || summary === "No summary could be generated") {
      throw new Error("Azure OpenAI returned an empty response");
    }
    
    return {
      summary,
      confidence: 0.95, // This is approximate as Azure OpenAI doesn't provide a direct confidence score
      processingTimeMs: processingTime
    };
  } catch (error) {
    console.error("Error calling Azure OpenAI:", error);
    throw error;
  }
}

/**
 * Main function to process a file and generate a summary
 * This handles the complete workflow from file to summary
 */
export async function generateDocumentSummary(file: File): Promise<SummaryResponse> {
  try {
    // Step 1: Extract text based on file type
    let content = '';
    if (file.type.startsWith('image/')) {
      content = await analyzeImage(file);
    } else {
      content = await extractTextFromDocument(file);
    }
    
    // Step 2: Send content to Azure OpenAI for summarization
    const summary = await summarizeWithAzureOpenAI(content);
    return summary;
    
  } catch (error) {
    console.error('Error generating document summary:', error);
    throw new Error('Failed to generate document summary');
  }
}