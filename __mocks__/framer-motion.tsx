import React from 'react';

// Minimal framer-motion mock for jsdom tests
// AnimatePresence renders all children immediately (no exit animations)
export const AnimatePresence = ({ children }: { children?: React.ReactNode }) =>
  React.createElement(React.Fragment, null, children);

// motion.div / motion.span etc. — just render the underlying element
export const motion = new Proxy(
  {},
  {
    get: (_target, tag: string) => {
      const Component = React.forwardRef(
        (
          { children, ...props }: React.HTMLAttributes<HTMLElement> & { [key: string]: unknown },
          ref: React.Ref<HTMLElement>
        ) => {
          // Strip framer-motion-specific props before passing to DOM
          const {
            initial: _i,
            animate: _a,
            exit: _e,
            transition: _t,
            variants: _v,
            whileHover: _wh,
            whileTap: _wt,
            layout: _l,
            layoutId: _lid,
            ...domProps
          } = props as Record<string, unknown>;
          return React.createElement(tag, { ...domProps, ref }, children);
        }
      );
      Component.displayName = `motion.${tag}`;
      return Component;
    },
  }
) as Record<string, React.ComponentType<React.HTMLAttributes<HTMLElement> & { [key: string]: unknown }>>;
