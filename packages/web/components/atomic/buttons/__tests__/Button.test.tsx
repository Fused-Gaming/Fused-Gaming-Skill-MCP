/**
 * @test Button Component
 * @description Unit tests for Button atomic component
 * @coverage Rendering, events, variants, states, accessibility
 */

import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render button element with text content', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
    });

    it('should accept children as content', () => {
      render(
        <Button>
          <span data-testid="icon">Icon</span>
          Button Text
        </Button>
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Button Text');
    });

    it('should render with default variant (primary)', () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600', 'text-white');
    });

    it('should apply variant classes correctly', () => {
      const variants = ['primary', 'secondary', 'tertiary', 'danger'] as const;

      variants.forEach(variant => {
        const { unmount } = render(
          <Button variant={variant}>Test</Button>
        );
        const button = screen.getByRole('button');

        if (variant === 'primary') {
          expect(button).toHaveClass('bg-blue-600');
        } else if (variant === 'secondary') {
          expect(button).toHaveClass('bg-gray-200');
        } else if (variant === 'tertiary') {
          expect(button).toHaveClass('bg-transparent');
        } else if (variant === 'danger') {
          expect(button).toHaveClass('bg-red-600');
        }

        unmount();
      });
    });

    it('should apply size classes correctly', () => {
      const sizes = ['sm', 'md', 'lg'] as const;

      sizes.forEach(size => {
        const { unmount } = render(<Button size={size}>Test</Button>);
        const button = screen.getByRole('button');

        if (size === 'sm') {
          expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
        } else if (size === 'md') {
          expect(button).toHaveClass('px-4', 'py-2', 'text-base');
        } else if (size === 'lg') {
          expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
        }

        unmount();
      });
    });

    it('should apply full width class when fullWidth prop is true', () => {
      render(<Button fullWidth>Full Width</Button>);
      expect(screen.getByRole('button')).toHaveClass('w-full');
    });

    it('should not apply full width class when fullWidth prop is false', () => {
      render(<Button fullWidth={false}>Not Full Width</Button>);
      expect(screen.getByRole('button')).not.toHaveClass('w-full');
    });

    it('should apply custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('should combine all classes correctly', () => {
      render(
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          className="extra-class"
        >
          Combined
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-200', 'px-6', 'py-3', 'w-full', 'extra-class');
    });
  });

  describe('Disabled State', () => {
    it('should render with disabled attribute', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should apply disabled styling', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('should not trigger click handler when disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick} disabled>Disabled</Button>);

      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should maintain disabled styling with other variants', () => {
      render(
        <Button variant="danger" disabled>
          Disabled Danger
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
      expect(button).toBeDisabled();
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when loading prop is true', () => {
      render(<Button loading>Loading</Button>);
      const spinner = screen.getByRole('button').querySelector('span');
      expect(spinner).toBeInTheDocument();
    });

    it('should disable button when loading is true', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should apply disabled styling when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('should show spinner with animation classes', () => {
      const { container } = render(<Button loading>Loading</Button>);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('rounded-full', 'border-2');
    });

    it('should not prevent rendering children with spinner', () => {
      render(
        <Button loading>
          Save
        </Button>
      );
      // The button should still contain the text "Save" in the span with spinner
      expect(screen.getByRole('button')).toHaveTextContent('Save');
    });

    it('should not show spinner when loading is false', () => {
      const { container } = render(<Button loading={false}>Not Loading</Button>);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).not.toBeInTheDocument();
    });

    it('should render multiple loading buttons independently', () => {
      render(
        <>
          <Button loading>Loading 1</Button>
          <Button loading={false}>Not Loading</Button>
          <Button loading>Loading 2</Button>
        </>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
      expect(buttons[0]).toBeDisabled();
      expect(buttons[1]).not.toBeDisabled();
      expect(buttons[2]).toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    it('should call onClick handler when clicked', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Click</Button>);

      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should pass click event to handler', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Click</Button>);

      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should support multiple clicks', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Click</Button>);

      const button = screen.getByRole('button');
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('should be keyboard accessible with Enter key', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Keyboard</Button>);
      const button = screen.getByRole('button');

      button.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalled();
    });

    it('should be keyboard accessible with Space key', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Keyboard</Button>);
      const button = screen.getByRole('button');

      button.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalled();
    });

    it('should maintain focus outline after click', async () => {
      const user = userEvent.setup();

      render(<Button>Focus</Button>);
      const button = screen.getByRole('button');

      await user.click(button);
      // Button should have focus ring class
      expect(button).toHaveClass('focus:ring-2');
    });
  });

  describe('Props Forwarding', () => {
    it('should forward standard HTML button attributes', () => {
      render(
        <Button
          type="submit"
          id="submit-btn"
          data-testid="custom-btn"
        >
          Submit
        </Button>
      );

      const button = screen.getByTestId('custom-btn');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('id', 'submit-btn');
    });

    it('should forward aria attributes', () => {
      render(
        <Button aria-label="Save changes">
          Save
        </Button>
      );

      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Save changes');
    });

    it('should support data attributes', () => {
      render(
        <Button data-analytics="button-click">
          Track
        </Button>
      );

      expect(screen.getByRole('button')).toHaveAttribute('data-analytics', 'button-click');
    });

    it('should support form attributes', () => {
      render(
        <Button
          form="my-form"
          name="action"
          value="submit"
        >
          Submit Form
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('form', 'my-form');
      expect(button).toHaveAttribute('name', 'action');
      expect(button).toHaveAttribute('value', 'submit');
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to button element', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Ref Test</Button>);

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('should allow accessing button methods through ref', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Focus Me</Button>);

      expect(ref.current?.focus).toBeDefined();
      expect(typeof ref.current?.click).toBe('function');
    });

    it('should allow calling focus on ref', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Focus Me</Button>);

      ref.current?.focus();
      expect(ref.current).toHaveFocus();
    });
  });

  describe('Snapshot Tests', () => {
    it('should match primary variant snapshot', () => {
      const { container } = render(
        <Button variant="primary">Primary Button</Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match secondary variant snapshot', () => {
      const { container } = render(
        <Button variant="secondary">Secondary Button</Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match tertiary variant snapshot', () => {
      const { container } = render(
        <Button variant="tertiary">Tertiary Button</Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match danger variant snapshot', () => {
      const { container } = render(
        <Button variant="danger">Danger Button</Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match disabled state snapshot', () => {
      const { container } = render(
        <Button disabled>Disabled Button</Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match loading state snapshot', () => {
      const { container } = render(
        <Button loading>Loading Button</Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match size variants snapshot', () => {
      const { container } = render(
        <div>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      );
      expect(container).toMatchSnapshot();
    });

    it('should match full width snapshot', () => {
      const { container } = render(
        <Button fullWidth>Full Width Button</Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Edge Cases', () => {
    it('should render with empty children', () => {
      render(<Button></Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with null children', () => {
      render(<Button>{null}</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with boolean children', () => {
      render(<Button>{true}</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should handle rapid variant changes', () => {
      const { rerender } = render(<Button variant="primary">Test</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-blue-600');

      rerender(<Button variant="secondary">Test</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-gray-200');

      rerender(<Button variant="danger">Test</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-red-600');
    });

    it('should handle rapid size changes', () => {
      const { rerender } = render(<Button size="sm">Test</Button>);
      expect(screen.getByRole('button')).toHaveClass('text-sm');

      rerender(<Button size="lg">Test</Button>);
      expect(screen.getByRole('button')).toHaveClass('text-lg');
    });

    it('should handle toggling disabled state', () => {
      const { rerender } = render(<Button disabled={false}>Test</Button>);
      expect(screen.getByRole('button')).not.toBeDisabled();

      rerender(<Button disabled={true}>Test</Button>);
      expect(screen.getByRole('button')).toBeDisabled();

      rerender(<Button disabled={false}>Test</Button>);
      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    it('should handle toggling loading state', () => {
      const { rerender } = render(<Button loading={false}>Test</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();

      rerender(<Button loading={true}>Test</Button>);
      expect(button).toBeDisabled();

      rerender(<Button loading={false}>Test</Button>);
      expect(button).not.toBeDisabled();
    });

    it('should render with very long text', () => {
      const longText = 'A'.repeat(100);
      render(<Button>{longText}</Button>);
      expect(screen.getByRole('button')).toHaveTextContent(longText);
    });

    it('should render with special characters', () => {
      render(
        <Button>
          Button &lt;with&gt; special &amp; chars &quot;quoted&quot;
        </Button>
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Type Safety', () => {
    it('should accept all variant types', () => {
      const variants: Array<'primary' | 'secondary' | 'tertiary' | 'danger'> = [
        'primary',
        'secondary',
        'tertiary',
        'danger',
      ];

      variants.forEach(variant => {
        const { unmount } = render(
          <Button variant={variant}>Test {variant}</Button>
        );
        expect(screen.getByRole('button')).toBeInTheDocument();
        unmount();
      });
    });

    it('should accept all size types', () => {
      const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

      sizes.forEach(size => {
        const { unmount } = render(
          <Button size={size}>Test {size}</Button>
        );
        expect(screen.getByRole('button')).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Display Name', () => {
    it('should have correct display name', () => {
      expect(Button.displayName).toBe('Button');
    });
  });
});
