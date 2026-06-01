# Hướng dẫn Deploy NestJS lên Railway

## Yêu cầu

- Node.js >= 18
- npm >= 9
- Git
- Tài khoản [Railway](https://railway.app) (Free Trial hoặc có phí)

---

## Bước 1: Tạo Project NestJS

```bash
# Cài NestJS CLI (nếu chưa có)
npm install -g @nestjs/cli

# Tạo project mới
npx @nestjs/cli new nestjs-railway --package-manager npm --skip-git

cd nestjs-railway
```

**Cấu trúc thư mục sau khi tạo:**

```
nestjs-railway/
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## Bước 2: Cấu hình PORT động

Railway tự động inject biến môi trường `PORT`. Đảm bảo `src/main.ts` dùng biến này:

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000); // ✅ Dùng PORT từ env
}
bootstrap();
```

---

## Bước 3: Thêm file cấu hình Railway

Tạo file `railway.json` tại thư mục gốc:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "healthcheckPath": "/",
    "healthcheckTimeout": 30,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

> **Giải thích:**
>
> - `NIXPACKS`: Railway tự động detect Node.js và build
> - `start:prod`: chạy `node dist/main` (đã build sẵn)
> - `healthcheckPath`: Railway ping `/` để kiểm tra app đã sẵn sàng

---

## Bước 4: Khởi tạo Git Repository

```bash
git init
git add .
git commit -m "feat: initial NestJS project for Railway deployment"
```

---

## Bước 5: Cài đặt Railway CLI

```bash
# macOS (Homebrew)
brew install railway

# Hoặc dùng npm
npm install -g @railway/cli

# Kiểm tra phiên bản
railway --version
```

---

## Bước 6: Đăng nhập Railway CLI

```bash
railway login
```

Lệnh này sẽ mở browser. Đăng nhập bằng tài khoản Railway của bạn (GitHub, Google, hoặc email).

---

## Bước 7: Tạo Project trên Railway và Link

```bash
# Tạo project mới trên Railway và link với thư mục hiện tại
railway init
```

Khi được hỏi:

- **"Create new project"** → Chọn tạo mới
- Đặt tên project: `nestjs-railway`

---

## Bước 8: Deploy lên Railway

```bash
# Deploy (Railway sẽ build và deploy tự động)
railway up
```

Railway sẽ thực hiện:

1. Upload source code
2. Build với Nixpacks (tự detect Node.js)
3. Chạy `npm install` → `npm run build` → `npm run start:prod`
4. Cấp phát URL public

---

## Bước 9: Tạo Public Domain

Sau khi deploy thành công, tạo URL public:

```bash
railway domain
```

Hoặc vào **Railway Dashboard** → chọn Service → **Settings** → **Networking** → **Generate Domain**.

---

## Bước 10: Kiểm tra app đang chạy

```bash
# Xem logs realtime
railway logs

# Mở app trên browser
railway open
```

---

## Biến môi trường (Environment Variables)

Thêm biến môi trường qua CLI:

```bash
railway variables set NODE_ENV=production
railway variables set DATABASE_URL=your_database_url
```

Hoặc vào **Railway Dashboard** → Service → **Variables**.

---

## Cấu trúc Deploy Flow

```
Local Code
    │
    ▼
git commit
    │
    ▼
railway up
    │
    ▼
Railway Cloud
    ├── Nixpacks build
    ├── npm install
    ├── npm run build (nest build)
    └── npm run start:prod (node dist/main)
    │
    ▼
Public URL: https://nestjs-railway-xxxx.up.railway.app
```

---

## Auto-Deploy với GitHub (Khuyến nghị)

Để tự động deploy khi push code:

1. Vào [Railway Dashboard](https://railway.app/dashboard)
2. **New Project** → **Deploy from GitHub repo**
3. Kết nối GitHub account và chọn repository
4. Railway sẽ tự động deploy mỗi khi bạn push lên branch chính

```bash
# Sau khi kết nối GitHub, chỉ cần:
git push origin main
# Railway tự động deploy!
```

---

## Lệnh Railway CLI thường dùng


| Lệnh                | Mô tả                              |
| ------------------- | ---------------------------------- |
| `railway login`     | Đăng nhập                          |
| `railway init`      | Tạo/link project                   |
| `railway up`        | Deploy code                        |
| `railway logs`      | Xem logs realtime                  |
| `railway open`      | Mở app trên browser                |
| `railway domain`    | Tạo/quản lý domain                 |
| `railway variables` | Quản lý env vars                   |
| `railway status`    | Xem trạng thái deployment          |
| `railway run <cmd>` | Chạy lệnh với env vars của Railway |


---

## Xử lý lỗi thường gặp

### Lỗi: Port không đúng

```
Error: listen EADDRINUSE
```

**Giải pháp:** Đảm bảo dùng `process.env.PORT` trong `main.ts`

### Lỗi: Build thất bại

```
Error: Cannot find module 'dist/main'
```

**Giải pháp:** Kiểm tra `package.json` có script `"build": "nest build"`

### Lỗi: Health check thất bại

**Giải pháp:** Kiểm tra `healthcheckPath` trong `railway.json` trỏ đúng route

---

## Tài liệu tham khảo

- [Railway Documentation](https://docs.railway.app)
- [NestJS Documentation](https://docs.nestjs.com)
- [Railway Nixpacks](https://nixpacks.com/docs)

