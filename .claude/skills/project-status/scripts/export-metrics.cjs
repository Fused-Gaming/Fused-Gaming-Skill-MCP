#!/usr/bin/env node

/**
 * Metrics Export Utility
 * Exports status metrics to JSON or CSV format
 */

const https = require('https');
const fs = require('fs');

const format = process.argv[2] || 'json';
const endpoint = process.argv[3] || 'http://localhost:3000/status';
const outputFile = `status-export-${Date.now()}.${format === 'csv' ? 'csv' : 'json'}`;

function fetchStatus(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : require('http');
    protocol.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function toCSV(data) {
  const flatData = flattenObject(data);
  const headers = Object.keys(flatData);
  const values = headers.map(h => {
    const val = flatData[h];
    return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
  });

  return `${headers.join(',')}\n${values.join(',')}`;
}

function flattenObject(obj, prefix = '') {
  let result = {};
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      result[prefix ? `${prefix}.${key}` : key] = '';
    } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      Object.assign(result, flattenObject(obj[key], prefix ? `${prefix}.${key}` : key));
    } else if (Array.isArray(obj[key])) {
      result[prefix ? `${prefix}.${key}_count` : `${key}_count`] = obj[key].length;
    } else {
      result[prefix ? `${prefix}.${key}` : key] = obj[key];
    }
  }
  return result;
}

async function main() {
  try {
    console.log(`📊 Exporting metrics to ${format.toUpperCase()}...`);
    const status = await fetchStatus(endpoint);

    const output = format === 'csv' ? toCSV(status) : JSON.stringify(status, null, 2);
    fs.writeFileSync(outputFile, output);

    console.log(`✓ Metrics exported to ${outputFile}`);
    console.log(`  Format: ${format}`);
    console.log(`  Size: ${(output.length / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error(`❌ Export failed: ${error.message}`);
    process.exit(1);
  }
}

main();
