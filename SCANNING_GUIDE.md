# Security Scanning Operations Guide

**Version:** 1.0  
**Audience:** Security assessors, developers, program managers

---

## Table of Contents

1. [Overview](#overview)
2. [Pre-Scan Checklist](#pre-scan-checklist)
3. [Executing Scans](#executing-scans)
4. [Interpreting Results](#interpreting-results)
5. [Remediation Guidance](#remediation-guidance)
6. [Reporting Procedures](#reporting-procedures)

---

## Overview

This guide provides detailed operational procedures for executing and managing security scans using the DoD-compliant security scanning template.

### Scan Types

| Scan | Purpose | Execution Time |
|------|---------|----------------|
| **SAST** | Find code vulnerabilities | 5-15 minutes |
| **SCA** | Identify vulnerable dependencies | 3-7 minutes |
| **Secret Scanning** | Detect hardcoded credentials | 1-2 minutes |

---

## Pre-Scan Checklist

### Before First Scan

- [ ] Repository created from template
- [ ] SNYK_TOKEN added to secrets (if using Snyk)
- [ ] GitHub security features enabled
- [ ] Code successfully committed to repository
- [ ] Dependencies file exists (package.json, requirements.txt, etc.)

### Before Each Scan

- [ ] Latest code committed to repository
- [ ] No pending dependency updates
- [ ] Previous scan findings documented
- [ ] Baseline established (first scan) or comparison available (subsequent scans)

---

## Executing Scans

### Manual Execution

**Step-by-Step:**

1. **Navigate to Actions Tab**
   - Go to your repository
   - Click "Actions" tab

2. **Select Workflow**
   - Choose "CodeQL Security Analysis" or "Snyk Security Analysis"

3. **Trigger Scan**
   - Click "Run workflow" dropdown (right side)
   - Select branch (usually "main")
   - Click green "Run workflow" button

4. **Monitor Progress**
   - Workflow appears in list immediately
   - Yellow dot = Running
   - Green check = Success
   - Red X = Failed (click for details)

5. **Review Duration**
   - Typical completion: 3-10 minutes
   - Long scans (>30 min): Check timeout settings

### Automatic Execution

Scans run automatically on:
- **Push to main/master:** Immediate scan
- **Pull request:** Scan on PR creation/update
- **Schedule:** Every Monday 06:00 UTC (CodeQL), 07:00 UTC (Snyk)

---

## Interpreting Results

### Code Scanning Alerts

**Location:** Security → Code scanning

**Understanding Findings:**
```
Alert Title: SQL Injection
├─ Severity: High (CVSS 8.5)
├─ CWE: CWE-89
├─ Location: src/api/users.js:45
├─ Description: User input flows to SQL query without sanitization
└─ Remediation: Use parameterized queries
```

**Key Fields:**

- **Severity:** Critical/High/Medium/Low based on CVSS score
- **CWE ID:** Common Weakness Enumeration identifier
- **Location:** Exact file and line number
- **Data Flow:** Shows how untrusted data reaches vulnerable sink
- **Remediation:** Specific fix recommendations

### Dependency Alerts

**Location:** Security → Dependabot

**Understanding Findings:**
```
Package: express@4.17.1
├─ Current Version: 4.17.1
├─ Fixed Version: 4.18.2
├─ CVE: CVE-2022-24999
├─ Severity: High (CVSS 7.5)
└─ Fix: Automated PR available
```

**Response Options:**

1. **Accept Automated PR:** Safest option if tests pass
2. **Manual Update:** If PR conflicts with code
3. **Defer Update:** If breaking changes require planning
4. **Accept Risk:** Document justification in issue

### Snyk Dashboard

**Location:** https://app.snyk.io/

**Dashboard Sections:**

- **Projects:** All scanned repositories
- **Issues:** Aggregated vulnerability list
- **Reports:** Trend analysis and metrics
- **Dependencies:** Inventory across projects

---

## Remediation Guidance

### Priority Matrix

| Severity | Exploitability | Priority |
|----------|---------------|----------|
| Critical | High | P1 - Immediate |
| Critical | Medium/Low | P2 - 7 days |
| High | High | P2 - 7 days |
| High | Medium | P3 - 30 days |
| High | Low | P4 - 90 days |
| Medium/Low | Any | P4 - 90 days |

### Common Vulnerabilities

**SQL Injection:**
```javascript
// VULNERABLE
const query = "SELECT * FROM users WHERE id = " + userId;

// SECURE
const query = "SELECT * FROM users WHERE id = ?";
db.query(query, [userId]);
```

**Cross-Site Scripting (XSS):**
```javascript
// VULNERABLE
res.send('<h1>Welcome ' + userName + '</h1>');

// SECURE
res.send('<h1>Welcome ' + escapeHtml(userName) + '</h1>');
```

**Command Injection:**
```javascript
// VULNERABLE
exec('ping ' + hostInput);

// SECURE
execFile('ping', [hostInput]);
```

**Hardcoded Secrets:**
```javascript
// VULNERABLE
const API_KEY = 'sk_live_abc123';

// SECURE
const API_KEY = process.env.API_KEY;
```

### Dependency Updates

**Safe Update Process:**

1. Review changelog for breaking changes
2. Update in feature branch
3. Run test suite
4. Scan with security tools
5. Deploy to staging environment
6. Monitor for issues
7. Merge to production

---

## Reporting Procedures

### Weekly Status Report Template
```markdown
# Weekly Security Scan Report

**Week Ending:** [Date]
**Assessor:** [Name]

## Scan Summary

| Project | Critical | High | Medium | Low |
|---------|----------|------|--------|-----|
| Project A | 0 | 2 | 5 | 12 |
| Project B | 1 | 3 | 4 | 8 |

## New Findings This Week

### Critical
- None

### High
1. **Project B - SQL Injection** (CVE-2025-XXXXX)
   - Status: Under remediation
   - ETA: 2025-11-22

## Remediation Progress

| Finding | Status | Target Date |
|---------|--------|-------------|
| Project A - XSS | Fixed | 2025-11-18 |
| Project B - SQLi | In Progress | 2025-11-22 |

## Metrics

- Total projects scanned: 2
- Total vulnerabilities: 35
- Fixed this week: 3
- New this week: 2
```

### Assessment Report Template

See README.md for full assessment report template.

### Exporting Data

**GitHub Alerts (CSV):**
1. Security → Code scanning
2. Filter as needed
3. Click "Export" button
4. Select CSV format

**Snyk Dashboard (PDF):**
1. Navigate to Reports
2. Select date range
3. Click "Export"
4. Choose PDF format

---

## Troubleshooting

### Scan Failures

**Error:** "No code found to analyze"
- **Cause:** Repository contains only documentation
- **Solution:** Ensure source code files are committed

**Error:** "Rate limit exceeded"
- **Cause:** Too many API calls to scanning service
- **Solution:** Wait 60 minutes, reduce scan frequency

**Error:** "Timeout after 360 minutes"
- **Cause:** Very large codebase or complex build
- **Solution:** Contact GitHub support for increased limits

### False Positives

**Identifying False Positives:**
- Review data flow carefully
- Check if input is actually validated elsewhere
- Consult with developers familiar with code

**Handling False Positives:**
1. Document analysis in comment on alert
2. Dismiss with justification
3. Create suppression rule if pattern repeats
4. Add to baseline for future comparisons

---

## Best Practices

### Scan Frequency

- **Development Phase:** Every commit (via CI/CD)
- **Maintenance Phase:** Weekly scheduled scans
- **Critical Systems:** Daily scans

### Alert Management

- Triage all alerts within 48 hours
- Assign owners to each finding
- Track remediation progress
- Re-scan after fixes

### Documentation

- Maintain scan logs for audit purposes
- Document all risk acceptance decisions
- Keep compliance mapping current
- Update baseline after major changes

---

## Appendix: DoD Compliance Mapping

### DISA STIG Requirements

**APSC-DV-002560:** Static Code Analysis
- **Implementation:** CodeQL SAST execution
- **Evidence:** Scan logs in GitHub Actions
- **Frequency:** Weekly minimum

**APSC-DV-003235:** Dependency Vulnerability Analysis
- **Implementation:** Snyk SCA + Dependabot
- **Evidence:** Dependency scan results
- **Frequency:** Weekly minimum

### NIST SP 800-53 Controls

**RA-5:** Vulnerability Scanning
- **Implementation:** Automated weekly scans
- **Evidence:** GitHub Actions logs, Snyk dashboard

**SI-2:** Flaw Remediation
- **Implementation:** Automated alerts and update PRs
- **Evidence:** Dependabot PRs, remediation tracking

---
