
# NGO Integration Refactor Plan

## ✅ Completed
- [x] Removed `donor` field from NGO types, mock data, and components
- [x] NGOTransaction type is now clean (no donor)
- [x] NGOFlag type updated
- [x] NGONotification type updated
- [x] Mock data cleaned of donor references

## ⏳ Waiting for You

Need from your backend:
1. **Swagger/OpenAPI URL** or spec file
2. **List of NGO API endpoints** currently available
3. **Example response** for a transaction GET
4. **Database schema** for NGO transactions

Example needed:
```
GET /api/ngo/transactions → returns what fields?
POST /api/ngo/flags → accepts what payload?
GET /api/ngo/audit-flags → returns what structure?
```

## 🎯 Next Steps (Once We Have Backend Info)

### 1. Create NGO API hooks
- `src/hooks/useNGOTransactions.ts` 
- `src/hooks/useNGOFlags.ts`
- `src/hooks/useNGONotifications.ts`

### 2. Update API client
- Add NGO endpoints to `src/utils/api.ts`
- Create request/response types for NGO operations

### 3. Refactor NGO Dashboard
- **Replace**: `NGO_TRANSACTIONS` (mock) → `useNGOTransactions()` (API)
- **Replace**: `NGO_FLAGS` (mock) → `useNGOFlags()` (API)
- **Replace**: `NGO_NOTIFICATIONS` (mock) → `useNGONotifications()` (API)

### 4. Delete mock data (after verified working)
- Delete `src/mock/ngo.mock.ts` 
- Update imports

### 5. RBAC Backend Enforcement
- Ensure backend validates NGO roles
- Backend should return 403 if user lacks permission

## 📋 Checklist for Production-Ready NGO Integration

- [ ] Dashboard loads real transaction data
- [ ] Transactions page shows same data as dashboard
- [ ] Flags are pulled from backend, not hardcoded
- [ ] Backend enforces RBAC (role permissions)
- [ ] Evidence uploads linked to real transactions
- [ ] Notifications real-time from backend
- [ ] Export CSV works with real data
- [ ] Search/filter works on actual backend data
- [ ] No more mock data imports in production

## Current Status: 40% → Target: 100%
