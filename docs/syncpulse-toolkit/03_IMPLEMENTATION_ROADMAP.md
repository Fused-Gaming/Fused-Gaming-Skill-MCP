# Implementation Roadmap - SyncPulse Ethical Hacking Toolkit

## 8-Week Delivery Plan with Code Sketches

---

## Phase 1: Legal & Compliance (Weeks 1-2)

### Objectives
✅ Build legal defensibility layer  
✅ Establish evidence chain of custody  
✅ Create findings tracking foundation  
✅ Pass legal review

### Week 1: Core Services Architecture

#### Day 1-2: RoEValidator Service

**Purpose:** Prevent unauthorized testing before it happens.

**File:** `packages/skills/syncpulse/src/services/RoEValidator.ts`

```typescript
import crypto from 'crypto';
import { FindingsDatabase } from './FindingsDatabase';

export interface RulesOfEngagement {
  engagementId: string;
  clientName: string;
  authorizedTargets: TargetScope[];
  forbiddenTargets: string[];
  allowedTestingMethods: TestingMethod[];
  timeWindow: {
    start: Date;
    end: Date;
  };
  maxConcurrentTests: number;
  escalationContacts: EscalationContact[];
}

export interface TargetScope {
  type: 'domain' | 'ip' | 'cidr' | 'host';
  value: string;
  services?: string[]; // e.g., ['ssh', 'http', 'https']
  excludedPorts?: number[];
}

export enum TestingMethod {
  PASSIVE_RECON = 'passive-reconnaissance',
  ACTIVE_SCANNING = 'active-scanning',
  VULNERABILITY_TESTING = 'vulnerability-testing',
  EXPLOITATION = 'exploitation',
  SOCIAL_ENGINEERING = 'social-engineering'
}

export interface ValidationResult {
  valid: boolean;
  violations: Violation[];
  warnings: Warning[];
  approvalToken?: string; // Valid for 1 test execution
}

export interface Violation {
  severity: 'critical' | 'high' | 'medium';
  type: 'scope' | 'method' | 'timing' | 'frequency';
  message: string;
  target?: string;
  method?: TestingMethod;
}

export class RoEValidator {
  private roe: RoEValidation | null = null;
  private findingsDb: FindingsDatabase;

  constructor(findingsDb: FindingsDatabase) {
    this.findingsDb = findingsDb;
  }

  async loadRoE(roePath: string): Promise<void> {
    // Load from JSON or DB
    const data = require(roePath);
    this.roe = {
      ...data,
      timeWindow: {
        start: new Date(data.timeWindow.start),
        end: new Date(data.timeWindow.end)
      }
    };
  }

  validateScope(targets: string[]): ValidationResult {
    if (!this.roe) {
      return { valid: false, violations: [{ 
        severity: 'critical',
        type: 'scope',
        message: 'No RoE loaded' 
      }] };
    }

    const violations: Violation[] = [];
    const warnings: Warning[] = [];

    // Check time window
    const now = new Date();
    if (now < this.roe.timeWindow.start || now > this.roe.timeWindow.end) {
      violations.push({
        severity: 'critical',
        type: 'timing',
        message: `Testing outside authorized window: ${this.roe.timeWindow.start} to ${this.roe.timeWindow.end}`
      });
    }

    // Check each target
    for (const target of targets) {
      if (!this.isInScope(target)) {
        violations.push({
          severity: 'critical',
          type: 'scope',
          message: `Target ${target} not in authorized scope`,
          target
        });
      }

      if (this.isExplicitlyForbidden(target)) {
        violations.push({
          severity: 'critical',
          type: 'scope',
          message: `Target ${target} explicitly forbidden`,
          target
        });
      }
    }

    const valid = violations.filter(v => v.severity === 'critical').length === 0;

    const result: ValidationResult = {
      valid,
      violations,
      warnings
    };

    if (valid) {
      result.approvalToken = crypto.randomBytes(32).toString('hex');
    }

    return result;
  }

  validateTestingMethod(method: TestingMethod, target: string): ValidationResult {
    if (!this.roe) {
      return { valid: false, violations: [{ 
        severity: 'critical',
        type: 'method',
        message: 'No RoE loaded' 
      }] };
    }

    const violations: Violation[] = [];

    if (!this.roe.allowedTestingMethods.includes(method)) {
      violations.push({
        severity: 'critical',
        type: 'method',
        message: `Testing method ${method} not authorized`,
        method
      });
    }

    return {
      valid: violations.length === 0,
      violations,
      warnings: []
    };
  }

  private isInScope(target: string): boolean {
    if (!this.roe) return false;

    for (const scope of this.roe.authorizedTargets) {
      if (scope.type === 'domain' && this.matchesDomain(target, scope.value)) {
        return true;
      }
      if (scope.type === 'ip' && target === scope.value) {
        return true;
      }
      if (scope.type === 'cidr' && this.matchesCIDR(target, scope.value)) {
        return true;
      }
      if (scope.type === 'host' && target === scope.value) {
        return true;
      }
    }

    return false;
  }

  private isExplicitlyForbidden(target: string): boolean {
    return this.roe?.forbiddenTargets.includes(target) || false;
  }

  private matchesDomain(target: string, domainScope: string): boolean {
    return target === domainScope || target.endsWith('.' + domainScope);
  }

  private matchesCIDR(ip: string, cidr: string): boolean {
    // Simple CIDR matching - use ipaddr.js in production
    const [subnet, bits] = cidr.split('/');
    // Implementation details...
    return true; // placeholder
  }
}
```

