import Toast from 'react-native-toast-message';
import {Budget, Transaction} from '@/types';
import {triggerHapticFeedback} from '@/utils/haptics';

interface BudgetAlert {
  budgetId: string;
  category: string;
  type: 'threshold' | 'overspent';
  currentSpending: number;
  budgetedAmount: number;
  threshold?: number;
}

class BudgetAlertService {
  private alertHistory: Map<string, Date> = new Map();
  private readonly ALERT_COOLDOWN = 30 * 60 * 1000; // 30 minutes

  private shouldShowAlert(budgetId: string, alertType: string): boolean {
    const key = `${budgetId}-${alertType}`;
    const lastAlert = this.alertHistory.get(key);

    if (!lastAlert) {
      return true;
    }

    return Date.now() - lastAlert.getTime() > this.ALERT_COOLDOWN;
  }

  private recordAlert(budgetId: string, alertType: string): void {
    const key = `${budgetId}-${alertType}`;
    this.alertHistory.set(key, new Date());
  }

  checkBudgetAlerts(budgets: Budget[], spendingByCategory: Record<string, number>): BudgetAlert[] {
    const alerts: BudgetAlert[] = [];

    budgets.forEach(budget => {
      const currentSpending = spendingByCategory[budget.category] || 0;
      const progressPercentage = (currentSpending / budget.budgetedAmount) * 100;
      const threshold = budget.alertThreshold || 80;

      // Check for overspent alert
      if (currentSpending > budget.budgetedAmount) {
        if (this.shouldShowAlert(budget.id, 'overspent')) {
          alerts.push({
            budgetId: budget.id,
            category: budget.category,
            type: 'overspent',
            currentSpending,
            budgetedAmount: budget.budgetedAmount,
          });
          this.recordAlert(budget.id, 'overspent');
        }
      }
      // Check for threshold alert
      else if (progressPercentage >= threshold) {
        if (this.shouldShowAlert(budget.id, 'threshold')) {
          alerts.push({
            budgetId: budget.id,
            category: budget.category,
            type: 'threshold',
            currentSpending,
            budgetedAmount: budget.budgetedAmount,
            threshold,
          });
          this.recordAlert(budget.id, 'threshold');
        }
      }
    });

    return alerts;
  }

  showBudgetAlert(alert: BudgetAlert): void {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    };

    triggerHapticFeedback.warning();

    if (alert.type === 'overspent') {
      const overspentAmount = alert.currentSpending - alert.budgetedAmount;
      Toast.show({
        type: 'error',
        text1: `${alert.category} Budget Exceeded`,
        text2: `You've overspent by ${formatCurrency(overspentAmount)}`,
        visibilityTime: 5000,
        topOffset: 60,
      });
    } else if (alert.type === 'threshold') {
      const percentage = Math.round((alert.currentSpending / alert.budgetedAmount) * 100);
      Toast.show({
        type: 'info',
        text1: `${alert.category} Budget Alert`,
        text2: `You've reached ${percentage}% of your budget limit`,
        visibilityTime: 4000,
        topOffset: 60,
      });
    }
  }

  processTransaction(
    transaction: Transaction,
    budgets: Budget[],
    spendingByCategory: Record<string, number>,
  ): void {
    // Only check for expense transactions
    if (transaction.type !== 'expense') {
      return;
    }

    // Find budget for this category
    const budget = budgets.find(b => b.category === transaction.category);
    if (!budget) {
      return;
    }

    // Check if this transaction pushes us over any thresholds
    const alerts = this.checkBudgetAlerts(budgets, spendingByCategory);
    const relevantAlert = alerts.find(alert => alert.budgetId === budget.id);

    if (relevantAlert) {
      // Delay alert slightly to allow state updates
      setTimeout(() => {
        this.showBudgetAlert(relevantAlert);
      }, 500);
    }
  }

  clearAlertHistory(): void {
    this.alertHistory.clear();
  }

  // For testing purposes
  getAlertHistory(): Map<string, Date> {
    return new Map(this.alertHistory);
  }
}

export const budgetAlertService = new BudgetAlertService();
export default budgetAlertService;
