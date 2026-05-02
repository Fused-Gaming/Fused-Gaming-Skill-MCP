# 🔒 Security PR Review Checklist

**Use this checklist when reviewing pull requests for security issues**

---

## Quick Start

When reviewing a PR:

1. **Skim for obvious issues** (2 min): Look for red flags below
2. **Deep dive if needed** (5-10 min): Check specific areas based on changes
3. **Run automated checks**: `npm audit`, `eslint`, `snyk`
4. **Document findings**: Comment on specific lines with concerns

---

## ✅ Input Validation

- [ ] All user inputs are validated (query params, body, headers)
- [ ] Validation uses schema validation (Zod, Joi, similar)
- [ ] Validation happens at the boundary (not deep in business logic)
- [ ] Error messages don't reveal system internals
- [ ] No bypasses (e.g., checking `!==` instead of `!==` and checking type)
- [ ] Array/collection size limits enforced
- [ ] String length limits enforced
- [ ] Numeric ranges validated
- [ ] Enum values constrained (not accepting arbitrary strings)

### Questions to Ask
- What happens if I send an empty string?
- What happens if I send a 1MB string?
- What happens if I send `null`, `undefined`, `{}`?
- What happens if I send 1000 items in an array?

---

## 🔐 Authentication & Authorization

- [ ] Protected endpoints require valid authentication
- [ ] Auth tokens/sessions are verified on every request
- [ ] Credentials are handled securely (hashed passwords, encrypted tokens)
- [ ] Session timeouts are implemented
- [ ] Authorization checks are explicit (not implicit)
- [ ] Users cannot modify their own permissions
- [ ] Admin-only endpoints check for admin role
- [ ] Rate limiting on auth endpoints (especially login)
- [ ] No credential leakage in error messages

### Questions to Ask
- Can I access this endpoint without authenticating?
- Can I access another user's data by guessing IDs?
- Can I elevate my own permissions?
- Can I use an old/revoked token?

---

## 🔒 Data Protection

- [ ] Sensitive data (passwords, tokens) are hashed/encrypted
- [ ] Encryption uses industry-standard algorithms (bcrypt, AES-256-GCM)
- [ ] TLS/HTTPS is enforced (check `if (!req.secure)`)
- [ ] Sensitive data not logged
- [ ] Sensitive data not stored in plaintext
- [ ] Secret keys are loaded from environment variables
- [ ] No hardcoded secrets in code

### Questions to Ask
- Is password stored as plaintext? (FAIL)
- Is encryption using a weak algorithm? (e.g., MD5, SHA-1)
- Is the encryption key hardcoded?
- Could this data leak via logs or error messages?

---

## 🚫 Code Injection Prevention

- [ ] No `eval()`, `Function()`, or similar dynamic code execution
- [ ] No shell invocation with user input (no `exec()`, `spawn` with `shell: true`)
- [ ] Command execution uses `execFile` (no shell)
- [ ] Template literals not used for shell commands
- [ ] SQL uses parameterized queries (or ORM with escaping)
- [ ] No string concatenation for queries
- [ ] XSS prevention (if generating HTML)
- [ ] No direct `innerHTML` assignments

### Red Flag Code
```typescript
// ❌ DANGER
eval(userInput);
exec(`npm run ${userInput}`);
spawn('sh', ['-c', userInput]);
query(`SELECT * FROM users WHERE id = ${userId}`);
elem.innerHTML = userInput;
```

---

## 📝 Error Handling

- [ ] Error messages are generic and non-revealing
- [ ] Stack traces not exposed to users
- [ ] Detailed errors logged (but not returned to client)
- [ ] No internal implementation details in error messages
- [ ] Database errors sanitized
- [ ] File path errors don't reveal system structure

### Good vs Bad
```typescript
// ❌ BAD
catch (error) {
  res.json({ error: error.message }); // Stack trace exposed!
}

// ✅ GOOD
catch (error) {
  logger.error('Operation failed', { error: error.message });
  res.status(500).json({ error: 'An error occurred' });
}
```

---

## 📦 Dependencies

- [ ] No new dependencies added without justification
- [ ] Dependency versions are pinned (not using `*`)
- [ ] No vulnerable dependencies (check `npm audit`)
- [ ] Dependency has active maintenance
- [ ] Dependency source code reviewed (if possible)
- [ ] `package-lock.json` is committed and up-to-date

### Questions to Ask
- Why was this dependency added?
- Is there a simpler alternative?
- Is the package actively maintained?
- Does `npm audit` pass?

---

## 🔑 Secrets & Credentials

- [ ] No secrets committed to code
- [ ] No credentials in comments
- [ ] No API keys in test files
- [ ] Environment variables used for secrets
- [ ] `.env` file in `.gitignore`
- [ ] No secrets in error messages or logs