**Integration Point:**
```typescript
// In skill initialization
import { RoEValidator } from './services/RoEValidator';
import { FindingsDatabase } from './services/FindingsDatabase';

const findingsDb = new FindingsDatabase(config);
const roeValidator = new RoEValidator(findingsDb);
await roeValidator.loadRoE('./roe.json');

// Before any test execution
const validation = roeValidator.validateScope(targets);
if (!validation.valid) {
  throw new Error(`RoE violation: ${validation.violations[0].message}`);
}
```

---

#### Day 2-3: EvidenceManager Service

**Purpose:** Immutable, cryptographically signed evidence storage.

**File:** `packages/skills/syncpulse/src/services/EvidenceManager.ts`

```typescript
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export interface Evidence {
  id: string;
  findingId: string;
  contentType: 'text' | 'binary' | 'json';
  contentHash: string; // SHA-256
  content: Buffer;
  collectedBy: string; // agent ID or user
  collectedAt: Date;
  signature: string; // HMAC-SHA256
  chainOfCustody: CustodyEvent[];
}

export interface CustodyEvent {
  timestamp: Date;
  actor: string;
  action: 'created' | 'accessed' | 'verified' | 'transferred';
  details: string;
}

export class EvidenceManager {
  private evidenceDir: string;
  private hmacKey: string;

  constructor(evidenceDir: string = '.evidence', hmacKey?: string) {
    this.evidenceDir = evidenceDir;
    // In production, load HMAC key from secure vault (AWS KMS, HashiCorp Vault)
    this.hmacKey = hmacKey || process.env.EVIDENCE_HMAC_KEY || crypto.randomBytes(32).toString('hex');
  }

  async recordEvidence(
    findingId: string,
    content: Buffer,
    contentType: 'text' | 'binary' | 'json',
    collectedBy: string
  ): Promise<Evidence> {
    const id = crypto.randomUUID();
    const contentHash = crypto.createHash('sha256').update(content).digest('hex');
    
    const evidence: Evidence = {
      id,
      findingId,
      contentType,
      contentHash,
      content,
      collectedBy,
      collectedAt: new Date(),
      signature: '',
      chainOfCustody: []
    };

    // Generate HMAC signature
    evidence.signature = crypto
      .createHmac('sha256', this.hmacKey)
      .update(contentHash + evidence.collectedAt.toISOString())
      .digest('hex');

    // Initialize chain of custody
    evidence.chainOfCustody.push({
      timestamp: new Date(),
      actor: collectedBy,
      action: 'created',
      details: `Evidence recorded for finding ${findingId}`
    });

    // Store to disk
    await this.persistEvidence(evidence);

    return evidence;
  }

  async verifyIntegrity(evidenceId: string): Promise<boolean> {
    const evidence = await this.loadEvidence(evidenceId);
    if (!evidence) return false;

    // Verify hash
    const computedHash = crypto.createHash('sha256').update(evidence.content).digest('hex');
    if (computedHash !== evidence.contentHash) {
      console.error(`Evidence ${evidenceId}: Hash mismatch!`);
      return false;
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', this.hmacKey)
      .update(evidence.contentHash + evidence.collectedAt.toISOString())
      .digest('hex');

    if (expectedSignature !== evidence.signature) {
      console.error(`Evidence ${evidenceId}: Signature verification failed!`);
      return false;
    }

    return true;
  }

  async addCustodyEvent(evidenceId: string, actor: string, action: CustodyEvent['action'], details: string): Promise<void> {
    const evidence = await this.loadEvidence(evidenceId);
    if (!evidence) throw new Error(`Evidence ${evidenceId} not found`);

    evidence.chainOfCustody.push({
      timestamp: new Date(),
      actor,
      action,
      details
    });

    await this.persistEvidence(evidence);
  }

  async getChainOfCustody(evidenceId: string): Promise<CustodyEvent[]> {
    const evidence = await this.loadEvidence(evidenceId);
    return evidence?.chainOfCustody || [];
  }

  private async persistEvidence(evidence: Evidence): Promise<void> {
    const filePath = path.join(this.evidenceDir, `${evidence.id}.json`);
    
    // Store metadata separately from binary content
    const metadata = {
      id: evidence.id,
      findingId: evidence.findingId,
      contentType: evidence.contentType,
      contentHash: evidence.contentHash,
      collectedBy: evidence.collectedBy,
      collectedAt: evidence.collectedAt.toISOString(),
      signature: evidence.signature,
      chainOfCustody: evidence.chainOfCustody
    };

    await fs.writeFile(filePath, JSON.stringify(metadata, null, 2));
    
    // Store content separately
    const contentPath = path.join(this.evidenceDir, `${evidence.id}.bin`);
    await fs.writeFile(contentPath, evidence.content);
  }

  private async loadEvidence(evidenceId: string): Promise<Evidence | null> {
    const filePath = path.join(this.evidenceDir, `${evidenceId}.json`);
    
    try {
      const metadata = JSON.parse(await fs.readFile(filePath, 'utf-8'));
      const contentPath = path.join(this.evidenceDir, `${evidenceId}.bin`);
      const content = await fs.readFile(contentPath);

      return {
        ...metadata,
        content,
        collectedAt: new Date(metadata.collectedAt)
      };
    } catch {
      return null;
    }
  }
}
```

