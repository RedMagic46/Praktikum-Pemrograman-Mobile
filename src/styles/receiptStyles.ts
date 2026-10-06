import { StyleSheet, Platform } from 'react-native';
import { COLORS } from './posStyles';

export const receiptStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },

  // Success indicator badge
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    marginBottom: 20,
    gap: 8,
  },
  successBannerText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },

  // Thermal Paper Container
  receiptPaper: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
    }),
  },

  // Store Header
  storeHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  storeLogoBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  storeTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  storeAddress: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  storeContact: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // Dashed or dotted divider
  dashedLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    borderStyle: 'dashed',
    marginVertical: 14,
  },

  // Meta Info Table
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  metaLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  // Item List
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  itemCalc: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  itemPriceTotal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'right',
  },

  // Calculation summary
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
  },

  // Receipt Footer
  footerSection: {
    alignItems: 'center',
    marginTop: 14,
  },
  barcodeBox: {
    width: '80%',
    height: 36,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  barcodeText: {
    fontSize: 11,
    letterSpacing: 4,
    color: COLORS.textSecondary,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
  },
  thankYouText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
  },

  // Bottom action buttons
  actionGroup: {
    width: '100%',
    marginTop: 24,
    gap: 12,
  },
  newTransactionBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  newTransactionBtnText: {
    color: COLORS.textLight,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryBtnText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
