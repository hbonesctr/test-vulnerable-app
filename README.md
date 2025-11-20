# Security Scan Template

**Version:** 1.0  
**Last Updated:** 2025-11-19  
**Purpose:** Automated security scanning for open source software validation

## 🔐 Security Scanning Features

- **CodeQL Analysis (SAST)**: Detects code vulnerabilities including SQL injection, XSS, command injection
- **Snyk Security**: Dependency scanning and code analysis
- **Dependency Review**: Validates dependencies in pull requests
- **Secret Scanning**: Detects hardcoded credentials (requires enabling in Settings)
- **Dependabot**: Automated dependency updates

---

## Purpose Statement

This template provides DoD-compliant automated security scanning infrastructure for open source software (OSS) validation. It implements defense-in-depth security analysis using multiple industry-standard tools to detect vulnerabilities, insecure dependencies, and code quality issues.

---

## Compliance Framework

### Applicable Standards

| Standard | Version | Requirement |
|----------|---------|-------------|
| DISA Application Security and Development STIG | V5R3 | APSC-DV-002560, APSC-DV-003235 |
| DoDI 8500.01 | 14 Mar 2014 | Cybersecurity |
| DoDI 8510.01 | 12 Mar 2014 | Risk Management Framework |
| NIST SP 800-53 | Rev 5 | RA-5, SI-2, SA-15 |
| NIST SP 800-218 | Feb 2022 | Secure Software Development Framework |

### Control Implementation

| Control ID | Control Name | Implementation |
|------------|--------------|----------------|
| APSC-DV-002560 | Static Analysis | CodeQL SAST scanning |
| APSC-DV-003235 | Dependency Scanning | Snyk SCA + Dependabot |
| RA-5 | Vulnerability Scanning | Automated weekly scans |
| SI-2 | Flaw Remediation | Automated alerts and PRs |
| SA-15 | Development Process | Integrated CI/CD scanning |

---

## Quick Start

### For Security Assessors

**Time Required:** 5 minutes per project

1. **Use this template** → Click green "Use this template" button
2. **Name repository** → Format: `scan-[project-name]`
3. **Navigate to Actions** → Click "Setup Security Scanning"
4. **Run workflow** → Click "Run workflow" dropdown → Click "Run workflow"
5. **Follow instructions** → Complete steps in automatically created issue
6. **Review findings** → Security tab → Code scanning

### For Program Managers

This template enables rapid, consistent security assessment of OSS projects without requiring specialized security expertise. All scans execute automatically and results aggregate in a central dashboard.

---

## Security Scanning Tools

### Primary Scanners

| Tool | Type | Coverage | DoD Approved |
|------|------|----------|--------------|
| **CodeQL** | SAST | Code vulnerabilities | Yes |
| **Snyk** | SCA + SAST | Dependencies + code | Yes |
| **Dependabot** | Dependency Management | Vulnerable packages | Yes |
| **Secret Scanning** | Credential Detection | Hardcoded secrets | Yes |

### Supported Languages

- JavaScript / TypeScript (Node.js)
- Python
- Java / Kotlin
- C / C++
- C# / .NET
- Go
- Ruby

---

## Installation Methods

### Method 1: Automated Setup (Recommended)

1. Click "Use this template" button
2. Create repository (name format: `scan-[project]`)
3. Go to Actions tab
4. Run "Setup Security Scanning" workflow
5. Follow created issue instructions

### Method 2: GitHub Default Setup

1. Fork/create repository with code
2. Navigate to Settings → Code security and analysis
3. Click "Set up" under Code scanning
4. Select "Default" configuration
5. Click "Enable CodeQL"

---

## Scan Execution Schedule

| Scan Type | Trigger | Frequency |
|-----------|---------|-----------|
| SAST (CodeQL) | Push, PR, Schedule | Every Monday 06:00 UTC |
| SCA (Snyk) | Push, PR, Schedule | Every Monday 07:00 UTC |
| Dependency (Dependabot) | Automatic | Daily check, weekly updates |
| Secret Scanning | Push | Immediate |

---

## Results and Reporting

### Viewing Findings

**Code Scanning Alerts:**
- Location: Security → Code scanning
- Content: Vulnerability findings with severity ratings
- Format: Interactive list with remediation guidance

