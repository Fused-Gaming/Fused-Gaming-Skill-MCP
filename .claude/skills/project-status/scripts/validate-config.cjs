#!/usr/bin/env node

/**
 * Project Status Configuration Validator
 * Validates config.json against the schema
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const schemaPath = path.join(__dirname, '../resources/schemas/config.schema.json');
const configPath = process.argv[2] || 'config.json';

if (!fs.existsSync(configPath)) {
  console.error(`❌ Configuration file not found: ${configPath}`);
  process.exit(1);
}

if (!fs.existsSync(schemaPath)) {
  console.error(`❌ Schema file not found: ${schemaPath}`);
  process.exit(1);
}

try {
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(config)) {
    console.log(`✓ Configuration ${configPath} is valid`);
    console.log(`  Project: ${config.project}`);
    console.log(`  Gates: ${config.gates?.length || 0}`);
    if (config.rfpNumber) {
      console.log(`  RFP: ${config.rfpNumber}`);
    }
    process.exit(0);
  } else {
    console.error('❌ Configuration validation failed:');
    validate.errors.forEach(err => {
      console.error(`  - ${err.instancePath || 'root'}: ${err.message}`);
    });
    process.exit(1);
  }
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
}
