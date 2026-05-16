# SyncPulse Hub v0.1.1 Release Notes

**Release Date:** May 14, 2026  
**Version:** @h4shed/syncpulse-hub v0.1.1  
**Status:** Production Ready

## Overview

SyncPulse Hub v0.1.1 is a maintenance release that updates dependencies to include the latest SyncPulse v0.2.2 performance improvements and stability enhancements.

---

## What's Updated

### Dependency Updates
- **SyncPulse:** Now compatible with v0.2.2 (includes 100-500x vector search speedup)
  - Inherits all v0.2.2 performance improvements
  - LRU cache eviction for 24h+ deployment stability
  - Token bucket rate limiting for cascade failure prevention
  - Work-stealing load balancing for heterogeneous swarms

### No Breaking Changes
- All APIs remain unchanged
- Full backwards compatibility maintained
- Existing configurations continue to work without modification

---

## Benefits of Upgrading

By updating to v0.1.1, you automatically get access to:

✅ **Performance:** 100-500x faster vector search at scale  
✅ **Stability:** OOM prevention with LRU cache eviction  
✅ **Reliability:** Rate limiting and work-stealing load balancing  
✅ **Scalability:** Safe operation up to 100K+ cache entries  

---

## Installation

```bash
npm install @h4shed/syncpulse-hub@0.1.1
```

Or upgrade existing installation:

```bash
npm update @h4shed/syncpulse-hub
```

---

## SyncPulse v0.2.2 Highlights

### Performance Improvements
| Operation | Before | After | Improvement |
|-----------|--------|-------|-------------|
| Vector search (1K entries) | 50ms | <5ms | **10x** |
| Vector search (10K entries) | 500ms | 5-20ms | **50-100x** |
| Vector search (100K entries) | 2-5s | 10-50ms | **100-500x** |
| Cache recovery (10K entries) | 100-500s | 1-5s | **100x** |

### Stability Improvements
- **Memory Management:** Bounded at 100MB (was unbounded, causing OOM)
- **Rate Limiting:** 1000 qps with burst support prevents cascade failures
- **Load Balancing:** 2-4x throughput improvement on heterogeneous swarms

---

## Compatibility

- **Node.js:** >=20.0.0
- **TypeScript:** >=5.0.0 (for development)
- **Dependencies:** Unchanged (maintains compatibility with existing packages)

---

## Migration Notes

No migration steps required. Simply update and restart your applications.

```bash
# Update
npm install @h4shed/syncpulse-hub@0.1.1

# Restart your application
npm start
```

---

## Version Info

- **Package:** @h4shed/syncpulse-hub
- **Previous Version:** 0.1.0
- **Current Version:** 0.1.1
- **License:** Apache-2.0
- **Release Tag:** syncpulse-hub-v0.1.1

---

## Related Releases

- **SyncPulse v0.2.2:** Major performance and stability improvements
- **SyncPulse Hub v0.1.0:** Initial release (May 2026)

---

**SyncPulse Hub v0.1.1 is recommended for all users running SyncPulse-based systems.**

For detailed SyncPulse v0.2.2 improvements, see `RELEASE_NOTES_v0.2.2.md`.