---

#### Day 3-4: FindingsDatabase Service

**Purpose:** Persistent storage and deduplication of findings.

**File:** `packages/skills/syncpulse/src/services/FindingsDatabase.ts`

```typescript
import Database from 'better-sqlite3';
import path from 'path';

export interface Finding {
  id: string;
  engagementId: string;
  targetHost: string;
  vulnerabilityType: string; // SQL Injection, XSS, etc.
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  cvssScore: number; // 0.0-10.0
  cvssVector?: string; // CVSS 3.1 vector
  cweIds: string[]; // CWE-79, CWE-89, etc.
  description: string;
  evidence: {
    screenshotPath?: string;
    requestPayload?: string;
    responseData?: string;
  };
  status: 'Open' | 'InProgress' | 'Resolved' | 'AcceptedRisk' | 'FalsePositive';
  createdAt: Date;
  updatedAt: Date;
  discoveredBy: string; // agent ID
}

export interface FindingQuery {
  engagementId?: string;
  targetHost?: string;
  severity?: Finding['severity'][];
  status?: Finding['status'][];
  vulnerabilityType?: string;
}

export class FindingsDatabase {
  private db: Database.Database;

  constructor(dbPath: string = '.findings.db') {
    this.db = new Database(dbPath);
    this.initSchema();
  }

  private initSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS findings (
        id TEXT PRIMARY KEY,
        engagement_id TEXT NOT NULL,
        target_host TEXT NOT NULL,
        vulnerability_type TEXT NOT NULL,
        severity TEXT CHECK(severity IN ('Critical', 'High', 'Medium', 'Low', 'Informational')),
        cvss_score REAL,
        cvss_vector TEXT,
        cwe_ids TEXT, -- JSON array
        description TEXT NOT NULL,
        screenshot_path TEXT,
        request_payload TEXT,
        response_data TEXT,
        status TEXT CHECK(status IN ('Open', 'InProgress', 'Resolved', 'AcceptedRisk', 'FalsePositive')),
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        discovered_by TEXT NOT NULL,
        UNIQUE(engagement_id, target_host, vulnerability_type)
      );

      CREATE INDEX IF NOT EXISTS idx_engagement_id ON findings(engagement_id);
      CREATE INDEX IF NOT EXISTS idx_severity ON findings(severity);
      CREATE INDEX IF NOT EXISTS idx_status ON findings(status);
    `);
  }

  async storeFinding(finding: Finding): Promise<string> {
    const stmt = this.db.prepare(`
      INSERT INTO findings (
        id, engagement_id, target_host, vulnerability_type, severity,
        cvss_score, cvss_vector, cwe_ids, description, screenshot_path,
        request_payload, response_data, status, created_at, updated_at, discovered_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(engagement_id, target_host, vulnerability_type) DO UPDATE SET
        status = excluded.status,
        updated_at = excluded.updated_at
    `);

    const result = stmt.run(
      finding.id,
      finding.engagementId,
      finding.targetHost,
      finding.vulnerabilityType,
      finding.severity,
      finding.cvssScore,
      finding.cvssVector || null,
      JSON.stringify(finding.cweIds),
      finding.description,
      finding.evidence.screenshotPath || null,
      finding.evidence.requestPayload || null,
      finding.evidence.responseData || null,
      finding.status,
      finding.createdAt.toISOString(),
      finding.updatedAt.toISOString(),
      finding.discoveredBy
    );

    return finding.id;
  }

  async queryFindings(query: FindingQuery): Promise<Finding[]> {
    let sql = 'SELECT * FROM findings WHERE 1=1';
    const params: any[] = [];

    if (query.engagementId) {
      sql += ' AND engagement_id = ?';
      params.push(query.engagementId);
    }

    if (query.targetHost) {
      sql += ' AND target_host = ?';
      params.push(query.targetHost);
    }

    if (query.severity && query.severity.length > 0) {
      const placeholders = query.severity.map(() => '?').join(',');
      sql += ` AND severity IN (${placeholders})`;
      params.push(...query.severity);
    }

    if (query.status && query.status.length > 0) {
      const placeholders = query.status.map(() => '?').join(',');
      sql += ` AND status IN (${placeholders})`;
      params.push(...query.status);
    }

    if (query.vulnerabilityType) {
      sql += ' AND vulnerability_type = ?';
      params.push(query.vulnerabilityType);
    }

    const stmt = this.db.prepare(sql);
    const rows = stmt.all(...params) as any[];

    return rows.map(row => ({
      id: row.id,
      engagementId: row.engagement_id,
      targetHost: row.target_host,
      vulnerabilityType: row.vulnerability_type,
      severity: row.severity,
      cvssScore: row.cvss_score,
      cvssVector: row.cvss_vector,
      cweIds: JSON.parse(row.cwe_ids || '[]'),
      description: row.description,
      evidence: {
        screenshotPath: row.screenshot_path,
        requestPayload: row.request_payload,
        responseData: row.response_data
      },
      status: row.status,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      discoveredBy: row.discovered_by
    }));
  }

  async updateStatus(findingId: string, status: Finding['status']): Promise<void> {
    const stmt = this.db.prepare('UPDATE findings SET status = ?, updated_at = ? WHERE id = ?');
    stmt.run(status, new Date().toISOString(), findingId);
  }

  close(): void {
    this.db.close();
  }
}
```

---

#### Day 4: ComplianceChecker Service

**Purpose:** Map findings to compliance frameworks.

**File:** `packages/skills/syncpulse/src/services/ComplianceChecker.ts`

```typescript
export interface CWE {
  id: string;
  name: string;
  description: string;
}

