import React, { forwardRef } from 'react';

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children:React.ReactNode
}

export const Item = forwardRef<HTMLDivElement, ItemProps>(({children , ...props }, ref) => {

  return <div {...props} ref={ref}>{children}</div>;

});

Item.displayName = 'Item';