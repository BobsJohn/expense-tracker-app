import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from '@/store';

// Typed version of useSelector for better TypeScript support
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;