# KinderCare API Architecture & Frontend Setup Guide

## 1. Proxy Configuration (`next.config.js`)

Map all `/api/*` requests to backend to prevent 404 errors.

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://web-test.kindercare.app/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

**Benefits:**
- Client only sees `localhost:3001` - no exposed API URLs
- Prevents 100% of 404 errors from wrong base URL
- Works in both dev and production builds

---

## 2. API Client (`libs/api-client.ts`)

Axios instance with Bearer Token interceptor and detailed error logging.

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Add token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors & log
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config, response } = error;

    // Detailed error logging
    console.group(`[API Error] ${config.method?.toUpperCase()} ${config.url}`);
    console.error('Status:', response?.status);
    console.error('Data:', response?.data);
    console.error('Message:', error.message);
    console.groupEnd();

    // 401: Token expired
    if (response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }

    // 404: Endpoint not found
    if (response?.status === 404) {
      console.warn(`[404] Endpoint not found: ${config.url}`);
      console.warn('Check next.config.js rewrites and backend route');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 3. Usage Example (`hooks/useAuth.ts`)

```typescript
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/libs/api-client';

export const useAuth = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      console.log('[API] GET /auth/me');
      const { data } = await apiClient.get('/auth/me');
      return data.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
```

---

## 4. Smooth Loading States

### Option A: Next.js `loading.tsx`

```tsx
// app/teacher/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
    </div>
  );
}
```

### Option B: Suspense + Skeleton

```tsx
// app/teacher/page.tsx
import { Suspense } from 'react';
import TeacherSkeleton from './TeacherSkeleton';

export default function TeacherPage() {
  return (
    <Suspense fallback={<TeacherSkeleton />}>
      <TeacherContent />
    </Suspense>
  );
}
```

---

## 5. 404 Debug Checklist

| Cause | How to Check |
|-------|--------------|
| Proxy not configured | Check `next.config.js` rewrites |
| Wrong backend URL | Check `config.url` in interceptor |
| Route doesn't exist | Test: `curl localhost:3001/api/auth/me` |
| Token expired | Check `localStorage.token` |

---

## 6. Environment Setup

```env
# .env.local (Frontend)
NEXT_PUBLIC_API_URL=/api
```

---

## 7. File Structure

```
frontend/
├── libs/
│   └── api-client.ts       # Axios instance
├── hooks/
│   └── useAuth.ts          # Auth query hook
├── app/
│   ├── teacher/
│   │   ├── page.tsx
│   │   └── loading.tsx    # Loading state
│   └── layout.tsx
├── next.config.js          # Proxy config
└── .env.local
```

---

## 8. Quick Test Command

```bash
# Test proxy works
curl http://localhost:3001/api/auth/me

# Should return 401 (needs token) not 404
```
