import { StyleSheet, Platform } from 'react-native';

export const COLORS = {
  primary: '#059669', // Emerald 600 - Brand KasirKu
  primaryDark: '#047857',
  primaryLight: '#D1FAE5',
  primaryMuted: '#ECFDF5',
  
  secondary: '#0284C7', // Sky Blue
  secondaryLight: '#E0F2FE',
  
  accent: '#F59E0B', // Amber
  accentLight: '#FEF3C7',
  
  danger: '#EF4444', // Red
  dangerLight: '#FEE2E2',
  
  background: '#F8FAFC', // Slate 50
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  
  border: '#E2E8F0', // Slate 200
  borderDark: '#CBD5E1',
  
  textPrimary: '#0F172A', // Slate 900
  textSecondary: '#475569', // Slate 600
  textMuted: '#94A3B8', // Slate 400
  textLight: '#FFFFFF',
  
  cardShadow: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: {
      elevation: 2,
    },
    default: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
  }),
  
  floatingShadow: Platform.select({
    ios: {
      shadowColor: '#059669',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
    },
    android: {
      elevation: 6,
    },
    default: {
      shadowColor: '#059669',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
    },
  }),
};

export const posStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Header section
  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  badgeOnline: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  
  // Search bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  
  // Categories horizontal list
  categorySection: {
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryListContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  categoryChipTextActive: {
    color: COLORS.textLight,
  },
  
  // Product List
  catalogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  catalogTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  catalogCount: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  productListContent: {
    padding: 16,
    paddingBottom: 110, // Ruang untuk floating cart
  },
  
  // Product Card
  productCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    ...COLORS.cardShadow,
  },
  productIconBox: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productCategoryTag: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  productBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  stockText: {
    fontSize: 11,
    fontWeight: '600',
  },
  
  // Add to cart button
  addButton: {
    backgroundColor: COLORS.primary,
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  
  // Floating Cart Bar
  floatingCartBar: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: COLORS.textPrimary,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...COLORS.floatingShadow,
  },
  floatingCartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatingCartBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginRight: 12,
  },
  floatingCartCount: {
    color: COLORS.textLight,
    fontWeight: '800',
    fontSize: 13,
  },
  floatingCartLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  floatingCartTotal: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '800',
  },
  floatingCartButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  floatingCartButtonText: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: '700',
  },
});
