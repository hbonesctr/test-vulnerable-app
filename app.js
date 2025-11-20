// Vulnerable Test Application
// WARNING: Contains intentional security vulnerabilities for testing
// DO NOT use in production

const express = require('express');
const app = express();
const { exec } = require('child_process');
const fs = require('fs');

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===================================================================
// Vulnerability 1: SQL Injection
// CWE-89: Improper Neutralization of Special Elements in SQL Command
// CVSS: 9.8 (Critical)
// ===================================================================

app.get('/user', (req, res) => {
  const userId = req.query.id;
  
  // VULNERABLE: Direct string concatenation in SQL query
  const query = "SELECT * FROM users WHERE id = " + userId;
  
  console.log('Executing query:', query);
  res.json({ 
    message: 'User query executed',
    query: query,
    vulnerability: 'SQL Injection'
  });
});

// ===================================================================
// Vulnerability 2: Command Injection
// CWE-78: OS Command Injection
// CVSS: 9.8 (Critical)
// ===================================================================

app.get('/ping', (req, res) => {
  const host = req.query.host;
  
  // VULNERABLE: Unsanitized input in system command
  exec('ping -c 4 ' + host, (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ 
      output: stdout,
      vulnerability: 'Command Injection'
    });
  });
});

// ===================================================================
// Vulnerability 3: Cross-Site Scripting (XSS)
// CWE-79: Improper Neutralization of Input During Web Page Generation
// CVSS: 7.3 (High)
// ===================================================================

app.get('/welcome', (req, res) => {
  const name = req.query.name;
  
  // VULNERABLE: Unescaped user input in HTML response
  res.send('<h1>Welcome ' + name + '!</h1><p>Enjoy our services</p>');
});

// ===================================================================
// Vulnerability 4: Path Traversal
// CWE-22: Improper Limitation of a Pathname to a Restricted Directory
// CVSS: 7.5 (High)
// ===================================================================

app.get('/file', (req, res) => {
  const filename = req.query.name;
  
  // VULNERABLE: No path validation
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      res.status(404).json({ error: 'File not found' });
      return;
    }
    res.send(data);
  });
});

// ===================================================================
// Vulnerability 5: Insecure Deserialization
// CWE-502: Deserialization of Untrusted Data
// CVSS: 8.1 (High)
// ===================================================================

app.post('/deserialize', (req, res) => {
  const data = req.body.data;
  
  // VULNERABLE: Deserializing untrusted data
  const obj = eval('(' + data + ')');
  
  res.json({ 
    result: obj,
    vulnerability: 'Insecure Deserialization'
  });
});

// ===================================================================
// Vulnerability 6: Hardcoded Credentials
// CWE-798: Use of Hard-coded Credentials
// CVSS: 9.8 (Critical)
// ===================================================================

// VULNERABLE: Hardcoded API keys and secrets
const API_KEY = 'sk_live_1234567890abcdefghijklmnop';
const DATABASE_PASSWORD = 'SuperSecretP@ssw0rd123!';
const JWT_SECRET = 'my-super-secret-jwt-key-12345';
const AWS_SECRET_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';

// Database connection (vulnerable)
const DB_CONNECTION_STRING = 'mongodb://admin:password123@localhost:27017/myapp';

// ===================================================================
// Vulnerability 7: Insecure Random Number Generation
// CWE-338: Use of Cryptographically Weak PRNG
// CVSS: 5.3 (Medium)
// ===================================================================

app.get('/token', (req, res) => {
  // VULNERABLE: Math.random() is not cryptographically secure
  const token = Math.random().toString(36).substring(2);
  
  res.json({ 
    token: token,
    vulnerability: 'Weak Random Generation'
  });
});

// ===================================================================
// Vulnerability 8: Unvalidated Redirect
// CWE-601: URL Redirection to Untrusted Site
// CVSS: 6.1 (Medium)
// ===================================================================

app.get('/redirect', (req, res) => {
  const url = req.query.url;
  
  // VULNERABLE: No validation of redirect URL
  res.redirect(url);
});

// ===================================================================
// Vulnerability 9: Missing Authentication
// CWE-306: Missing Authentication for Critical Function
// CVSS: 9.1 (Critical)
// ===================================================================

app.delete('/admin/users/:id', (req, res) => {
  const userId = req.params.id;
  
  // VULNERABLE: No authentication check
  console.log('Deleting user:', userId);
  
  res.json({ 
    message: 'User deleted',
    vulnerability: 'Missing Authentication'
  });
});

// ===================================================================
// Vulnerability 10: Information Exposure
// CWE-209: Information Exposure Through an Error Message
// CVSS: 5.3 (Medium)
// ===================================================================

