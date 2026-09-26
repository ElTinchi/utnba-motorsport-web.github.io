import useInView from '../hooks/useInView.js';
import { getStaggerDelay } from '../utils/editorialMotion.js';

function StaggerItem({ as: Element, children, className, delay }) {
  const [ref, visible] = useInView({ threshold: 0.15 });

  return (
    <Element
      ref={ref}
      className={`stagger-item${visible ? ' stagger-item--visible' : ''}${className ? ` ${className}` : ''}`}
      style={{ '--stagger-delay': `${delay}ms` }}
    >
      {children}
    </Element>
  );
}

export default function StaggerList({
  as: ListElement = 'ul',
  itemAs = 'li',
  items,
  renderItem,
  className = '',
  itemClassName = '',
  interval = 80,
  ...props
}) {
  return (
    <ListElement {...props} className={className}>
      {items.map((item, index) => (
        <StaggerItem
          key={item.id ?? item.key ?? index}
          as={itemAs}
          className={itemClassName}
          delay={getStaggerDelay(index, interval)}
        >
          {renderItem(item, index)}
        </StaggerItem>
      ))}
    </ListElement>
  );
}
