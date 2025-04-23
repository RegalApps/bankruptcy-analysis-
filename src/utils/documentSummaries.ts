/**
 * Document Summaries
 * 
 * This file contains comprehensive assessment text for different document types.
 * These are separate from the JSON mapping and used by the document summary component.
 */

export const documentSummaries = {
  "form47": `⚠️ Comprehensive Risk Assessment & BIA Violations
🔴 1. Missing Proposal Terms
Fields Empty:

Secured Creditors Payment Terms
Risk Description:
 These are core components of the proposal. Failure to complete them renders the form non-compliant and invalid for submission.
BIA s. 66.13(2)(c) – Requires a full proposal outlining all payment schedules and conditions.
Solution: Add secured creditor terms

Preferred Claims Payment Terms
Risk Description: These are core components of the proposal. Failure to complete them renders the form non-compliant and invalid for submission.
BIA s. 66.13(2)(c) – Requires a full proposal outlining all payment schedules and conditions.
Solution: Detail preferred claims and their priority

Administrator & Counselling Fees
-Risk Description: These are core components of the proposal. Failure to complete them renders the form non-compliant and invalid for submission.
- BIA s. 66.13(2)(c) – Requires a full proposal outlining all payment schedules and conditions.
- Include a breakdown of administrator and counselling fees
Payment Schedule for Unsecured Creditors
Risk Description:
 These are core components of the proposal. Failure to complete them renders the form non-compliant and invalid for submission.
BIA s. 66.13(2)(c) – Requires a full proposal outlining all payment schedules and conditions.
Solution: Include a breakdown of administrator and counselling fees
Dividend Distribution Plan
Risk Description:
 These are core components of the proposal. Failure to complete them renders the form non-compliant and invalid for submission.
BIA s. 66.13(2)(c) – Requires a full proposal outlining all payment schedules and conditions.
Solution: Manner of dividend distribution
Additional Terms
Risk Description:
 These are core components of the proposal. Failure to complete them renders the form non-compliant and invalid for submission.
BIA s. 66.13(2)(c) – Requires a full proposal outlining all payment schedules and conditions.
Solution: Any additional clauses like early repayment, interest waivers, etc.

BIA Violation:

BIA s. 66.13(2)(c) – Requires a full proposal outlining all payment schedules and conditions.

BIA General Rules – Must include a detailed distribution scheme and fee structure.

Risk Description:
 These are core components of the proposal. Failure to complete them renders the form non-compliant and invalid for submission.

Color Code: 🔴 Critical

Solution:

Prompt trustee to complete each section:

Add secured creditor terms

Detail preferred claims and their priority

Include a breakdown of administrator and counselling fees

Schedule for unsecured payments

Manner of dividend distribution

Any additional clauses like early repayment, interest waivers, etc.

🟠 2. No Debtor Address or Contact Info
Fields Missing: Debtor's full address and contact details.

BIA Violation:

BIA Form 1.1 cross-reference – Requires debtor identification information for tracking and validation.

Risk Description:
 Cannot authenticate identity or send statutory notices without contact info.

Color Code: 🟠 High

Solution:

Attach Form 1.1 with complete personal information of Josh Hart.

Validate against ID to confirm name/address match.

🟠 3. Missing Witness Contact Info
Issue: Witness name (Tom Francis) is present, but no contact or credential information provided.

Risk Description:
 May not hold legal weight if authenticity is challenged.

Color Code: 🟠 High

Solution:

Include full witness contact info as per Form 1.1

Ensure witness is not the administrator (conflict of interest potential).

✅ Summary of Compliance Issues
Issue\tBIA Violation\tSeverity\tSolution
Empty payment proposal sections\ts. 66.13(2)(c)\t🔴 Critical\tFill in secured, preferred, unsecured, fee, and dividend terms
Missing debtor details\tForm 1.1 required info\t🟠 High\tAttach Form 1.1 or input address/contact
Missing witness details\tAuthentication issue\t🟠 High\tProvide full name, address, and independence confirmation

✅ Recommended Next Steps for SecureFiles AI
🔧 Trigger Auto-Validation for Section 1–6 completion on Form 47.

📎 Cross-check Form 1.1 presence and extract full identity data.

🛡️ Flag administrator-witness overlap for manual review.

📝 Generate system message prompting trustee to enter missing sections with examples.

📅 Set deadline (e.g., 5 days before creditor vote) to auto-remind incomplete forms.`,

  "form31": `⚠️ Risk Assessment with BIA Violations and Solutions
🔴 1. Missing Claim Evidence (Schedule A Not Attached)
Issue: Statement of account or affidavit marked "Schedule A" is referenced but not included.


BIA Violation:


BIA s. 124(2) – A proof of claim must be supported by a statement of account, affidavit, or vouchers.


Risk: Claim is invalid until proof is attached.


Color Code: 🔴 Critical


Solution:


Upload "Schedule A" immediately showing a breakdown of the $89,355.


Include invoices, contract evidence, or sworn affidavit.



🟠 2. Incomplete Section 4 – Priority Option Box
Issue: No amount entered for either priority or non-priority designation.


BIA Violation:


BIA Form 31 Design – Requires clear declaration under s.136 whether a portion of the claim is priority (e.g., unpaid wages).


Risk: Trustee may not know how to rank this claim.


Color Code: 🟠 High


Solution:


Enter either:


"Amount of $0 is claimed as priority", or


Amount that qualifies (e.g., under s.136 for wages, etc.)



🔴 3. Date Format Error & Possibly Invalid Filing
Issue: "Dated at 2025, this 8 day of 0" — month not written.


BIA Violation:


BIA s.102(2) – Filing deadline for claim is 30 days after the first meeting.


Risk: Could be rejected if submission timing is questioned.


Color Code: 🔴 Critical


Solution:


Update date to: "Dated at [City], this 8th day of April, 2025"


Ensure trustee records a proper filing timestamp.



🟠 4. Omitted Arm's-Length Disclosure Details
Issue: Item 5 only checks the box, no details on relatedness or arm's-length dealings.


BIA Violation:


BIA s.4 and s.2(1) – Relationship and dealings must be disclosed fully.


Risk: May obscure conflicts of interest or insider deals.


Color Code: 🟠 High


Solution:


Include a statement such as:


"Creditor is not related and has dealt at arm's length"


Or, if related, detail business/personal ties.



🟡 5. Missing Transfer at Undervalue Statement
Issue: Section 6 is left blank. If no transfers, a "None" should still be stated.


BIA Violation:


BIA s.2(1) – Trustee needs this to detect fraudulent preference.


Risk: If any transfers occurred and aren't disclosed, it's a violation.


Color Code: 🟡 Medium


Solution:


Add: "No payments, credits, or undervalue transfers occurred within the specified timeframe."



✅ Compliance Summary Table
Issue
BIA Reference
Severity
Solution
Missing Schedule A
s.124(2)
🔴 Critical
Upload full breakdown/affidavit
Incomplete Claim Priority Section
s.136
🟠 High
Clarify priority status
Invalid Date Format
s.102(2)
🔴 Critical
Correct and timestamp properly
Incomplete Related Party Declaration
s.4
🟠 High
Declare arm's-length status
No Undervalue Transfer Statement
s.2(1)
🟡 Medium
State "None" if none occurred`
};

/**
 * Get a document summary by form type
 * @param formType The form type (e.g., "form47")
 * @returns The comprehensive assessment text for the form type, or undefined if not found
 */
export const getDocumentSummary = (formType: string): string | undefined => {
  // Normalize form type by removing spaces and converting to lowercase
  const normalizedFormType = formType.toLowerCase().replace(/\s+/g, '');
  return documentSummaries[normalizedFormType];
};
