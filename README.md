# Financial Management System - Admin Panel

這是一個財務管理系統的管理後台，用於管理系統中的各項財務數據和用戶信息以及平台的文章。


## 項目結構

- `src/` - 源代碼目錄
  - `pages/` - 頁面組件
    - `management/` - 管理功能頁面
      - `system/` - 系統管理
        - `user/` - 用戶管理
  - `hooks/` - 自定義 hooks
    - `admin/` - 管理員相關 hooks
  - `types/` - TypeScript 類型定義
  - `utils/` - 工具函數

## 主要功能

- 用戶管理（創建、編輯、刪除、查詢）
- 系統配置
- 文章管理（創建、編輯、刪除、查詢）


## 技術棧

- React
- TypeScript
- Ant Design
- dayjs

## 安裝與運行

在启动后端服务后，执行以下命令启动前端服务：

```bash
npm install
npm run dev
```

服务启动后，在浏览器中访问 `http://localhost:3001` 即可查看項目界面。


## 路由配置

### 路由配置
在`src/routes/sections/dashboard`

```ts
import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "@/pages/management/system/dashboard";
import { User } from "@/pages/management/system/user";
import { Article } from "@/pages/management/system/article";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/user",
    element: <User />,
  },
  {
    path: "/article",
    element: <Article />,
  },
]);
```



### 侧边栏选项卡配置

在`/src/layouts/dashboard/nav/nav-data/nav-data-frontend.tsx`配置


```ts
import { NavData } from "@/types";

export const navDataFrontend: NavData[] = [
  {
    title: "儀表板",
    path: "/",
    icon: "dashboard",
  },
  {
    title: "用戶管理",
    path: "/user",
    icon: "user",
  },
  {
    title: "文章管理",
    path: "/article",
    icon: "article",
  },
];
```



## 環境變量

項目使用 `.env.development` 和 `.env.example` 文件來管理環境變量。

## 開發規範

項目遵循以下開發規範：
- Clean Code
- Code Quality
- Git Flow

這些規範可以在 `.cursor/rules/common/` 目錄下找到詳細說明。