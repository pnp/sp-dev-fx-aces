---
name: file-classifier
description: Classifies files in a SharePoint document library by reading their content and matching them to known content types (Contracts, Invoices, Purchase Orders). Creates a File classification Choice column plus 5 metadata columns per content type, extracts values from each file, and writes them back automatically. Use when the user asks to classify, categorize, tag, or auto-label files in a library, or to set up content types with metadata extraction. Trigger phrases: classify files, classify documents, classify library, categorize files, tag files, auto-classify, set up content types, extract metadata, identify contracts invoices purchase orders.
---
# File Classifier

## Purpose

Classify one or more files in a SharePoint document library by reading their content and matching them to a known set of content types. Then:
- Save the classification to a **"File classification"** column.
- Create the metadata columns defined for that content type (if they don't already exist).
- Extract metadata values from the file content and populate those columns.

If the "File classification" column or any metadata columns do not exist, create them as autofill columns with metadata extraction prompts so future uploads are handled automatically.

---

## Classification Decision Guide

**Classify by document PURPOSE and STRUCTURE — not by keywords alone.**

Many contracts include payment terms that reference invoices (e.g., "payment due within 30 days of invoice date"). The word "invoice" appearing in a document does NOT make it an Invoice. Use the structural signals below to determine the correct type.

### Contracts
A Contracts document is a **bilateral or multilateral agreement** where two or more named parties accept mutual obligations.

Structural signals — look for ALL of these:
- A document title containing "Agreement", "Contract", "NDA", "Lease", "License", or similar
- Named parties on both sides (Service Provider + Client, Employer + Employee, Landlord + Tenant, etc.)
- Signature blocks for **both parties**
- Clauses governing Term, Termination, Liability, Confidentiality, or Indemnification

A Contract **may contain** payment terms, fee schedules, or the word "invoice" — this is normal and does NOT change the classification. If the primary purpose of the document is to establish a legal relationship between parties, it is Contracts.

### Invoices
An Invoice is a **standalone billing document** from a single vendor requesting payment for goods or services already delivered or rendered.

Structural signals — look for ALL of these:
- A document title or header containing "Invoice", "Credit Memo", or "Remittance"
- A unique Invoice Number (e.g., "INV-2026-0042", "CM-2024-0048")
- Itemized line items with quantities, unit prices, and subtotals
- A "Bill To" or "Remit Payment To" section identifying the paying party
- A single total amount due

An Invoice is issued **by one party to another** to trigger a payment. It does not contain signature blocks for two parties, termination clauses, or liability caps.

### Purchase Orders
A Purchase Order is a **buyer-issued authorization** directing a vendor to supply specific goods or services at agreed terms.

Structural signals — look for ALL of these:
- A document title or header containing "Purchase Order" or "PO"
- A unique PO Number (e.g., "PO-2024-0614-001")
- Line items specifying goods or services, quantities, and unit costs
- A "Ship To" or "Deliver To" address identifying the receiving location
- Issued by the buyer (not the vendor)

---

## Valid Classification Values

Assign exactly one of:
- **Contracts**
- **Invoices**
- **Purchase Orders**
- **Unclassified** — when no type clearly matches. Do not create metadata columns for unclassified files.

### Subtype Mapping

Map recognized subtypes to their parent type. Never create separate classification values for subtypes.

**→ Contracts:**
- Master Service Agreement (MSA)
- Service Level Agreement (SLA)
- Non-Disclosure Agreement (NDA)
- Statement of Work (SOW)
- Partnership Agreement
- Employment Agreement
- Change Order
- Supply Agreement
- Lease Agreement
- Software License Agreement

**→ Purchase Orders:**
- Blanket Purchase Order (BPO)
- Asset / IT Requisition

**→ Invoices:**
- Credit Memo
- Remittance Advice

When uncertain between Contracts and Invoices: if the document has signature blocks for two or more parties and governs ongoing obligations, it is Contracts. If it has a single invoice number and exists solely to request payment, it is Invoices.

---

## Content Type Reference

Each content type has exactly **5 metadata columns** following the pattern: Identifier, Key Party, Critical Date, Financial Amount, Status.

### Contracts

1. **Contract ID/Number** (Text, InternalName: ContractID) — "Extract the contract ID or reference number from this document."
2. **Parties Involved** (Text, InternalName: PartiesInvolved) — "Extract the names of all parties involved in this contract (e.g., 'Solara Energy Group, Inc.; Horizon Growth Partners, LLC')."
3. **Expiration/End Date** (DateTime DateOnly, InternalName: ExpirationEndDate) — "Extract the expiration, end, or termination date of this contract. For leases, use the lease end date. For employment agreements, use the end date if fixed-term."
4. **Contract Value** (Number, InternalName: ContractValue) — "Extract the total contract value or committed spend as a number (no currency symbols). For monthly-fee agreements, multiply the monthly rate by the contract term in months. For NDAs or agreements with no financial value, return 0."
5. **Contract Status** (Text, InternalName: ContractStatus) — "Extract the contract status from the Payment Status field or document body (Paid, Active, Overdue, Void, Expired, or Terminated). If not stated, return 'Active'."

### Invoices

1. **Invoice Number** (Text, InternalName: InvoiceNumber) — "Extract the invoice number or reference number from this document (e.g., 'INV-2026-0042', 'CM-2024-0048')."
2. **Vendor/Supplier Name** (Text, InternalName: VendorSupplierName) — "Extract the vendor or supplier name — the party issuing this invoice."
3. **Payment Due Date** (DateTime DateOnly, InternalName: PaymentDueDate) — "Extract the payment due date from this invoice."
4. **Total Amount Due** (Number, InternalName: TotalAmountDue) — "Extract the total amount due as a number (no currency symbols). For credit memos, return the amount as a negative number."
5. **Payment Status** (Text, InternalName: PaymentStatus) — "Extract the payment status from the Payment Status field (Paid, Overdue, or Void). If not stated, return 'Overdue'."

### Purchase Orders

1. **PO Number** (Text, InternalName: PONumber) — "Extract the purchase order number from this document (e.g., 'PO-2024-0614-001')."
2. **Vendor/Supplier Name** (Text, InternalName: VendorSupplierName) — "Extract the vendor or supplier name — the party fulfilling this order." *(Shared with Invoices — reuse if already created.)*
3. **Required Delivery Date** (DateTime DateOnly, InternalName: RequiredDeliveryDate) — "Extract the required or expected delivery date from this document."
4. **Total Order Value** (Number, InternalName: TotalOrderValue) — "Extract the total order value as a number (no currency symbols or commas)."
5. **PO Status** (Text, InternalName: POStatus) — "Extract the PO status from the Payment Status field (Paid, Open, Overdue, Void, or Cancelled). If not stated, return 'Open'."

---

## Duplicate Column Prevention

VendorSupplierName (InternalName: VendorSupplierName) is shared across Invoices and Purchase Orders. Before creating any column, check the library schema by internal name. If a column with the same internal name already exists, skip creation and reuse it. Never create a duplicate column.

---

## Default Values

Apply these when a value cannot be found in the document:
- **ContractStatus** → "Active" (Contracts)
- **PaymentStatus** → "Overdue" (Invoices)
- **POStatus** → "Open" (Purchase Orders)

---

## Workflow

### Step 1 — Ensure "File classification" column exists
- Call `get_list_schema` on the target library.
- If **FileClassification** is missing, create it with `create_or_update_list`:
  - displayName: "File classification", internalName: "FileClassification", type: "Choice"
  - choices: ["Contracts", "Invoices", "Purchase Orders", "Unclassified"]
  - metadataExtractionPrompt: "Classify this document by its PURPOSE and STRUCTURE — not by keywords alone. Use these rules: (1) CONTRACTS — A bilateral agreement where two or more named parties accept mutual obligations. Both parties have signature blocks. Governs term, termination, liability, and confidentiality. A contract may contain payment terms or reference invoices — this does NOT make it an Invoice. Subtypes that classify as Contracts: MSA, SLA, NDA, SOW, Partnership Agreement, Employment Agreement, Change Order, Supply Agreement, Lease Agreement, Software License Agreement. (2) INVOICES — A billing document from a single vendor requesting payment for goods or services delivered. Has a unique Invoice Number, itemized line items with prices, a Bill To section, and a total amount due. Subtypes: Credit Memo, Remittance Advice. (3) PURCHASE ORDERS — A buyer-issued document authorizing a vendor to supply specific goods or services. Has a PO Number, itemized line items with quantities, and a Ship To address. Subtypes: Blanket Purchase Order, Asset/IT Requisition. Return ONLY one of: Contracts, Invoices, Purchase Orders, or Unclassified."
  - Add to default view.

### Step 2 — Read files
- Identify files to classify (from selectedItems, by name, or all files in the library).
- Read content with `cat_file`. Batch multiple files in a single call.

### Step 3 — Classify each file
- Apply the Classification Decision Guide above — classify by document purpose and structure.
- Map recognized subtypes to their parent type per the Subtype Mapping.
- Assign "Unclassified" if no clear match.
- **Tiebreaker — Contracts vs. Invoices**: If the document has signature blocks for two or more parties, classify as Contracts regardless of financial language present.

### Step 4 — Create metadata columns
- Collect unique content types found (excluding "Unclassified").
- Check schema for existing columns by internal name before creating.
- Create only missing columns with `create_or_update_list`:
  - Use internal names, display names, and types from the Content Type Reference.
  - DateTime columns: format "DateOnly".
  - Include metadataExtractionPrompt with default fallback instructions.
  - Add new columns to default view. Set isManualColumnCreation: true.

### Step 5 — Extract metadata values
- For each classified file, extract values for its 5 columns using the extraction prompts as guidance.
- Apply defaults from the Default Values section when a value is not found in the document.
- Number fields: numeric value only — no currency symbols or commas.
- DateTime fields: ISO 8601 format — use `get_datetime_info` to format before updating.

### Step 6 — Save and report
- Write FileClassification and all metadata values with `update_list_items_v2`.
- Report results as a list: File Name → Classification (subtype note if applicable) | Fields Populated / Total.

---

## Example

**User:** "Classify the files in this library"

**Agent actions:**
- Check schema — FileClassification missing, create it.
- Read all 12 files in one batch.
- Classify (applying structure-first decision guide):
  - velocity-motors-legal-services-invoice.docx → **Invoices** (invoice number, itemized lines, Bill To, single vendor)
  - medinnovate-systems-product-invoice.docx → **Invoices** (invoice number, itemized lines, Bill To)
  - precision-dynamics-event-services-invoice.docx → **Invoices** (invoice number, itemized lines, Bill To)
  - medinnovate-systems-credit-memo.docx → **Invoices** — Credit Memo subtype (negative amount billing doc)
  - acme-manufacturing-global-raw-materials-po.docx → **Purchase Orders** (PO number, line items, Ship To)
  - quantum-cloud-services-po-2024-1178.docx → **Purchase Orders** (PO number, line items, Ship To)
  - velocity-motors-fleet-vehicles-po.docx → **Purchase Orders** (PO number, line items, Ship To)
  - globaltech-solutions-supply-agreement.docx → **Contracts** — Supply Agreement subtype (two parties, bilateral signatures, NOT an invoice despite payment terms)
  - capitalforge-nexus-enterprises-service-level-agreement.docx → **Contracts** — SLA subtype (two parties, bilateral signatures)
  - consulting-services-agreement-project-52577.docx → **Contracts** (two parties, bilateral signatures, term and termination clauses)
  - nexgen-solutions-greenstream-nda.docx → **Contracts** — NDA subtype (two parties, bilateral signatures, confidentiality clauses)
  - omnicorp-commercial-office-lease.docx → **Contracts** — Lease subtype (landlord + tenant, bilateral signatures, term dates)
- Create columns: 5 for Contracts + 5 for Invoices + 5 for Purchase Orders = 15, minus VendorSupplierName created once and reused = **14 new columns**.
- Extract and write metadata. ContractValue for nexgen NDA = 0 (no financial obligation). TotalAmountDue for credit memo = negative value.
- Report:
  - velocity-motors-legal-services-invoice.docx → Invoices | 5 of 5
  - medinnovate-systems-product-invoice.docx → Invoices | 5 of 5
  - precision-dynamics-event-services-invoice.docx → Invoices | 5 of 5
  - medinnovate-systems-credit-memo.docx → Invoices (Credit Memo) | 5 of 5
  - acme-manufacturing-global-raw-materials-po.docx → Purchase Orders | 5 of 5
  - quantum-cloud-services-po-2024-1178.docx → Purchase Orders | 5 of 5
  - velocity-motors-fleet-vehicles-po.docx → Purchase Orders | 5 of 5
  - globaltech-solutions-supply-agreement.docx → Contracts (Supply Agreement) | 5 of 5
  - capitalforge-nexus-enterprises-service-level-agreement.docx → Contracts (SLA) | 5 of 5
  - consulting-services-agreement-project-52577.docx → Contracts | 5 of 5
  - nexgen-solutions-greenstream-nda.docx → Contracts (NDA) | 5 of 5
  - omnicorp-commercial-office-lease.docx → Contracts (Lease) | 5 of 5

---

## Partial-batch failure handling

File content extraction can fail for individual files — corrupt documents, password protection, unsupported formats, transient `cat_file` errors, or content too large for a single read. The run **must not abort** on a single-file failure.

Rules:

- **Continue the batch.** If `cat_file` fails for a file, capture the error, mark that file's classification as `Unclassified`, and move on to the next file. Do not roll back classifications already written.
- **Do not fabricate metadata.** A file that could not be read gets `Unclassified` and no metadata columns are populated for it. Never guess values to keep the row "complete".
- **One retry, then skip.** For transient errors (network/timeout), retry the single file once. If the retry also fails, classify it `Unclassified` with the failure reason recorded in the final report.
- **Report every failure explicitly.** The Step 6 results list must call out failed files on their own line, with the reason. Example: `velocity-motors-legal-services-invoice.docx → Unclassified | read failed: password protected`.
- **End-of-run summary.** After processing all files, add a one-line tally: `Classified X of Y files. Z failures (see above).` so the user can see at a glance whether the run needs follow-up.
- **Never silently drop a file.** Every file in the input set must appear in the final report, either with its classification or with a failure reason.

---

## Constraints
- Never invent a content type outside the valid list.
- Never fabricate metadata — extract only what is present, or apply a designated default.
- Default to "Unclassified" when uncertain or when content extraction fails.
- Do not create metadata columns for "Unclassified" files.
- "File classification" must be a Choice field with a metadataExtractionPrompt.
- All metadata columns must include metadataExtractionPrompt values for future autofill.
- Never create a column if one with the same internal name already exists.
- Subtypes always map to their parent — never create classification values for subtypes.
- Confirm with the user before bulk updates.
- Process files in batches for large libraries. A single-file failure must not abort the batch — see **Partial-batch failure handling** above.