**Dependency Alerts:**
- Location: Security → Dependabot  
- Content: Vulnerable dependencies with upgrade recommendations
- Format: Automated pull requests for fixes

**Snyk Dashboard:**
- Location: https://app.snyk.io/
- Content: Centralized view across all projects
- Format: Executive dashboard with trend analysis

### Severity Ratings

Findings are classified using CVSS v3.1:

| Severity | CVSS Score | Response Time |
|----------|------------|---------------|
| Critical | 9.0 - 10.0 | Immediate |
| High | 7.0 - 8.9 | 7 days |
| Medium | 4.0 - 6.9 | 30 days |
| Low | 0.1 - 3.9 | 90 days |

---

## Operational Procedures

### Weekly Review Process

**Time Required:** 15-30 minutes

1. **Review Snyk Dashboard** (Monday morning)
   - Check for new critical/high vulnerabilities
   - Note trending issues across projects

2. **Examine GitHub Security Tab**
   - Review new code scanning alerts
   - Verify Dependabot PR status

3. **Update Tracking Documentation**
   - Log new findings in assessment tracker
   - Update remediation status

4. **Generate Weekly Report** (if required)
   - Export findings to CSV
   - Compile executive summary

### Incident Response

**For Critical Vulnerabilities:**

1. **Immediate notification** to project stakeholders
2. **Risk assessment** within 24 hours
3. **Remediation plan** within 48 hours
4. **Implementation tracking** until closure
5. **Verification scan** after remediation

---

## Documentation Templates

### Assessment Report Template
```markdown
# Security Assessment Report

**Project:** [Name]
**Version:** [Version]
**Assessment Date:** [Date]
**Assessor:** [Name]

## Executive Summary
[Brief overview of security posture]

## Methodology
- SAST: CodeQL v[version]
- SCA: Snyk v[version]
- Standards: DISA STIG, NIST SP 800-53

## Findings Summary
| Severity | Count |
|----------|-------|
| Critical | [#] |
| High | [#] |
| Medium | [#] |
| Low | [#] |

## Risk Assessment
[Overall risk rating and justification]

## Recommendations
[Prioritized remediation recommendations]

## Compliance Status
[Map findings to STIG/NIST requirements]
```

### SBOM Generation

**Using GitHub:**
```bash
# Install GitHub CLI
gh api repos/OWNER/REPO/dependency-graph/sbom --jq .sbom > sbom-spdx.json
```

**Format:** SPDX 2.3 (DoD standard)

---

## Troubleshooting

### Common Issues

**Issue:** Workflow fails with "SNYK_TOKEN not found"
- **Solution:** Add SNYK_TOKEN to repository secrets (Settings → Secrets → Actions)

**Issue:** CodeQL finds no code to analyze
- **Solution:** Ensure source code files exist in repository (not just documentation)

**Issue:** Scans fail due to runner timeout
- **Solution:** Increase timeout in workflow file or contact GitHub support

**Issue:** False positives in results
- **Solution:** Review finding, add suppression with justification if appropriate

---

## Security Considerations

### Data Classification

- **Scan Results:** CUI (Controlled Unclassified Information)
- **Source Code:** Varies by project
- **Credentials:** Never commit to repository

### Access Control

- Repository access: Need-to-know basis
- API tokens: Stored as encrypted secrets
- Results: Available only to authorized personnel

### Audit Trail

All security scanning activities are logged:
- Workflow executions: GitHub Actions logs (90 days)
- Scan results: Permanent until manually deleted
- Configuration changes: Git commit history

---

## Support and Contacts

### Technical Support

- **GitHub Issues:** For template bugs and enhancements
- **GitHub Discussions:** For usage questions
- **Snyk Support:** For Snyk-specific issues

### Security Contacts

- **Vulnerability Reports:** [Your security contact email]
- **Incident Response:** [Your IR team contact]

---

## References

### Official Documentation

1. [GitHub Code Scanning Documentation](https://docs.github.com/en/code-security/code-scanning)
2. [CodeQL Documentation](https://codeql.github.com/docs/)
3. [Snyk Documentation](https://docs.snyk.io/)
4. [DISA STIGs](https://public.cyber.mil/stigs/)
5. [NIST SP 800-53 Rev 5](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final)
6. [NIST SP 800-218 SSDF](https://csrc.nist.gov/publications/detail/sp/800-218/final)

### Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-19 | Initial release |

---