export interface OWASPTopic {
  category: string; // A01:2021, A02:2021, etc.
  name: string;
  description: string;
}

export interface CVSSVector {
  version: '3.0' | '3.1';
  baseScore: number;
  baseSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  vector: string; // "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
}

// Simplified CWE database
const CWE_DATABASE: Record<string, CWE> = {
  'CWE-79': {
    id: 'CWE-79',
    name: 'Improper Neutralization of Input During Web Page Generation',
    description: 'Cross-site Scripting (XSS)'
  },
  'CWE-89': {
    id: 'CWE-89',
    name: 'Improper Neutralization of Special Elements used in SQL',
    description: 'SQL Injection'
  },
  'CWE-434': {
    id: 'CWE-434',
    name: 'Unrestricted Upload of File with Dangerous Type',
    description: 'Arbitrary File Upload'
  },
  // ... more mappings
};

const OWASP_DATABASE: Record<string, OWASPTopic> = {
  'A01:2021': {
    category: 'A01:2021',
    name: 'Broken Access Control',
    description: 'Users can act outside their intended permissions'
  },
  'A02:2021': {
    category: 'A02:2021',
    name: 'Cryptographic Failures',
    description: 'Sensitive data exposed due to weak cryptography'
  },
  'A03:2021': {
    category: 'A03:2021',
    name: 'Injection',
    description: 'Untrusted data interpreted as executable code'
  },
  // ... more mappings
};

