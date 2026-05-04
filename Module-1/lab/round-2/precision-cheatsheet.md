# Prompt Precision Cheat Sheet

**Keep this handy** - Use these techniques in Round 2 & 3 of the lab, and in your daily work.

---

## Part A: Industry-Standard Prompt Engineering Techniques

### Core Techniques (From Anthropic, OpenAI, Microsoft)

#### □ **Be Clear and Direct** *(Anthropic's #1 technique)*
```
❌ Bad:  "Make a login system"
✅ Good: "Create an email-based login system with password validation using bcrypt"
```

#### □ **Assign a Role** *(Universal - All providers)*
```
"You are a senior backend engineer experienced with Node.js and PostgreSQL.
Create a production-ready authentication system..."
```

#### □ **Use Examples (Few-Shot)** *(OpenAI/Anthropic standard)*
```
"Format the API response like this:
Success: { success: true, data: { token: "...", expiresIn: 3600 } }
Error: { success: false, error: { code: "AUTH_FAILED", message: "..." } }"
```

#### □ **Step-by-step reasoning** *(implicit CoT)*
```
"Build the authentication flow:
1. First, validate the email format
2. Then, check if user exists in database
3. Next, compare password hash using bcrypt
4. Finally, generate and return JWT token"
```
**Note:** Encourage step-by-step reasoning (implicit chain-of-thought). Do not request full reasoning unless necessary.


#### □ **Break Complex Tasks** *(OpenAI strategy)*
```
Instead of: "Build complete auth system"
Do this: "First, create the user schema. Then, create registration endpoint. Next, create login endpoint..."
```

---

## Part B: Engineering Context (Software-Specific)

These aren't prompt engineering techniques, but they make AI generate production-ready code:

#### □ **Specify Tech Stack**
```
"Tech: React 18, TypeScript 5, Node.js 20, Express 4, PostgreSQL 15"
```
*Prevents AI from using random frameworks*

#### □ **Define Success Criteria**
```
"Success = User can register, login, and reset password within 2 seconds each"
```
*Makes "working" measurable*

#### □ **Include Error Scenarios**
```
"Handle: Invalid email, wrong password, account locked, network timeout, server 500"
```
*Difference between prototype and production*

#### □ **Specify Data Schemas**
```
"User table: id (UUID), email (unique), password_hash (60 char), created_at (timestamp)"
```
*Prevents schema mismatches*

---

## Quick Copy-Paste Templates

### Template 1: API Endpoint
```
Create a [METHOD] /api/[path] endpoint:
- Purpose: [what it does]
- Auth: [required/optional/none]
- Request: [body/params structure]
- Response 200: [success structure]
- Response 4XX: [error cases]
- Stack: [language/framework]
```

### Template 2: UI Component
```
Create a [Component] with:
- Props: [list of props with types]
- States: [loading, error, success]
- Styling: [Tailwind/CSS/styled-components]
- Events: [onClick, onChange, etc.]
- Accessibility: [ARIA labels, keyboard nav]
```

### Template 3: Business Logic
```
Implement [feature]:
Requirements:
- [functional requirement 1]
- [functional requirement 2]
Constraints:
- [performance/security/tech constraint]
Success when:
- [measurable outcome]
```

---

## Before → After Examples

### Example 1: Authentication
```
❌ BEFORE (Vague - AI must guess):
"Create user authentication"

✅ AFTER (Precise - AI knows exactly what to do):
"Create JWT-based authentication:
- Email/password login (not OAuth)
- Bcrypt hashing with cost factor 12
- Token expiry: 24 hours
- Rate limit: 5 attempts per hour
- Stack: Node.js/Express/PostgreSQL
- Return: { token: string, expiresIn: number }
- Error 401: { error: 'Invalid credentials' }"
```

### Example 2: Data Validation
```
❌ BEFORE:
"Add validation"

✅ AFTER:
"Validate registration form:
- Email: RFC 5322 format
- Password: min 8 chars, 1 upper, 1 number, 1 special
- Username: 3-20 chars, alphanumeric + underscore only
- Show errors inline below each field
- Validate on blur, clear on typing"
```

### Example 3: Error Handling
```
❌ BEFORE:
"Handle errors properly"

✅ AFTER:
"Handle these API errors:
- Network timeout (>5s): Retry 3x with exponential backoff
- 400 Bad Request: Show field-specific validation errors
- 401 Unauthorized: Redirect to login
- 500 Server Error: Show 'Try again later' toast
- Log all errors to console with full stack trace"
```

---

## The 80/20 Rule

**These 3 techniques give 80% of the value:**

1. **Be Clear and Direct** - Eliminates most ambiguity
2. **Specify Tech Stack** - Prevents wrong framework code
3. **Include Examples** - Shows exact format you want

Start with these three. Add others as needed.

---

## Red Flags in Your Prompts

Watch for these vague words that need precision:

- "Good" → Define what good means
- "Fast" → Specify milliseconds/seconds
- "Modern" → Name specific patterns/libraries
- "Secure" → List security measures
- "User-friendly" → Describe exact UX behaviors
- "Properly" → Define correct behavior
- "Handle" → Specify how to handle

---

## Remember

- **Precision ≠ Length** - Be specific, not verbose
- **Front-load effort** - 10 min precise prompt saves 30 min debugging
- **Context belongs in prompt** - Not in your head
- **Test your precision** - Can a teammate understand without asking questions?

---

**Pro tip:** Save your best precise prompts. Reuse them. Build a library.