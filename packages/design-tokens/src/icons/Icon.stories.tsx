/**
 * Icon Stories
 * Storybook stories showcasing all icons with variants and examples
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Icon, IconGrid, IconBox } from './Icon';
import type { IconName, IconColor } from '../types/icons';
import { getAllIconNames, getIconsByCategory } from './registry';

const meta: Meta<typeof Icon> = {
  title: 'Design System/Icons',
  component: Icon,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic icon
export const Basic: Story = {
  args: {
    name: 'home',
    size: 'md',
    color: 'primary',
  },
};

// Size variants
export const SizeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Icon name="settings" size="sm" />
      <Icon name="settings" size="md" />
      <Icon name="settings" size="lg" />
    </div>
  ),
};

// Color variants
export const ColorVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
      <IconBox icon={<Icon name="home" color="primary" />} label="Primary" />
      <IconBox icon={<Icon name="home" color="secondary" />} label="Secondary" />
      <IconBox icon={<Icon name="home" color="success" />} label="Success" />
      <IconBox icon={<Icon name="home" color="warning" />} label="Warning" />
      <IconBox icon={<Icon name="home" color="danger" />} label="Danger" />
      <IconBox icon={<Icon name="home" color="neutral" />} label="Neutral" />
    </div>
  ),
};

// Navigation icons
export const NavigationIcons: Story = {
  render: () => {
    const icons = getIconsByCategory('navigation') as { name: IconName }[];
    return (
      <IconGrid columns={5}>
        {icons.map((icon) => (
          <IconBox
            key={icon.name}
            icon={<Icon name={icon.name} size="lg" color="primary" />}
            label={icon.name}
          />
        ))}
      </IconGrid>
    );
  },
};

// Status icons
export const StatusIcons: Story = {
  render: () => {
    const statusMap: Record<string, IconColor> = {
      active: 'success',
      inactive: 'neutral',
      pending: 'primary',
      error: 'danger',
      warning: 'warning',
      success: 'success',
    };
    const icons = getIconsByCategory('status') as { name: IconName }[];
    return (
      <IconGrid columns={6}>
        {icons.map((icon) => (
          <IconBox
            key={icon.name}
            icon={<Icon name={icon.name} size="lg" color={statusMap[icon.name] || 'primary'} />}
            label={icon.name}
          />
        ))}
      </IconGrid>
    );
  },
};

// Action icons
export const ActionIcons: Story = {
  render: () => {
    const icons = getIconsByCategory('action') as { name: IconName }[];
    return (
      <IconGrid columns={7}>
        {icons.map((icon) => (
          <IconBox
            key={icon.name}
            icon={<Icon name={icon.name} size="lg" color="primary" />}
            label={icon.name}
          />
        ))}
      </IconGrid>
    );
  },
};

// Agent icons
export const AgentIcons: Story = {
  render: () => {
    const agentColors: Record<string, IconColor> = {
      orchestrator: 'primary',
      sentinel: 'warning',
      analyst: 'secondary',
      executor: 'success',
    };
    const icons = getIconsByCategory('agent') as { name: IconName }[];
    return (
      <IconGrid columns={4}>
        {icons.map((icon) => (
          <IconBox
            key={icon.name}
            icon={<Icon name={icon.name} size="lg" color={agentColors[icon.name] || 'primary'} />}
            label={icon.name}
            description="Swarm agent"
          />
        ))}
      </IconGrid>
    );
  },
};

// Utility icons
export const UtilityIcons: Story = {
  render: () => {
    const icons = getIconsByCategory('utility') as { name: IconName }[];
    return (
      <IconGrid columns={2}>
        {icons.map((icon) => (
          <IconBox
            key={icon.name}
            icon={<Icon name={icon.name} size="lg" color="primary" />}
            label={icon.name}
          />
        ))}
      </IconGrid>
    );
  },
};

// All icons
export const AllIcons: Story = {
  render: () => {
    const allIcons = getAllIconNames();
    return (
      <div>
        <h2>All {allIcons.length} Icons</h2>
        <IconGrid columns={6}>
          {allIcons.map((name) => (
            <IconBox
              key={name}
              icon={<Icon name={name} size="md" color="primary" />}
              label={name}
            />
          ))}
        </IconGrid>
      </div>
    );
  },
};

// Real-world usage: Navigation bar
export const NavigationBar: Story = {
  render: () => (
    <nav
      style={{
        display: 'flex',
        gap: '2rem',
        padding: '1rem',
        borderBottom: '1px solid #e5e7eb',
        alignItems: 'center',
      }}
    >
      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Home">
        <Icon name="home" size="md" color="primary" />
      </button>
      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Dashboard">
        <Icon name="dashboard" size="md" color="primary" />
      </button>
      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Settings">
        <Icon name="settings" size="md" color="primary" />
      </button>
      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Help">
        <Icon name="help" size="md" color="primary" />
      </button>
      <div style={{ marginLeft: 'auto' }} />
      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Notifications">
        <Icon name="bell" size="md" color="primary" />
      </button>
      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} aria-label="User menu">
        <Icon name="user" size="md" color="primary" />
      </button>
    </nav>
  ),
};

// Real-world usage: Status indicators
export const StatusIndicators: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Icon name="active" color="success" />
        <span>System Online</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Icon name="warning" color="warning" />
        <span>Low Memory Warning</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Icon name="error" color="danger" />
        <span>Connection Error</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Icon name="pending" color="primary" />
        <span>Processing...</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Icon name="success" color="success" />
        <span>Operation Complete</span>
      </div>
    </div>
  ),
};

// Real-world usage: Swarm agents dashboard
export const SwarmAgentsDashboard: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', maxWidth: '600px' }}>
      <div
        style={{
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          <Icon name="orchestrator" size="lg" color="primary" />
        </div>
        <h3 style={{ margin: '0.5rem 0' }}>Orchestrator</h3>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Workflow Manager</p>
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Icon name="active" color="success" />
          <span style={{ fontSize: '0.875rem' }}>Active</span>
        </div>
      </div>

      <div
        style={{
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          <Icon name="sentinel" size="lg" color="warning" />
        </div>
        <h3 style={{ margin: '0.5rem 0' }}>Sentinel</h3>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Monitor & Guard</p>
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Icon name="active" color="success" />
          <span style={{ fontSize: '0.875rem' }}>Active</span>
        </div>
      </div>

      <div
        style={{
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          <Icon name="analyst" size="lg" color="secondary" />
        </div>
        <h3 style={{ margin: '0.5rem 0' }}>Analyst</h3>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Data Processor</p>
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Icon name="pending" color="primary" />
          <span style={{ fontSize: '0.875rem' }}>Processing</span>
        </div>
      </div>

      <div
        style={{
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          <Icon name="executor" size="lg" color="success" />
        </div>
        <h3 style={{ margin: '0.5rem 0' }}>Executor</h3>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Task Worker</p>
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Icon name="active" color="success" />
          <span style={{ fontSize: '0.875rem' }}>Active</span>
        </div>
      </div>
    </div>
  ),
};

// Real-world usage: Action buttons
export const ActionButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', maxWidth: '600px' }}>
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          background: 'white',
        }}
        aria-label="Play"
      >
        <Icon name="play" size="sm" />
        <span>Play</span>
      </button>

      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          background: 'white',
        }}
        aria-label="Pause"
      >
        <Icon name="pause" size="sm" />
        <span>Pause</span>
      </button>

      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          background: 'white',
        }}
        aria-label="Stop"
      >
        <Icon name="stop" size="sm" />
        <span>Stop</span>
      </button>

      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          background: 'white',
        }}
        aria-label="Retry"
      >
        <Icon name="retry" size="sm" />
        <span>Retry</span>
      </button>

      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          background: 'white',
        }}
        aria-label="Edit"
      >
        <Icon name="edit" size="sm" />
        <span>Edit</span>
      </button>

      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          border: '1px solid #fee2e2',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          background: '#fef2f2',
        }}
        aria-label="Delete"
      >
        <Icon name="delete" size="sm" color="danger" />
        <span style={{ color: '#dc2626' }}>Delete</span>
      </button>
    </div>
  ),
};
