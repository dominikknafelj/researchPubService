#!/usr/bin/env node

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const buildOptions = {
  entryPoints: [
    'src/handlers/process-publication.ts',
    'src/handlers/get-all-publications.ts',
    'src/handlers/get-publication-by-id.ts'
  ],
  outdir: 'dist',
  bundle: true,
  platform: 'node',
  target: 'es2022',
  format: 'esm',
  sourcemap: true,
  minify: true,
  external: ['@aws-sdk/*'],
  outExtension: {
    '.js': '.mjs'
  },
  banner: {
    js: '// TypeScript compiled Lambda handlers for AWS'
  }
};

async function build() {
  try {
    // Clean dist directory
    if (fs.existsSync('dist')) {
      fs.rmSync('dist', { recursive: true });
    }
    
    console.log('Building TypeScript handlers...');
    
    const result = await esbuild.build(buildOptions);
    
    if (result.errors.length > 0) {
      console.error('Build errors:', result.errors);
      process.exit(1);
    }
    
    if (result.warnings.length > 0) {
      console.warn('Build warnings:', result.warnings);
    }
    
    console.log('✅ TypeScript build completed successfully!');
    console.log('📁 Output directory: dist/');
    console.log('🚀 Ready for deployment with: sam deploy');
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build(); 