import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {selectBudgets, selectSpendingByCategory, selectTransactions} from '@/store/selectors';
import {budgetAlertService} from '@/services/budgetAlertService';

interface BudgetAlertProviderProps {
  children: React.ReactNode;
}

const BudgetAlertProvider: React.FC<BudgetAlertProviderProps> = ({children}) => {
  const budgets = useSelector(selectBudgets);
  const spendingByCategory = useSelector(selectSpendingByCategory);
  const transactions = useSelector(selectTransactions);

  // Monitor spending changes for alerts
  useEffect(() => {
    const alerts = budgetAlertService.checkBudgetAlerts(budgets, spendingByCategory);

    // Only show alerts if there are actual budget overages, not on initial load
    if (transactions.length > 0) {
      alerts.forEach(alert => {
        budgetAlertService.showBudgetAlert(alert);
      });
    }
  }, [spendingByCategory, budgets, transactions.length]);

  return <>{children}</>;
};

export default BudgetAlertProvider;
