import React, { useMemo } from 'react';
import { FlatList, FlatListProps, Dimensions } from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

interface VirtualizedListProps<T> extends Omit<FlatListProps<T>, 'getItemLayout'> {
  data: T[];
  itemHeight?: number;
  estimatedItemSize?: number;
}

const VirtualizedList = <T,>({
  data,
  itemHeight,
  estimatedItemSize = 60,
  ...props
}: VirtualizedListProps<T>) => {
  const getItemLayout = useMemo(() => {
    if (!itemHeight) return undefined;
    
    return (data: T[] | null | undefined, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    });
  }, [itemHeight]);

  const initialNumToRender = useMemo(() => {
    const itemSize = itemHeight || estimatedItemSize;
    return Math.ceil(screenHeight / itemSize) + 2;
  }, [itemHeight, estimatedItemSize]);

  const maxToRenderPerBatch = useMemo(() => {
    return Math.max(5, Math.floor(initialNumToRender / 2));
  }, [initialNumToRender]);

  return (
    <FlatList
      {...props}
      data={data}
      getItemLayout={getItemLayout}
      initialNumToRender={initialNumToRender}
      maxToRenderPerBatch={maxToRenderPerBatch}
      windowSize={10}
      removeClippedSubviews={true}
      updateCellsBatchingPeriod={50}
      keyExtractor={props.keyExtractor || ((item, index) => index.toString())}
    />
  );
};

export default VirtualizedList;