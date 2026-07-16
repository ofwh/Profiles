const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const MAX_REDIRECTS = 10;

/**
 * 递归下载文件，自动跟随重定向
 * @param {URL} url - 当前请求的 URL 对象
 * @param {string|null} filename - 用户指定的文件名（可选）
 * @param {number} redirectCount - 当前重定向计数
 */
function download(url, filename, redirectCount = 0) {
  if (redirectCount > MAX_REDIRECTS) {
    console.error('重定向次数超过限制');
    process.exit(1);
  }

  const options = {
    headers: {
      'User-Agent': 'Loon/962 CFNetwork/3860.600.12 Darwin/25.5.0',
    },
  };

  const client = url.protocol === 'https:' ? https : http;

  const req = client.get(url, options, (res) => {
    const status = res.statusCode;

    // 处理重定向状态码
    if (status === 301 || status === 302 || status === 303 || status === 307 || status === 308) {
      const location = res.headers.location;
      if (!location) {
        console.error('重定向响应缺少 Location 头');
        process.exit(1);
      }
      let redirectUrl;
      try {
        // 支持相对路径重定向
        redirectUrl = new URL(location, url);
      } catch (err) {
        console.error('无效的重定向地址:', location);
        process.exit(1);
      }
      // 丢弃当前响应数据，避免内存占用
      res.resume();
      // 递归跟随重定向
      download(redirectUrl, filename, redirectCount + 1);
      return;
    }

    // 非 200 状态视为错误
    if (status !== 200) {
      console.error(`下载失败: ${status} ${res.statusMessage}`);
      process.exit(1);
    }

    // ----- 确定最终文件名 -----
    let finalFilename = filename;
    if (!finalFilename) {
      // 1) 尝试从 Content-Disposition 头解析
      const contentDisposition = res.headers['content-disposition'];
      if (contentDisposition) {
        // 支持 filename="..." 或 filename=...（无引号），以及 RFC 5987 编码
        const match = contentDisposition.match(/filename\*=?([^;]+)/);
        if (match) {
          let raw = match[1].trim();
          // 去除首尾引号
          if (raw.startsWith('"') && raw.endsWith('"')) {
            raw = raw.slice(1, -1);
          }
          // 处理类似 UTF-8''foo.js 的格式，只取实际文件名
          if (raw.includes("''")) {
            const parts = raw.split("''");
            if (parts.length === 2) {
              raw = parts[1];
            }
          }
          finalFilename = raw;
        }
      }

      // 2) 若 header 未提供，则从最终 URL 路径提取
      if (!finalFilename) {
        const base = path.basename(url.pathname);
        if (base && base !== '/' && base !== '.') {
          finalFilename = base;
        } else {
          finalFilename = 'downloaded_file';
        }
      }
    }

    // 确保只取文件名（去除路径），并防止目录穿越
    finalFilename = path.basename(finalFilename);

    const filePath = path.join(process.cwd(), finalFilename);
    const writeStream = fs.createWriteStream(filePath);

    // 将响应流写入文件
    res.pipe(writeStream);

    writeStream.on('finish', () => {
      console.log(`文件已下载至: ${filePath}`);
      writeStream.close();
    });

    writeStream.on('error', (err) => {
      console.error('写入文件失败:', err);
      process.exit(1);
    });
  });

  req.on('error', (err) => {
    console.error('请求失败:', err);
    process.exit(1);
  });

  req.end();
}

// ---------- 命令行入口 ----------
const urlStr = process.argv[2];
let filename = process.argv[3]; // 可选，用户指定文件名

if (!urlStr) {
  console.error('用法: node index.js <URL> [文件名]');
  process.exit(1);
}

let url;
try {
  url = new URL(urlStr);
} catch (err) {
  console.error('无效的 URL:', err.message);
  process.exit(1);
}

// 若用户提供了文件名，只取基名（避免目录穿越）
if (filename) {
  filename = path.basename(filename);
}

download(url, filename);