### Red Flags
- Looks like an API key or password
- AWS, GitHub, Stripe, or other credentials
- Private keys (PEM, RSA, etc.)
- Hardcoded tokens or Bearer values

---

## 🔄 Path & File Operations

- [ ] File paths validated (prevent directory traversal)
- [ ] `path.resolve()` used with allowlist prefix
- [ ] No `../` in user-provided paths
- [ ] File operations respect access controls
- [ ] Symbolic links handled safely
- [ ] Temp files cleaned up

### Vulnerable Pattern
```typescript
// ❌ DANGER: Allows ../../etc/passwd
router.get('/file/:name', (req, res) => {
  res.sendFile(path.join('/uploads', req.params.name));
});
```

---

## 🔌 API & External Calls

- [ ] External API calls use TLS/HTTPS
- [ ] API responses validated before use
- [ ] Timeouts set on external requests
- [ ] Rate limiting on outbound calls
- [ ] Error responses from external APIs don't crash app
- [ ] API credentials stored securely

---

## 📊 Logging & Monitoring

- [ ] Security events are logged (auth, authorization, errors)
- [ ] Logs don't contain sensitive data
- [ ] Logs have timestamps
- [ ] Log rotation/retention policies enforced
- [ ] Logs are immutable (append-only)
- [ ] Suspicious activities would be detectable

---

## 🏗️ Architecture

- [ ] Security checks happen at the boundary
- [ ] Defense in depth (multiple validation layers)
- [ ] Principle of least privilege applied
- [ ] No security by obscurity
- [ ] Single responsibility principle (security logic isolated)

---

## 📋 Common OWASP Issues

Check these if the PR touches relevant areas:

### A01: Broken Access Control
- [ ] Authorization is explicit and enforced
- [ ] Users cannot access others' data
- [ ] Permission checks aren't bypassable

### A02: Cryptographic Failures
- [ ] Sensitive data is encrypted
- [ ] Uses strong algorithms
- [ ] Keys are managed securely

### A03: Injection
- [ ] No SQL injection (parameterized queries)
- [ ] No command injection (no shell)
- [ ] No code injection (no eval)
- [ ] No template injection

### A04: Insecure Design
- [ ] No security assumptions
- [ ] Threat model considered
- [ ] Defaults are secure

### A05: Broken Authentication
- [ ] Authentication tokens secure
- [ ] Session management correct
- [ ] Password requirements enforced
- [ ] MFA supported (if applicable)

### A07: Cross-Site Scripting (XSS)
- [ ] User input escaped
- [ ] No `innerHTML` assignments
- [ ] HTML context-aware escaping

### A09: Using Components with Known Vulnerabilities
- [ ] `npm audit` passes
- [ ] Dependencies are current
- [ ] No known CVEs

---

## 🚀 Review Process

### For Small Changes (< 50 lines of security code)
1. Run automated checks
2. Review against checklist
3. Ask 1-2 clarifying questions if needed
4. Approve or request changes

### For Medium Changes (50-500 lines)
1. Run automated checks
2. Deep review against checklist
3. Check threat model implications
4. Request second opinion if unsure
5. Require re-test before approval

### For Large/Complex Changes
1. Schedule call with author
2. Understand design decisions
3. Threat model session
4. Code walkthrough
5. Security testing phase
6. Staged rollout plan

---

## 💬 Comment Template

When you find an issue:

```markdown
**Security Concern**: [Type]

**Issue**: [What's wrong]

**Severity**: [Critical|High|Medium|Low]

**Recommendation**: 
[How to fix it]

**Example**:
\`\`\`typescript
// ❌ Current (unsafe)
[current code]

// ✅ Suggested (safe)
[suggested code]
\`\`\`

**References**: 
- [Link to documentation]
```

---

## ✅ Approval Decision

✅ **Approve if:**
- No critical/high severity issues
- All medium issues have planned fixes
- Author committed to follow-up PRs for lower severity items

❌ **Request changes if:**
- Any critical security issues
- Unresolved design questions
- Missing important validations
- Concerning architectural decisions

🤔 **Escalate if:**
- You're unsure about security implications
- New architectural pattern
- Third-party/external integration
- Unclear threat model

---

## 📚 Resources

- [ETHICAL_SECURITY_FRAMEWORK.md](./ETHICAL_SECURITY_FRAMEWORK.md)
- [SECURE_PATTERNS.md](./SECURE_PATTERNS.md)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [SANS Top 25](https://www.sans.org/top25-software-errors/)

---

**Last Updated**: 2026-05-02  
**Maintained By**: Fused Gaming Security Team  
**Version**: 1.0.0