export class ComplianceChecker {
  mapToCWE(description: string): CWE[] {
    const matches: CWE[] = [];
    const lowerDesc = description.toLowerCase();

    for (const [id, cwe] of Object.entries(CWE_DATABASE)) {
      if (lowerDesc.includes(cwe.name.toLowerCase()) ||
          lowerDesc.includes(cwe.description.toLowerCase())) {
        matches.push(cwe);
      }
    }

    return matches;
  }

  mapToOWASP(description: string): OWASPTopic[] {
    const matches: OWASPTopic[] = [];
    const lowerDesc = description.toLowerCase();

    for (const [category, topic] of Object.entries(OWASP_DATABASE)) {
      if (lowerDesc.includes(topic.name.toLowerCase()) ||
          lowerDesc.includes(topic.description.toLowerCase())) {
        matches.push(topic);
      }
    }

    return matches;
  }

  calculateCVSS(description: string, targetType: string): CVSSVector {
    // Simplified CVSS calculation
    const score = this.estimateCVSSScore(description);
    const severity = this.scoreTtoSeverity(score);
    const vector = this.generateVector(description);

    return {
      version: '3.1',
      baseScore: score,
      baseSeverity: severity,
      vector
    };
  }

  private estimateCVSSScore(description: string): number {
    const lowerDesc = description.toLowerCase();

    if (lowerDesc.includes('rce') || lowerDesc.includes('remote code execution')) return 9.8;
    if (lowerDesc.includes('sql injection') || lowerDesc.includes('os command injection')) return 9.0;
    if (lowerDesc.includes('xss') || lowerDesc.includes('cross-site')) return 6.1;
    if (lowerDesc.includes('authentication') || lowerDesc.includes('bypass')) return 8.0;
    if (lowerDesc.includes('information disclosure')) return 5.3;

    return 5.0; // Default medium
  }

  private scoreTtoSeverity(score: number): CVSSVector['baseSeverity'] {
    if (score >= 9.0) return 'CRITICAL';
    if (score >= 7.0) return 'HIGH';
    if (score >= 4.0) return 'MEDIUM';
    if (score >= 0.1) return 'LOW';
    return 'NONE';
  }

