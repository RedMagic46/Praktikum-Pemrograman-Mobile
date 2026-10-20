const fs = require('fs');
const path = require('path');
const ts = require('typescript');

// Parse argumen command line
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const createBackup = args.includes('--backup');
const targetArg = args.find((a) => a.startsWith('--target='));
const targetDir = targetArg
  ? path.resolve(process.cwd(), targetArg.split('=')[1])
  : path.resolve(__dirname, '..', 'src');

/**
 * Mencari seluruh file .ts, .tsx, .js, .jsx secara rekursif
 */
function getAllSourceFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    console.error(`Folder target tidak ditemukan: ${dir}`);
    return fileList;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllSourceFiles(fullPath, fileList);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

/**
 * Menghapus komentar dari kode dengan TypeScript Scanner
 * Aman untuk string literal, template literal, dan JSX syntax
 */
function stripComments(code, isJsx = true) {
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    false,
    isJsx ? ts.LanguageVariant.JSX : ts.LanguageVariant.Standard,
    code
  );

  const ranges = [];
  let token = scanner.scan();

  while (token !== ts.SyntaxKind.EndOfFileToken) {
    if (
      token === ts.SyntaxKind.SingleLineCommentTrivia ||
      token === ts.SyntaxKind.MultiLineCommentTrivia
    ) {
      let start = scanner.getTokenPos();
      let end = scanner.getTextPos();

      // Cek apakah komentar berada di dalam kurung kurawal JSX: {/* ... */}
      const before = code.slice(0, start);
      const after = code.slice(end);
      const matchBefore = before.match(/\{[\t ]*$/);
      const matchAfter = after.match(/^[\t ]*\}/);

      if (matchBefore && matchAfter) {
        start -= matchBefore[0].length;
        end += matchAfter[0].length;
      }

      // Cek apakah komentar mengisi seluruh baris
      const lineStart = code.lastIndexOf('\n', start - 1);
      const lineBefore = code.slice(lineStart === -1 ? 0 : lineStart + 1, start);
      const nextNewline = code.indexOf('\n', end);
      const lineAfter = code.slice(end, nextNewline === -1 ? code.length : nextNewline);

      if (/^\s*$/.test(lineBefore) && /^\s*\r?$/.test(lineAfter)) {
        // Hapus satu baris penuh beserta newline
        start = lineStart === -1 ? 0 : lineStart + 1;
        end = nextNewline === -1 ? code.length : nextNewline + 1;
      } else if (/^\s*$/.test(lineAfter)) {
        // Komentar berada di ujung baris kode (trailing comment)
        const trailingSpaceLen = lineBefore.length - lineBefore.trimEnd().length;
        start -= trailingSpaceLen;
      }

      ranges.push({ start, end });
    }
    token = scanner.scan();
  }

  // Hapus range dari belakang agar index posisi tidak bergeser
  ranges.sort((a, b) => b.start - a.start);
  let result = code;
  for (const r of ranges) {
    result = result.slice(0, r.start) + result.slice(r.end);
  }

  // Rapikan baris kosong berturut-turut (maksimal 1 baris kosong)
  result = result.replace(/(\r?\n){3,}/g, '\n\n');

  return {
    cleanedCode: result,
    removedCount: ranges.length,
  };
}

/**
 * Eksekusi utama
 */
function main() {
  console.log('='.repeat(60));
  console.log(`[Script Pembersih Komentar] Target Folder: ${targetDir}`);
  if (isDryRun) {
    console.log('[MODE DRY-RUN] Hanya menampilkan laporan tanpa mengubah file.');
  }
  if (createBackup) {
    console.log('[BACKUP] Membuat file .bak untuk setiap file yang diubah.');
  }
  console.log('='.repeat(60));

  const files = getAllSourceFiles(targetDir);
  let totalComments = 0;
  let totalFilesModified = 0;

  for (const filePath of files) {
    const relativePath = path.relative(path.resolve(__dirname, '..'), filePath);
    const originalCode = fs.readFileSync(filePath, 'utf8');
    const isJsx = filePath.endsWith('.tsx') || filePath.endsWith('.jsx');

    const { cleanedCode, removedCount } = stripComments(originalCode, isJsx);

    if (removedCount > 0) {
      totalComments += removedCount;
      totalFilesModified++;
      console.log(`- [${removedCount} komentar] ${relativePath}`);

      if (!isDryRun) {
        if (createBackup) {
          fs.writeFileSync(`${filePath}.bak`, originalCode, 'utf8');
        }
        fs.writeFileSync(filePath, cleanedCode, 'utf8');
      }
    } else {
      console.log(`- [0 komentar]  ${relativePath} (bersih)`);
    }
  }

  console.log('='.repeat(60));
  console.log(`Selesai!`);
  console.log(`Total file diproses : ${files.length}`);
  console.log(`Total file diubah   : ${totalFilesModified}`);
  console.log(`Total komentar      : ${totalComments}`);
  if (isDryRun) {
    console.log('\nJalankan tanpa `--dry-run` untuk mengeksekusi penghapusan komentar.');
  }
  console.log('='.repeat(60));
}

main();
