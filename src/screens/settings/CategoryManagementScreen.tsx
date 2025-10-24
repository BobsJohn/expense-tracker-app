import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

import Button from '@/components/ui/Button';
import {useAppSelector} from '@/hooks/useAppSelector';
import {
  selectCategories,
  selectCategoriesByType,
  selectTransactions,
} from '@/store/selectors';
import {
  addCategory,
  updateCategory as updateCategoryAction,
  deleteCategory as deleteCategoryAction,
  CategoryInput,
} from '@/store/slices/categoriesSlice';
import {AppDispatch} from '@/store';
import {Category, CategoryType} from '@/types';
import {triggerHapticFeedback} from '@/utils/haptics';

const CATEGORY_TYPES: CategoryType[] = ['expense', 'income'];

const COLOR_PALETTE = [
  '#FF6B6B',
  '#FFA502',
  '#1E90FF',
  '#34C759',
  '#A29BFE',
  '#FF9F1A',
  '#2ED573',
  '#FF4757',
  '#3742FA',
  '#70A1FF',
  '#FF7F50',
  '#B71540',
];

const ICON_OPTIONS = [
  'silverware-fork-knife',
  'food-apple',
  'coffee',
  'cart',
  'shopping',
  'basket',
  'car',
  'gas-station',
  'bus',
  'home-city',
  'lightning-bolt',
  'water',
  'heart-pulse',
  'stethoscope',
  'briefcase',
  'chart-line',
  'cash-multiple',
  'cash-refund',
  'gift',
  'hand-heart',
  'bank',
  'ticket-confirmation',
  'music-note',
  'movie-open',
  'gamepad-variant',
  'camera',
  'piggy-bank',
  'wallet',
  'home-currency-usd',
  'leaf',
];

const getTypeLabel = (type: CategoryType, translate: (key: string, defaultStr?: string) => string) =>
  type === 'income' ? translate('transactions.income') : translate('transactions.expense');