app.get('/error-test', (req, res) => {
  try {
    // Intentional error
    const result = JSON.parse('invalid json');
  } catch (error) {
    // VULNERABLE: Exposing full error stack trace
    res.status(500).json({
      error: error.message,
      stack: error.stack,
      vulnerability: 'Information Exposure'
    });
  }
});

// ===================================================================
// Server Configuration
// ===================================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('⚠️  VULNERABLE TEST APPLICATION');
  console.log('='.repeat(50));
  console.log(`Server running on port ${PORT}`);
  console.log('');
  console.log('WARNING: This application contains intentional');
  console.log('security vulnerabilities for testing purposes.');
  console.log('DO NOT deploy to production!');
  console.log('');
  console.log('Vulnerabilities included:');
  console.log('  1. SQL Injection');
  console.log('  2. Command Injection');
  console.log('  3. Cross-Site Scripting (XSS)');
  console.log('  4. Path Traversal');
  console.log('  5. Insecure Deserialization');
  console.log('  6. Hardcoded Credentials');
  console.log('  7. Weak Random Number Generation');
  console.log('  8. Unvalidated Redirect');
  console.log('  9. Missing Authentication');
  console.log(' 10. Information Exposure');
  console.log('='.repeat(50));
});

module.exports = app;
```

4. **Commit:**
   - Message: `Add vulnerable test application with 10 security issues`
   - Click **"Commit changes"**

✅ **Checkpoint:** Repository now has vulnerable code ready to scan!

---

### Step 2.5: Configure SNYK_TOKEN Secret (2 min)

1. **Click:** Settings tab

2. **Click:** "Secrets and variables" → "Actions" (left sidebar)

3. **Click:** "New repository secret" (green button)

4. **Configure secret:**
   - **Name:** `SNYK_TOKEN`
   - **Secret:** (paste your Snyk API token from https://app.snyk.io/account)

5. **Click:** "Add secret"

✅ **Checkpoint:** SNYK_TOKEN configured!

---

### Step 2.6: Disable Default CodeQL (if enabled) (1 min)

**Check if GitHub enabled default CodeQL:**

1. **Click:** Security tab

2. **Click:** Code scanning (left sidebar)

3. **Look for:** "Tools" dropdown or "Set up code scanning" button

**If you see "CodeQL" listed with "default setup" or "Tools 1":**
   - Click three dots (...) next to CodeQL
   - Click "Remove tool" or "Disable"
   - Confirm

**If you see "Set up code scanning" button:**
   - ✅ Good! Default setup is NOT enabled
   - No action needed

✅ **Checkpoint:** Default CodeQL disabled (if it was enabled)

---

### Step 2.7: Manually Run Workflows (2 min)

**Trigger CodeQL:**

1. **Click:** Actions tab

2. **Left sidebar:** Click "CodeQL"

3. **Click:** "Run workflow" dropdown (right side)

4. **Branch:** main

5. **Click:** Green "Run workflow" button

**Trigger Snyk:**

1. **Still in Actions tab**

2. **Left sidebar:** Click "Snyk Security"

3. **Click:** "Run workflow" dropdown

4. **Branch:** main

5. **Click:** Green "Run workflow" button

✅ **Checkpoint:** Both workflows triggered!

---

## ⏱️ Wait Time (10 minutes)

**While workflows are running:**
```
Expected Timeline:
├─ T+0 min:  Workflows started
├─ T+1 min:  Checkout complete
├─ T+2 min:  CodeQL initializing
├─ T+3 min:  Snyk scanning dependencies
├─ T+5 min:  CodeQL analyzing code
├─ T+8 min:  Snyk workflow complete ✅
└─ T+10 min: CodeQL workflow complete ✅
```

**You can monitor progress:**
- Actions tab → Click on running workflow
- Watch real-time logs
- Yellow dot 🟡 = Running
- Green check ✅ = Success
- Red X ❌ = Failed (let me know if this happens!)

---

## 📊 What to Do While Waiting

**Optional tasks:**

1. **Connect repository to Snyk dashboard:**
   - Visit: https://app.snyk.io/
   - Click "Add project"
   - Select GitHub
   - Select test-vulnerable-app
   - Import

2. **Review your fixed template:**
   - Verify all workflows are correct
   - Check README documentation

3. **Grab coffee ☕** - you've earned it!

---

## 🎯 Next Steps

**Once workflows complete (~10 min), let me know and we'll move to:**

### Phase 3: Validation
- Verify code scanning alerts appear
- Check Dependabot findings
- Export results for documentation
- Celebrate success! 🎉

---

**Status Check:**
```
✅ Phase 1: Template Fixed
🟡 Phase 2: In Progress
   ✅ Old repo deleted
   ✅ New repo created from template
   ✅ app.js added
   ✅ package.json added
   ✅ SNYK_TOKEN configured
   ✅ Default CodeQL disabled
   ✅ Workflows triggered
   ⏳ Waiting for workflows to complete...
⏸️  Phase 3: Ready to start
