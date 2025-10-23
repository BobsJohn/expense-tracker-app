import {createAction} from '@reduxjs/toolkit';

export interface TransferPayload {
  transferId: string;
  sourceAccountId: string;
  sourceAccountName: string;
  destinationAccountId: string;
  destinationAccountName: string;
  amount: number;
  timestamp: string;
  memo?: string;
}

export const executeTransfer = createAction<TransferPayload>('transfers/executeTransfer');
