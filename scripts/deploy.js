import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

try {
  console.log('📦 Building Geography app...');
  execSync('npm run build', { stdio: 'inherit' });

  const tmpDir = '/tmp/Angsumi.github.io_deploy';
  if (fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  console.log('📥 Cloning Angsumi.github.io...');
  execSync(`gh repo clone Angsumi/Angsumi.github.io ${tmpDir}`, { stdio: 'inherit' });

  const targetDir = path.join(tmpDir, 'learning', 'geography');
  fs.mkdirSync(targetDir, { recursive: true });

  console.log('🧹 Cleaning old deployment...');
  const files = fs.readdirSync(targetDir);
  for (const file of files) {
    fs.rmSync(path.join(targetDir, file), { recursive: true, force: true });
  }

  console.log('📋 Copying dist files...');
  execSync(`cp -r dist/* ${targetDir}/`, { stdio: 'inherit' });

  console.log('🚀 Pushing to GitHub Pages...');
  execSync('git add -A', { cwd: tmpDir, stdio: 'inherit' });
  try {
    execSync('git commit -m "Deploy Geography app to /learning/geography"', { cwd: tmpDir, stdio: 'inherit' });
    execSync('git push origin main', { cwd: tmpDir, stdio: 'inherit' });
    console.log('✅ Deployment successful!');
    console.log('🔗 URL: https://angsumi.github.io/learning/geography');
  } catch {
    console.log('ℹ️ No changes detected to commit.');
  }

  fs.rmSync(tmpDir, { recursive: true, force: true });
} catch (err) {
  console.error('❌ Deployment failed:', err);
  process.exit(1);
}
