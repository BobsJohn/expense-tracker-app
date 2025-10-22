import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {selectBudgets, selectSpendingByCategory} from '@/store/selectors';
import {budgetAlertService} from '@/services/budgetAlertService';

export const useBudgetAlerts = () => {
  const budgets = useSelector(selectBudgets);
  const spendingByCategory = useSelector(selectSpendingByCategory);

  useEffect(() => {
    const alerts = budgetAlertService.checkBudgetAlerts(budgets, spendingByCategory);

    // Show alerts for newly detected issues
    alerts.forEach(alert => {
      budgetAlertService.showBudgetAlert(alert);
    });
  }, [budgets, spendingByCategory]);

  return {
    checkAlerts: () => {
      const alerts = budgetAlertService.checkBudgetAlerts(budgets, spendingByCategory);
      alerts.forEach(alert => {
        budgetAlertService.showBudgetAlert(alert);
      });
      return alerts;
    },
    clearAlertHistory: () => {
      budgetAlertService.clearAlertHistory();
    },
  };
};
