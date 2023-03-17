import React from 'react';
import classNames from 'classnames';

interface FlexProps {
  direction?: 'row' | 'col';
  justifyContent?: 'start' | 'end' | 'center' | 'between' | 'around';
  alignItems?: 'start' | 'end' | 'center' | 'stretch';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: string;
  classes?: string; 
  children?: React.ReactNode;
}

const Flex: React.FC<FlexProps> = (props: FlexProps) => {
  const { children, direction = 'row', justifyContent, alignItems, wrap, gap = '0', classes } = props;
  return (
    <div 
      className={classNames(
      `w-full flex flex-${direction}`,
      justifyContent? `justify-${justifyContent}`: '',
      alignItems ? `items-${alignItems}`: '',
      wrap ? `flex-${wrap}`: '',
      direction === 'col'? `space-y-${gap}`: `gap-${gap}`,
      classes
      )}
    >
      {children}
    </div>
  );
};

Flex.defaultProps = {

};

Flex.propTypes = {

};

export default Flex;
