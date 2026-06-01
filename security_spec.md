# Security Specification - Zero-Trust Firestore Security Spec

This document records the security design, invariants, and test plans for the Kasis Interior Firestore database.

## 1. Data Invariants

Our zero-trust policy dictates that only identified admins can execute write actions on company settings, portfolio items, client reviews, and blogs. Public users have read-only access to these collections and are limited to adding new Inquiry leads.

*   `config/{configId}`:
    *   Read access: Public (anyone).
    *   Write access: Admin only (`request.auth.token.email == "deephotography0786@gmail.com" && request.auth.token.email_verified == true`).
    *   Validation: Keys must fit `WebConfig` schema structure.
*   `portfolio/{projectId}`:
    *   Read access: Public (anyone).
    *   Write/Delete access: Admin only.
    *   Validation: Title, Category and Image are required.
*   `reviews/{reviewId}`:
    *   Read access: Public (anyone).
    *   Write/Delete access: Admin only. Better control is established to prevent unauthorized user deletion or injected values.
*   `blogs/{blogId}`:
    *   Read access: Public (anyone).
    *   Write/Delete access: Admin only.
*   `inquiries/{inquiryId}`:
    *   Read access: Admin only. (PII protection: contains personal customer emails and phone numbers).
    *   Create access: Public (anyone) to create new enquiries.
    *   Update/Delete access: Admin only.
    *   Validation: Customer Name and Phone are required.

---

## 2. The "Dirty Dozen" Malicious Payloads

The following specific JSON payloads are tested to guarantee rejection by the Firestore security layer:

### Vector 1: Self-Assigned Config Editing
1.  **Payload**: Write to `/config/default` as unauthenticated crawler/attacker.
    *   `email`: "malicious-admin@gmail.com"
    *   `phone`: "+1 555 123 4567"
    *   *Expected Result*: `PERMISSION_DENIED` (anonymous write attempt).
2.  **Payload**: Write to `/config/default` as a signed-in user without verified email of `deephotography0786@gmail.com`.
    *   `auth.uid`: `user123`
    *   `auth.token.email`: `someuser@gmail.com`
    *   *Expected Result*: `PERMISSION_DENIED`.

### Vector 2: Privilege Escalation via User Admin Claim Spoofing
3.  **Payload**: Try to write as admin with counterfeit claims or unverified email.
    *   `auth.uid`: `attacker1`
    *   `auth.token.email`: `deephotography0786@gmail.com`
    *   `auth.token.email_verified`: `false`
    *   *Expected Result*: `PERMISSION_DENIED` (must require verified email).

### Vector 3: Shadow Attributes Injected into Portfolio
4.  **Payload**: Create project containing arbitrary database fields.
    *   `id`: "p_malicious"
    *   `title`: "Evil Living Room"
    *   `category`: "living"
    *   `image`: "http://attacker.com/image.jpg"
    *   `ghost_attribute`: "drop_table_customers"
    *   *Expected Result*: `PERMISSION_DENIED` (violates strictly constrained entity attributes using size/key checks).

### Vector 4: Relational Poisoning and Denial of Wallet
5.  **Payload**: ID poisoning - Inject massive junk ID to exhaust indexing resources and cost.
    *   `id`: "a_very_long_invalid_id_repeated_over_and_over_to_reach_one_kilobyte_of_size"
    *   *Expected Result*: `PERMISSION_DENIED` (violates `isValidId()` restrictions).

### Vector 5: Terminal State Bypassing in Inquiries
6.  **Payload**: Create inquiry direct into a protected or completed status bypassing "new".
    *   `name`: "Lead 3"
    *   `phone`: "123"
    *   `status`: "completed"
    *   *Expected Result*: `PERMISSION_DENIED` (creation status must strictly be matched as "new").

### Vector 6: Invalid Enum Categories
7.  **Payload**: Post project with non-existent category enum value.
    *   `title`: "Gothic Vault Room"
    *   `category`: "spaceship_bedroom"
    *   *Expected Result*: `PERMISSION_DENIED`.

### Vector 7: PII Leakage Attacks
8.  **Payload**: Anonymous/Non-admin request to list or fetch `/inquiries/i1`.
    *   *Expected Result*: `PERMISSION_DENIED` (PII leakage prevented; only admin can read submissions).

### Vector 8: Orphaned References (Temporal/Reference Corruption)
9.  **Payload**: Create inquiry with future timestamp.
    *   `timestamp`: "2030-01-01"
    *   *Expected Result*: `PERMISSION_DENIED` (creation date must strictly be validated against server time `request.time`).

### Vector 9: Negative & Overflow Number Limits
10. **Payload**: Inject malicious ratings on reviews.
    *   `rating`: 9999
    *   *Expected Result*: `PERMISSION_DENIED` (violates constraint `rating >= 1 && rating <= 5`).

### Vector 10: Non-Standard String Sizes (Payload Exhaustion)
11. **Payload**: Add blog post with a 15MB content text block.
    *   `content`: "[A massive string of repeating characters exceeding string size limits]"
    *   *Expected Result*: `PERMISSION_DENIED` (violates character limits).

### Vector 11: Attempting Mutual Array Pollution
12. **Payload**: Update config with arrays containing unsupported object types.
    *   `auth.uid`: `deephotography0786@gmail.com` (Email verified: true)
    *   *Expect Result*: `PERMISSION_DENIED` if attempting type mismatch inputs.

---

## 3. Test Invariants Rule Mapping

We ensure that:
1. All client CRUD paths check for authentication before allowing writes.
2. Only the single verified email `deephotography0786@gmail.com` can make structural mutations.
3. Every write is verified against the logical structural shape helper block.
