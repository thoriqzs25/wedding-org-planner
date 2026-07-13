# PLAN: Wedding Gift Registry

## Overview
Fitur gift registry yang bisa diakses publik via shareable link. Di dalamnya ada 2 bagian:
1. **Admin Page** (`/registry/admin`) - Buat nambah/edit/hapus gift
2. **Public Display Page** (`/registry/[slug]`) - View-only buat tamu

## Database Schema (PostgreSQL)

```sql
-- Gift Registry Table
CREATE TABLE gift_registries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    slug VARCHAR(50) UNIQUE NOT NULL, -- Untuk shareable link
    title VARCHAR(100) NOT NULL DEFAULT 'Wedding Gift Registry',
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gift Items Table
CREATE TABLE gift_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registry_id UUID NOT NULL REFERENCES gift_registries(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    price_min INTEGER, -- Perkiraan range harga minimal
    price_max INTEGER, -- Perkiraan range harga maksimal
    description TEXT,
    reference_url TEXT, -- Link ke marketplace/referensi
    image_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'available' 
        CHECK (status IN ('available', 'claimed', 'purchased')),
    claimed_by VARCHAR(100), -- Nama tamu yang claim
    claimed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_gift_registries_account_id ON gift_registries(account_id);
CREATE INDEX idx_gift_registries_slug ON gift_registries(slug);
CREATE INDEX idx_gift_items_registry_id ON gift_items(registry_id);
CREATE INDEX idx_gift_items_status ON gift_items(status);
```

## Files To Create

### 1. Database Migration
- `prisma/migrations/20250713000000_add_gift_registry/migration.sql`
- Update `prisma/schema.prisma`

### 2. Types
- Update `src/types/index.ts` - tambah `GiftRegistry` dan `GiftItem`

### 3. Mock Data
- Update `src/data/mock.ts` - tambah mock data gift registry

### 4. Components
- `src/components/RegistryFormModal.tsx` - Modal add/edit gift
- `src/components/RegistryPublicView.tsx` - Display component buat publik

### 5. Pages
- `src/app/registry/admin/page.tsx` - Admin management page
- `src/app/registry/[slug]/page.tsx` - Public display page

### 6. Sidebar Update
- Update `src/components/Sidebar.tsx` - tambah menu "Gift Registry"

## Revert/Rollback Plan
1. Hapus semua file yang dibuat
2. Hapus entry di Sidebar
3. Drop database tables (atau restore dari backup)
4. Hapus types dari `src/types/index.ts`

## Implementation Steps
1. Database migration + schema
2. Types + mock data
3. Components (FormModal, PublicView)
4. Admin page
5. Public page
6. Sidebar update
7. Test & verify