const CategoryManagementScreen: React.FC = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const categoriesByType = useAppSelector(selectCategoriesByType);
  const allCategories = useAppSelector(selectCategories);
  const transactions = useAppSelector(selectTransactions);

  const [selectedType, setSelectedType] = useState<CategoryType>('expense');
  const [isFormVisible, setFormVisible] = useState(false);
  const [isReassignVisible, setReassignVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [pendingDeleteCategory, setPendingDeleteCategory] = useState<Category | null>(null);
  const [selectedReassignmentId, setSelectedReassignmentId] = useState<string | null>(null);

  const [formValues, setFormValues] = useState<CategoryInput>({
    name: '',
    icon: ICON_OPTIONS[0],
    color: COLOR_PALETTE[0],
    type: 'expense',
  });

  const currentCategories = categoriesByType[selectedType] || [];

  const availableReassignmentTargets = useMemo(() => {
    if (!pendingDeleteCategory) {
      return [];
    }

    return allCategories.filter(
      category =>
        category.type === pendingDeleteCategory.type && category.id !== pendingDeleteCategory.id,
    );
  }, [allCategories, pendingDeleteCategory]);

  const resetForm = (type: CategoryType = selectedType) => {
    setFormValues({
      name: '',
      icon: ICON_OPTIONS[0],
      color: COLOR_PALETTE[0],
      type,
    });
    setEditingCategory(null);
  };

  const handleSelectType = (type: CategoryType) => {
    setSelectedType(type);
    triggerHapticFeedback.selection();
  };

  const openCreateModal = () => {
    resetForm(selectedType);
    setFormVisible(true);
    triggerHapticFeedback.selection();
  };

  const openEditModal = (category: Category) => {
    if (category.isDefault) {
      Alert.alert(t('categoryManagement.deleteTitle'), t('categoryManagement.lockedMessage'));
      return;
    }

    setEditingCategory(category);
    setFormValues({
      name: category.name,
      icon: category.icon,
      color: category.color,
      type: category.type,
    });
    setFormVisible(true);
    triggerHapticFeedback.selection();
  };

  const closeFormModal = () => {
    setFormVisible(false);
    resetForm(selectedType);
  };

  const validateForm = () => {
    const trimmedName = formValues.name.trim();

    if (!trimmedName.length) {
      Alert.alert(t('errors.validation'), t('categoryManagement.nameRequired'));
      return false;
    }

    if (!formValues.icon) {
      Alert.alert(t('errors.validation'), t('categoryManagement.iconRequired'));
      return false;
    }

    if (!formValues.color) {
      Alert.alert(t('errors.validation'), t('categoryManagement.colorRequired'));
      return false;
    }

    const duplicate = allCategories.some(category => {
      if (editingCategory && category.id === editingCategory.id) {
        return false;
      }

      return (
        category.type === formValues.type &&
        category.name.toLowerCase() === trimmedName.toLowerCase()
      );
    });

    if (duplicate) {
      Alert.alert(t('errors.validation'), t('categoryManagement.duplicateError'));
      return false;
    }

    return true;
  };

  const handleSaveCategory = () => {
    if (!validateForm()) {
      return;
    }

    const trimmedName = formValues.name.trim();
    const payload: CategoryInput = {...formValues, name: trimmedName};

    if (editingCategory) {
      dispatch(
        updateCategoryAction({
          id: editingCategory.id,
          updates: payload,
          previous: editingCategory,
        }),
      );
      Toast.show({
        type: 'success',
        text1: t('success.categoryUpdated'),
      });
    } else {
      dispatch(addCategory(payload));
      Toast.show({
        type: 'success',
        text1: t('success.categoryCreated'),
      });
    }

    triggerHapticFeedback.success();
    setSelectedType(payload.type);
    closeFormModal();
  };

  const getLinkedTransactionCount = (category: Category) =>
    transactions.filter(
      transaction =>
        transaction.category === category.name && transaction.type === category.type,
    ).length;

  const openReassignModal = (category: Category) => {
    const options = allCategories.filter(
      candidate => candidate.type === category.type && candidate.id !== category.id,
    );

    if (!options.length) {
      Alert.alert(t('categoryManagement.reassignTitle'), t('categoryManagement.reassignUnavailable'));
      return;
    }

    setPendingDeleteCategory(category);
    setSelectedReassignmentId(options[0].id);
    setReassignVisible(true);
  };

  const handleDeleteCategory = (category: Category) => {
    if (category.isDefault) {
      Alert.alert(t('categoryManagement.deleteTitle'), t('categoryManagement.lockedMessage'));
      return;
    }

    const linkedTransactions = getLinkedTransactionCount(category);

    if (linkedTransactions > 0) {
      openReassignModal(category);
      return;
    }

    Alert.alert(t('categoryManagement.deleteTitle'), t('categoryManagement.deleteMessage', {name: category.name}), [
      {text: t('common.cancel'), style: 'cancel'},
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          dispatch(deleteCategoryAction({id: category.id, category}));
          Toast.show({type: 'success', text1: t('success.categoryDeleted')});
          triggerHapticFeedback.success();
        },
      },
    ]);
  };

  const closeReassignModal = () => {
    setReassignVisible(false);
    setPendingDeleteCategory(null);
    setSelectedReassignmentId(null);
  };

  const handleConfirmReassign = () => {
    if (!pendingDeleteCategory || !selectedReassignmentId) {
      return;
    }

    const reassignment = allCategories.find(category => category.id === selectedReassignmentId);

    dispatch(
      deleteCategoryAction({
        id: pendingDeleteCategory.id,
        category: pendingDeleteCategory,
        reassignmentCategory: reassignment,
      }),
    );

    Toast.show({type: 'success', text1: t('success.categoryDeleted')});
    triggerHapticFeedback.success();
    setSelectedType(pendingDeleteCategory.type);
    closeReassignModal();
  };

  const renderCategoryCard = (category: Category) => (
    <View key={category.id} style={styles.categoryCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconWrapper, {backgroundColor: category.color}]}> 
          <MaterialCommunityIcons name={category.icon} size={24} color="#FFFFFF" />
        </View>
        <View style={styles.cardTitleWrapper}>
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.categoryTypeLabel}>{getTypeLabel(category.type, t)}</Text>
        </View>
      </View>
      {category.isDefault ? (
        <View style={styles.defaultBadge}>
          <Text style={styles.defaultBadgeText}>{t('categoryManagement.defaultBadge')}</Text>
        </View>
      ) : (
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openEditModal(category)}
            accessibilityRole="button"
            accessibilityLabel={t('common.edit')}>
            <MaterialCommunityIcons name="pencil" size={18} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteCategory(category)}
            accessibilityRole="button"
            accessibilityLabel={t('common.delete')}>
            <MaterialCommunityIcons name="trash-can" size={18} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>{t('categoryManagement.description')}</Text>

        <View style={styles.segmentedControl}>
          {CATEGORY_TYPES.map(type => {
            const isActive = selectedType === type;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.segmentButton, isActive && styles.segmentButtonActive]}
                onPress={() => handleSelectType(type)}
                disabled={isActive}
                accessibilityRole="button"
                accessibilityState={{selected: isActive}}>
                <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                  {getTypeLabel(type, t)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t('categoryManagement.sectionTitle', {
              type: getTypeLabel(selectedType, t),
            })}
          </Text>
          <Button title={t('categoryManagement.addCategory')} size="small" onPress={openCreateModal} />
        </View>

        {currentCategories.length ? (
          <View style={styles.categoryGrid}>{currentCategories.map(renderCategoryCard)}</View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="folder-open" size={36} color="#CBD5F5" />
            <Text style={styles.emptyTitle}>{t('categoryManagement.noCategories')}</Text>
            <Text style={styles.emptySubtitle}>{t('categoryManagement.emptyStateDescription')}</Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={isFormVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeFormModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeFormModal} style={styles.modalCancelButton}>
              <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingCategory ? t('categoryManagement.editCategory') : t('categoryManagement.addCategory')}
            </Text>
            <View style={styles.modalHeaderSpacer} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('categoryManagement.nameLabel')}</Text>
              <TextInput
                value={formValues.name}
                onChangeText={value => setFormValues(prev => ({...prev, name: value}))}
                placeholder={t('categoryManagement.namePlaceholder')}
                style={styles.textInput}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('categoryManagement.typeLabel')}</Text>
              <View style={styles.typeSelector}>
                {CATEGORY_TYPES.map(type => {
                  const isActive = formValues.type === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[styles.typeOption, isActive && styles.typeOptionActive]}
                      onPress={() => {
                        triggerHapticFeedback.selection();
                        setFormValues(prev => ({...prev, type}));
                      }}
                      accessibilityRole="button"
                      accessibilityState={{selected: isActive}}>
                      <Text
                        style={[styles.typeOptionText, isActive && styles.typeOptionTextActive]}>
                        {getTypeLabel(type, t)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('categoryManagement.colorLabel')}</Text>
              <View style={styles.colorGrid}>
                {COLOR_PALETTE.map(color => {
                  const isActive = formValues.color === color;
                  return (
                    <TouchableOpacity
                      key={color}
                      style={[styles.colorSwatch, {backgroundColor: color}, isActive && styles.colorSwatchActive]}
                      onPress={() => {
                        triggerHapticFeedback.selection();
                        setFormValues(prev => ({...prev, color}));
                      }}
                      accessibilityRole="button"
                      accessibilityState={{selected: isActive}}
                    />
                  );
                })}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('categoryManagement.iconLabel')}</Text>
              <View style={styles.iconGrid}>
                {ICON_OPTIONS.map(iconName => {
                  const isActive = formValues.icon === iconName;
                  return (
                    <TouchableOpacity
                      key={iconName}
                      style={[styles.iconOption, isActive && styles.iconOptionActive]}
                      onPress={() => {
                        triggerHapticFeedback.selection();
                        setFormValues(prev => ({...prev, icon: iconName}));
                      }}
                      accessibilityRole="button"
                      accessibilityState={{selected: isActive}}>
                      <MaterialCommunityIcons
                        name={iconName}
                        size={22}
                        color={isActive ? '#007AFF' : '#4A4A4A'}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title={editingCategory ? t('common.save') : t('categoryManagement.createCategory')}
              onPress={handleSaveCategory}
              disabled={!formValues.name.trim()}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={isReassignVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeReassignModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeReassignModal} style={styles.modalCancelButton}>
              <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{t('categoryManagement.reassignTitle')}</Text>
            <View style={styles.modalHeaderSpacer} />
          </View>

          <View style={styles.reassignContent}>
            <Text style={styles.modalSubtitle}>
              {t('categoryManagement.reassignDescription', {
                name: pendingDeleteCategory?.name || '',
              })}
            </Text>

            {availableReassignmentTargets.length ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                {availableReassignmentTargets.map(category => {
                  const isActive = selectedReassignmentId === category.id;
                  return (
                    <TouchableOpacity
                      key={category.id}
                      style={[styles.reassignOption, isActive && styles.reassignOptionActive]}
                      onPress={() => {
                        triggerHapticFeedback.selection();
                        setSelectedReassignmentId(category.id);
                      }}
                      accessibilityRole="button"
                      accessibilityState={{selected: isActive}}>
                      <View style={[styles.reassignIconWrapper, {backgroundColor: category.color}]}> 
                        <MaterialCommunityIcons name={category.icon} size={20} color="#FFF" />
                      </View>
                      <View style={styles.reassignTextWrapper}>
                        <Text style={styles.reassignTitle}>{category.name}</Text>
                        <Text style={styles.reassignSubtitle}>{getTypeLabel(category.type, t)}</Text>
                      </View>
                      {isActive && (
                        <MaterialCommunityIcons name="check-circle" size={20} color="#007AFF" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            ) : (
              <View style={styles.emptyReassignState}>
                <Text style={styles.emptyReassignText}>{t('categoryManagement.reassignUnavailable')}</Text>
              </View>
            )}
          </View>

          <View style={styles.modalFooterRow}>
            <Button
              title={t('common.cancel')}
              variant="secondary"
              onPress={closeReassignModal}
              style={styles.modalFooterButton}
            />
            <Button
              title={t('categoryManagement.reassignConfirm')}
              onPress={handleConfirmReassign}
              disabled={!selectedReassignmentId}
              style={styles.modalFooterButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  segmentTextActive: {
    color: '#007AFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitleWrapper: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  categoryTypeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  defaultBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4C51BF',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  modalCancelButton: {
    padding: 4,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  modalHeaderSpacer: {
    width: 60,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  typeOptionActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  typeOptionTextActive: {
    color: '#FFFFFF',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorSwatch: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSwatchActive: {
    borderColor: '#007AFF',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  iconOption: {
    width: '23%',
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  iconOptionActive: {
    backgroundColor: '#E5F0FF',
    borderColor: '#007AFF',
  },
  modalFooter: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 16,
  },
  reassignContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  reassignOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    padding: 12,
    marginBottom: 12,
  },
  reassignOptionActive: {
    borderColor: '#007AFF',
    backgroundColor: '#E5F0FF',
  },
  reassignIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reassignTextWrapper: {
    flex: 1,
  },
  reassignTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  reassignSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  emptyReassignState: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyReassignText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  modalFooterRow: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
    gap: 12,
  },
  modalFooterButton: {
    flex: 1,
  },
});

export default CategoryManagementScreen;
