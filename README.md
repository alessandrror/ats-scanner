# ATS Scanner

ATS Scanner is a résumé review tool built to help job seekers understand how their CV aligns with a specific job opening. The intended experience compares a résumé with the role's requirements and turns the results into clear strengths, gaps, and improvement suggestions.

**Current status:** the repository implements an initial résumé-analysis flow. Job-description matching and OCR for scanned/image-only PDFs are planned, not yet implemented.

- [Live application](https://ats-scanner.alessandrror.dev/)
- [Portfolio case study](https://alessandrror.dev/en/projects/ats-scanner)

## Current product flow

1. Upload a PDF résumé (up to 5 MB).
2. The browser extracts selectable text from the PDF with PDF.js.
3. The extracted text and selected language are sent to a server endpoint.
4. Gemini returns structured feedback, including a score and résumé improvement guidance.

The current flow does not send the PDF itself to the analysis endpoint. Image-only/scanned PDFs are not OCR-processed, and the analysis is not yet matched against a specific job description.

## Built with

- Nuxt and Vue
- TypeScript
- Nuxt UI and Tailwind CSS
- Google Gemini
- PDF.js for browser-side PDF text extraction
- Zod for request and response validation
- Nuxt i18n (English and Spanish)
- Bun

## Run locally

```bash
bun install
bun dev
```

The development server is available at `http://localhost:3000`. Configure the Gemini credential in the local environment before using the analysis endpoint; never commit secrets.

To create and preview a production build:

```bash
bun build
bun preview
```

## Roadmap

- [ ] Add multimodal PDF analysis/OCR for scanned or image-based résumés.
- [ ] Let applicants provide a job description and compare their résumé with that vacancy's requirements.
- [ ] Surface evidence-backed matches and gaps so applicants can prioritize edits before applying.

These items capture the intended next product steps; they should only be marked complete once implemented and verified in the application.

## Context

ATS Scanner was developed independently by Alessandro Rivas, who led the product concept, architecture, API/backend, and frontend. The goal came from a practical need: identify a CV's strengths and weaknesses against a role's requirements and improve the chances of progressing in a hiring process.
