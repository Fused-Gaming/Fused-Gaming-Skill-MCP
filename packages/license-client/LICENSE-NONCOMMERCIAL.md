# Fused Gaming Non-Commercial License with Opt-In Telemetry

**Version 1.0** | Effective Date: August 31, 2026

This is a custom license. It is **not** the Apache License 2.0 and is not
compatible with it — it does not grant the broad permissive rights that
name implies, and no package under this license should be SPDX-tagged
`Apache-2.0`. Use `LicenseRef-FusedGaming-NonCommercial-1.0` (or similar)
instead.

## 1. Grant of License

Subject to the terms of this License, Fused Gaming LLC ("Licensor") grants
you ("Licensee") a non-exclusive, non-transferable, revocable license to
use, modify, and distribute the accompanying software, documentation, and
related materials ("Software") solely for non-commercial purposes.

## 2. Permitted Use

You may:
- Use the Software for personal, educational, research, or internal organizational purposes
- Modify the Software for your own non-commercial use
- Create derivative works for non-commercial purposes only
- Distribute unmodified or modified copies to others, provided all recipients accept this License and use it only for non-commercial purposes

## 3. Prohibited Commercial Use

**You may NOT**, without a separate Commercial License Agreement from Licensor:
- Sell, license, or rent the Software or derivative works
- Use it as a component in a commercial product or service
- Provide it as a service (SaaS) or managed service
- Use it to generate revenue, directly or indirectly
- Use it for commercial research, consulting, or professional services

## 4. Telemetry — Opt-In Only

The Software may include an optional usage-telemetry feature. The
following is a description of that feature's actual behavior, not just a
policy statement — the code is built to match it:

### 4.1 Disabled by default

Telemetry ships **off**. No data is collected or transmitted unless you
(or the party operating the Software) explicitly enables it — by calling
the telemetry module's opt-in function or setting an environment variable
documented in the Software's own README. There is no "on by default."

### 4.2 What is collected, if enabled

- An event name and timestamp
- Product name and version, Node.js version, OS platform and architecture
- A random installation identifier generated locally, **not derived from
  any hardware identifier** (no MAC address, disk serial, CPU ID, etc.)

### 4.3 What is never collected

Regardless of whether telemetry is enabled: hardware fingerprints,
IP-derived or any other geolocation data, file system paths, environment
variable contents, source code, or any data reasonably capable of
identifying a specific individual.

### 4.4 Real opt-out

An explicit environment variable (documented in the Software's README)
unconditionally disables telemetry, overriding any other configuration.
Disabling, blocking, or not enabling telemetry is not a breach of this
License and carries no consequence under it.

### 4.5 Data use

Collected data is used solely for aggregate usage analytics (e.g., which
versions are in use). Licensor will not sell this data, will not attempt
to re-identify individuals from it, and will not use it to enforce this
License's non-commercial-use terms — Section 10 governs enforcement
separately and does not rely on telemetry.

## 5. License Enforcement — Not Anti-Research

Licensor may use reasonable technical means to verify a valid commercial
license is held where required (Section 3), such as license-key
validation described in the Software's own documentation. This License
does **not** prohibit inspecting, studying, or reverse-engineering the
Software to understand its behavior, including its license-validation or
telemetry code, and does not restrict good-faith security research.
Circumventing *commercial-use license-key enforcement itself* (Section 3)
without a valid commercial license is a breach of this License; inspecting
how it works, or disabling optional telemetry (Section 4.4), is not.

## 6. Attribution and Copyright

- Retain all copyright and license notices in the Software and derivative works
- Clearly indicate which portions of a derivative work were changed, and by whom
- Do not remove or obscure Licensor's copyright or trademark notices
- Derivative works remain subject to this License

## 7. No Warranty

The Software is provided "AS IS" without warranty of any kind, express or
implied, including warranties of merchantability, fitness for a
particular purpose, or non-infringement.

## 8. Limitation of Liability

To the maximum extent permitted by law, Licensor is not liable for
indirect, incidental, special, consequential, or punitive damages arising
from use of the Software.

## 9. Termination

This License is effective until terminated. Licensor may terminate it if
you breach Section 3 (commercial use without a license) or Section 5
(circumventing commercial license-key enforcement). Sections 3–9 survive
termination. Termination does not retroactively authorize any telemetry
collection that did not actually occur, and does not create any
obligation regarding data that was never collected because telemetry was
off.

## 10. Enforcement

For suspected commercial-use violations, Licensor may request reasonable
evidence of non-commercial use. Licensor does not use telemetry data (see
Section 4.5) as evidence in enforcement, and audit requests must be
proportionate and specific rather than open-ended.

## 11. Governing Law

This License is governed by the laws of the jurisdiction where Licensor is
domiciled, without regard to conflict-of-law principles.

## 12. Entire Agreement

This License is the entire agreement between you and Licensor regarding
the Software. Amendments must be in writing and signed by Licensor.

## 13. Severability

If any provision is found invalid or unenforceable, it is enforced to the
maximum extent possible and the remaining provisions stay in effect.

## 14. Acceptance

Use of the Software constitutes acceptance of this License. If you do not
accept these terms, do not use the Software.

---

Copyright (c) 2026 Fused Gaming LLC. All rights reserved.

**Licensor:** Fused Gaming LLC
**Contact:** info@vln.gg
**Primary Domain:** vln.gg

For commercial licenses or licensing questions: info@vln.gg / https://vln.gg
