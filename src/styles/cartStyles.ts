import { StyleSheet, Platform } from 'react-native';
import { COLORS } from './posStyles';

export const cartStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Header Info
  headerSummary: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerSummaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  clearCartText: {
    fontSize: 13,
    color: COLORS.danger,
    fontWeight: '600',
  },

  // Item List
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  cartItemCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    ...COLORS.cardShadow,
  },
  itemIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  itemPrice: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2,
  },
  
  // Quantity controls
  qtyControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 3,
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginHorizontal: 10,
    minWidth: 18,
    textAlign: 'center',
  },

  // Checkout Section
  checkoutContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
    }),
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Payment Method Chips
  paymentMethodRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  paymentChip: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  paymentChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryMuted,
  },
  paymentChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  paymentChipTextActive: {
    color: COLORS.primaryDark,
  },

  // Quick Cash Chips
  quickCashRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  quickCashChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  quickCashText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },

  // Cash Input Box
  cashInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
  },
  currencyPrefix: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginRight: 6,
  },
  cashInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  // Bill breakdown
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  billLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  billValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.primary,
  },
  changeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 16,
  },
  changeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  changeValue: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.secondary,
  },

  // Submit button
  payButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  payButtonDisabled: {
    backgroundColor: COLORS.borderDark,
  },
  payButtonText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
});
