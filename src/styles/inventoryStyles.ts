import { StyleSheet, Platform } from 'react-native';
import { COLORS } from './posStyles';

export const inventoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Stats Card Header
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 4,
  },

  // Search & Add Bar
  toolbar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: COLORS.surface,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    marginLeft: 8,
    paddingVertical: 0,
  },
  addMenuBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    gap: 6,
  },
  addMenuBtnText: {
    color: COLORS.textLight,
    fontWeight: '700',
    fontSize: 13,
  },

  // List of items
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  inventoryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...COLORS.cardShadow,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardMainInfo: {
    flex: 1,
  },
  cardCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // Card Controls Row
  cardControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceSubtle,
  },
  stockControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 3,
  },
  stockBtn: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    minWidth: 32,
    textAlign: 'center',
  },
  actionBtnsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  deleteBtn: {
    backgroundColor: COLORS.dangerLight,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  formGroup: {
    marginBottom: 14,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  formInputMultiline: {
    height: 72,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  categoryChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalCategoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalCategoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  modalCategoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  modalCategoryChipTextActive: {
    color: COLORS.textLight,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  saveBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textLight,
  },
});