  private generateVector(description: string): string {
    // Simplified vector generation - use real CVSS calculator in production
    return 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H';
  }
}
```

---

### Week 2: Integration & Testing

#### Days 5-6: Database Schema & Setup

Create database migration for Phase 1:

```sql
-- File: migrations/001_phase1_schema.sql
CREATE TABLE IF NOT EXISTS engagements (
  id UUID PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATETIME,
  end_date DATETIME,
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rules_of_engagement (
  id UUID PRIMARY KEY,
  engagement_id UUID NOT NULL REFERENCES engagements(id),
  roe_json JSONB NOT NULL,
  approved_at DATETIME,
  approved_by VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS findings (
  id UUID PRIMARY KEY,
  engagement_id UUID NOT NULL REFERENCES engagements(id),
  target_host VARCHAR(255) NOT NULL,
  vulnerability_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20),
  cvss_score FLOAT,
  cvss_vector VARCHAR(100),
  cwe_ids TEXT,
  owasp_categories TEXT,
  description TEXT NOT NULL,
  status VARCHAR(50),
  discovered_by VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(engagement_id, target_host, vulnerability_type)
);

CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY,
  finding_id UUID NOT NULL REFERENCES findings(id),
  content_hash VARCHAR(64) NOT NULL,
  content_type VARCHAR(50),
  signature VARCHAR(256),
  collected_by VARCHAR(100),
  collected_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evidence_chain_of_custody (
  id UUID PRIMARY KEY,
  evidence_id UUID NOT NULL REFERENCES evidence(id),
  timestamp DATETIME,
  actor VARCHAR(100),
  action VARCHAR(50),
  details TEXT
);

CREATE INDEX idx_engagement_findings ON findings(engagement_id);
CREATE INDEX idx_severity ON findings(severity);
CREATE INDEX idx_status ON findings(status);
```

#### Days 7: Integration Testing & Validation

```typescript
// File: tests/phase1.test.ts
import { RoEValidator } from '../services/RoEValidator';
import { EvidenceManager } from '../services/EvidenceManager';
import { FindingsDatabase } from '../services/FindingsDatabase';
import { ComplianceChecker } from '../services/ComplianceChecker';

describe('Phase 1: Legal & Compliance', () => {
  let roeValidator: RoEValidator;
  let evidenceManager: EvidenceManager;
  let findingsDb: FindingsDatabase;
  let complianceChecker: ComplianceChecker;

  beforeAll(() => {
    findingsDb = new FindingsDatabase(':memory:');
    roeValidator = new RoEValidator(findingsDb);
    evidenceManager = new EvidenceManager();
    complianceChecker = new ComplianceChecker();
  });

  test('RoEValidator prevents out-of-scope testing', async () => {
    await roeValidator.loadRoE('./test-data/roe.json');
    const result = roeValidator.validateScope(['attacker.com']); // Not in scope
    expect(result.valid).toBe(false);
    expect(result.violations).toHaveLength(1);
  });

  test('EvidenceManager maintains chain of custody', async () => {
    const evidence = await evidenceManager.recordEvidence(
      'finding-123',
      Buffer.from('test payload'),
      'text',
      'agent-1'
    );
    
    expect(evidence.id).toBeDefined();
    expect(evidence.chainOfCustody).toHaveLength(1);
    expect(evidence.chainOfCustody[0].action).toBe('created');
  });

  test('FindingsDatabase deduplicates findings', async () => {
    const finding1 = {
      id: 'f1',
      engagementId: 'eng-1',
      targetHost: 'example.com',
      vulnerabilityType: 'SQL Injection',
      severity: 'High' as const,
      cvssScore: 9.0,
      cweIds: ['CWE-89'],
      description: 'SQL injection in login form',
      evidence: {},
      status: 'Open' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      discoveredBy: 'agent-1'
    };

    await findingsDb.storeFinding(finding1);
    const results = await findingsDb.queryFindings({ engagementId: 'eng-1' });
    expect(results).toHaveLength(1);

    // Try to store similar finding - should deduplicate
    const finding2 = { ...finding1, id: 'f2' };
    await findingsDb.storeFinding(finding2);
    const results2 = await findingsDb.queryFindings({ engagementId: 'eng-1' });
    expect(results2).toHaveLength(1); // Still 1, deduped
  });

  test('ComplianceChecker maps findings to CWE/OWASP', () => {
    const cwes = complianceChecker.mapToCWE('SQL Injection vulnerability in login');
    const owasps = complianceChecker.mapToOWASP('Injection attack');
    const cvss = complianceChecker.calculateCVSS('Remote code execution vulnerability', 'web');
    
    expect(cwes).toHaveLength(1);
    expect(cwes[0].id).toBe('CWE-89');
    expect(owasps.length).toBeGreaterThan(0);
    expect(cvss.baseScore).toBeGreaterThan(8.0);
  });
});
```

---

#### Day 8: Documentation & Code Review

- Write API documentation for Phase 1 services
- Conduct code review for legal compliance
- Schedule stakeholder sign-off meeting

---

## Phase 2: OSINT & Reconnaissance (Weeks 3-4)

### Objectives
✅ Enable asset discovery  
✅ Build threat intelligence layer  
✅ Parallel agent execution  
✅ Cache recon results

### Implementation Sketch

```typescript
// File: packages/skills/syncpulse/src/agents/DNSIntelligenceAgent.ts
import { Agent } from '../types/Agent';
import { MemorySystem } from '../services/MemorySystem';

export class DNSIntelligenceAgent implements Agent {
  id = 'dns-intel-' + Math.random().toString(36).substr(2, 9);
  name = 'DNS Intelligence Agent';
  role = 'executor' as const;
  status = 'idle' as const;
  capacity = 10;
  currentLoad = 0;
  successRate = 0.95;
  lastHeartbeat = Date.now();

  constructor(private memory: MemorySystem) {}

  async executeTask(task: any): Promise<any> {
    const domain = task.target;
    
    try {
      // Check cache first
      const cached = await this.memory.get(`dns:${domain}`);
      if (cached) return cached;

      // Enumerate DNS records
      const records = await this.enumerateDNS(domain);
      
      // Cache results
      await this.memory.set(`dns:${domain}`, records, { 
        ttl: 3600000, // 1 hour
        metadata: { agent: this.id, timestamp: Date.now() }
      });

      return records;
    } catch (err) {
      throw new Error(`DNS enumeration failed for ${domain}: ${err}`);
    }
  }

  private async enumerateDNS(domain: string): Promise<any> {
    // Use dns.promises or external DNS library
    return {
      domain,
      aRecords: [],
      mxRecords: [],
      nsRecords: [],
      txtRecords: [],
      timestamp: Date.now()
    };
  }
}
```

### Phase 2 Timeline
- **Week 3, Days 9-12:** Implement DNSIntelligenceAgent, AssetDiscoveryAgent
- **Week 4, Days 13-14:** Implement VulnIntelligenceAgent, ServiceFingerprintingAgent
- **Week 4, Days 15-16:** Integration testing, agent pooling

---

## Phase 3: Testing Orchestration (Weeks 5-6)

### Objectives
✅ Centralized test case management  
✅ Payload generation framework  
✅ RoE enforcement during testing  
✅ Session tracking

### Implementation Sketch

```typescript
// File: packages/skills/syncpulse/src/services/PayloadGenerator.ts
export interface PayloadTemplate {
  name: string;
  category: 'sql-injection' | 'xss' | 'rce' | 'lfi' | 'xxe';
  basePayload: string;
  mutations: PayloadMutation[];
}

export class PayloadGenerator {
  private templates: Map<string, PayloadTemplate> = new Map();

  registerTemplate(template: PayloadTemplate): void {
    this.templates.set(template.name, template);
  }

  generatePayloads(templateName: string, count: number = 10): string[] {
    const template = this.templates.get(templateName);
    if (!template) throw new Error(`Template ${templateName} not found`);

    const payloads: string[] = [];
    for (let i = 0; i < count; i++) {
      payloads.push(this.mutate(template.basePayload, template.mutations));
    }
    return payloads;
  }

  private mutate(base: string, mutations: PayloadMutation[]): string {
    let payload = base;
    for (const mutation of mutations) {
      if (Math.random() > 0.7) { // 30% chance per mutation
        payload = mutation.apply(payload);
      }
    }
    return payload;
  }
}
```

### Phase 3 Timeline
- **Week 5, Days 17-20:** TestCaseManager, PayloadGenerator
- **Week 6, Days 21-22:** RoEEnforcer, ProgressTracker
- **Week 6, Days 23-24:** Integration, agent orchestration

---

## Phase 4: Reporting & Disclosure (Weeks 7-8)

### Objectives
✅ Professional report generation  
✅ PDF/Excel/HTML exports  
✅ Disclosure workflow automation  
✅ Metrics dashboard

### Implementation Sketch

```typescript
// File: packages/skills/syncpulse/src/services/ReportGenerator.ts
export interface ReportConfig {
  engagementId: string;
  format: 'pdf' | 'html' | 'xlsx' | 'json';
  includeEvidence: boolean;
  severityFilter: Finding['severity'][];
}

export class ReportGenerator {
  async generateReport(config: ReportConfig): Promise<Buffer> {
    const findings = await this.queryFindings(config.engagementId, config.severityFilter);
    
    switch (config.format) {
      case 'pdf':
        return await this.generatePDF(findings, config);
      case 'html':
        return this.generateHTML(findings, config);
      case 'xlsx':
        return await this.generateExcel(findings, config);
      default:
        return Buffer.from(JSON.stringify(findings));
    }
  }

  private async generatePDF(findings: Finding[], config: ReportConfig): Promise<Buffer> {
    const html = this.generateHTML(findings, config);
    // Use puppeteer or similar to convert HTML to PDF
    return Buffer.from('PDF content');
  }

  private generateHTML(findings: Finding[], config: ReportConfig): string {
    return `
      <html>
        <head><title>Security Assessment Report</title></head>
        <body>
          <h1>Security Assessment Report</h1>
          <h2>Findings Summary</h2>
          <p>Total Findings: ${findings.length}</p>
          ${findings.map(f => `
            <div class="finding">
              <h3>${f.vulnerabilityType}</h3>
              <p>Severity: ${f.severity}</p>
              <p>Target: ${f.targetHost}</p>
            </div>
          `).join('')}
        </body>
      </html>
    `;
  }
}
```

### Phase 4 Timeline
- **Week 7, Days 25-28:** ReportGenerator, DisclosureManager
- **Week 8, Days 29-30:** MetricsDashboard, export formatters
- **Week 8, Days 31-32:** Full integration, QA testing

---

## Technology Stack

### Core Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "better-sqlite3": "^9.0.0",
    "uuid": "^9.0.0",
    "helmet": "^7.0.0",
    "dotenv": "^16.0.3",
    "pino": "^8.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0",
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0"
  }
}
```

### Database Choice
- **Development:** SQLite (no setup required)
- **Production:** PostgreSQL (for scalability, auditing)

### External APIs (All Free Tier Available)
- NIST NVD (vulnerability database)
- DNS providers (public APIs)
- Certificate Transparency logs
- ExploitDB API

---

## Deployment Checklist

### Pre-Phase 1 Deployment
- [ ] Database schema created (PostgreSQL or SQLite)
- [ ] RoEValidator, EvidenceManager, FindingsDatabase implementations complete
- [ ] ComplianceChecker CWE/OWASP mappings loaded
- [ ] Legal review passed
- [ ] Environment variables configured (.env)
- [ ] Unit tests passing (>80% coverage)
- [ ] Security audit (OWASP Top 10, secrets scanning)

### Pre-Phase 2 Deployment
- [ ] All Phase 1 tests passing
- [ ] OSINT agents implemented and tested
- [ ] Memory system integration verified
- [ ] Cache hit rates >70%
- [ ] Agent load balancing working

### Pre-Phase 3 Deployment
- [ ] Phase 1 & 2 fully integrated
- [ ] Test case templates loaded
- [ ] Payload generator tested
- [ ] RoE enforcement validated
- [ ] End-to-end test execution working

### Pre-Phase 4 Deployment
- [ ] All phases integrated
- [ ] Report generator templates ready
- [ ] Export formatters tested
- [ ] Disclosure workflow defined
- [ ] Metrics collection working

### Pre-Pilot Engagement
- [ ] 100% test coverage for critical paths
- [ ] All CI/CD checks passing
- [ ] Documentation complete
- [ ] Team training done
- [ ] Staging environment fully operational
- [ ] Backup/recovery tested

---

## Risk Mitigation

### Technical Risks
| Risk | Mitigation |
|------|-----------|
| Database schema complexity | Start with SQLite, migrate to Postgres in Phase 3 |
| Evidence integrity bugs | Cryptographic signing + audit trail + regular verification tests |
| Agent coordination failures | Implement health checks, automatic failover |
| Performance regression | Weekly benchmark runs, performance alerts |

### Schedule Risks
| Risk | Mitigation |
|------|-----------|
| Tight 8-week timeline | Freeze scope after Phase 1 approval |
| Phase dependencies | Design all 4 phases in parallel (Week 1) |
| Resource availability | Weekly sprint reviews, escalation path |
| Scope creep | Change control board for any additions |

---

## Success Criteria by Phase

**Phase 1 (Legal & Compliance):**
- ✅ RoEValidator prevents all out-of-scope tests
- ✅ Evidence passes cryptographic integrity checks
- ✅ Findings deduplicate correctly
- ✅ Legal team approves architecture

**Phase 2 (OSINT):**
- ✅ 4 agents fully functional
- ✅ Cache hit rate >70%
- ✅ Agent pooling working across swarms
- ✅ <100ms per query response

**Phase 3 (Testing):**
- ✅ RoE enforcer blocks violations
- ✅ Payload generation >100 variants/second
- ✅ Session tracking 100% accurate
- ✅ Test execution logging complete

**Phase 4 (Reporting):**
- ✅ Reports generate in <5 seconds
- ✅ PDF/Excel/HTML formats working
- ✅ Disclosure workflow tested
- ✅ Dashboard loads <2 seconds

---

## Post-Deployment (Weeks 9+)

- **Week 9:** Pilot engagement with test client
- **Week 10:** Performance tuning + bug fixes
- **Week 11:** Documentation updates + team training
- **Week 12:** Full production deployment + monitoring

**Go-live Target:** Early July 2026
