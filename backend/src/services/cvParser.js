// services/cvParser.js
const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const textract = require("textract");
const path = require("path");
const fs = require("fs");

class CVParser {
  static async extractTextFromBuffer(buffer, originalname) {
    const extension = path.extname(originalname).toLowerCase();

    try {
      if (extension === ".pdf") {
        return await this.extractFromPDF(buffer);
      } else if (extension === ".docx") {
        return await this.extractFromDOCX(buffer);
      } else if (extension === ".doc") {
        return await this.extractFromDOC(buffer);
      } else if (extension === ".txt") {
        return buffer.toString("utf8");
      } else {
        // Fallback for other file types
        const tempPath = path.join(__dirname, "../temp", originalname);
        fs.writeFileSync(tempPath, buffer);
        const text = await this.extractWithTextract(tempPath);
        fs.unlinkSync(tempPath); // Clean up
        return text;
      }
    } catch (error) {
      console.error("Error extracting text:", error);
      throw new Error("Failed to extract text from CV");
    }
  }

  static async extractFromPDF(buffer) {
    const data = await pdf(buffer);
    return data.text;
  }

  static async extractFromDOCX(buffer) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  static async extractFromDOC(buffer) {
    // textract works better with .doc files
    const tempPath = path.join(__dirname, "../temp", "temp.doc");
    fs.writeFileSync(tempPath, buffer);
    const text = await this.extractWithTextract(tempPath);
    fs.unlinkSync(tempPath); // Clean up
    return text;
  }

  static extractWithTextract(filePath) {
    return new Promise((resolve, reject) => {
      textract.fromFileWithPath(filePath, (error, text) => {
        if (error) return reject(error);
        resolve(text);
      });
    });
  }

  static cleanText(text) {
    // Remove excessive whitespace and special characters
    return text
      .replace(/\s+/g, " ")
      .replace(/[^\w\s.,;:!?\-@#]/g, "")
      .trim();
  }
}

module.exports = CVParser;
