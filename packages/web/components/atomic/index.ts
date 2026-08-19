/**
 * Atomic Components Library
 *
 * This directory contains all atomic React components used throughout the Fused Gaming
 * MCP application. Components are organized by category following atomic design principles.
 *
 * ## Categories
 *
 * - **Buttons**: Primary interactive elements (Button, IconButton, ButtonGroup, FAB)
 * - **Inputs**: Form input controls (Input, TextArea, Checkbox, Radio, Select)
 * - **Cards**: Container components (Card, CardHeader, CardFooter)
 * - **Layouts**: Layout primitives (Container, Grid, Flex)
 * - **Typography**: Text components (Heading, Paragraph, Label, Caption)
 * - **Forms**: Form utilities (Form, FormField)
 * - **Feedback**: User feedback (Alert, Badge, Chip)
 * - **Navigation**: Navigation components (Tabs, Breadcrumb)
 * - **Data Display**: Data visualization (Table, List)
 * - **Surfaces**: Overlay surfaces (Dialog, Drawer)
 * - **Utils**: Utility components (Loader)
 *
 * ## Usage
 *
 * ```tsx
 * import { Button, Input, Card } from '@/components/atomic';
 *
 * export function MyComponent() {
 *   return (
 *     <Card>
 *       <Input placeholder="Enter text" />
 *       <Button>Submit</Button>
 *     </Card>
 *   );
 * }
 * ```
 *
 * ## Guidelines
 *
 * - All components should accept ref forwarding
 * - Use TypeScript strict mode for all component definitions
 * - Provide comprehensive prop documentation
 * - Include JSDoc examples for each component
 * - Maintain 80%+ test coverage
 * - Follow atomic design principles
 */

// Buttons
export * from './buttons';

// Inputs (to be implemented)
// export * from './inputs';

// Cards (to be implemented)
// export * from './cards';

// Layouts (to be implemented)
// export * from './layouts';

// Typography (to be implemented)
// export * from './typography';

// Forms (to be implemented)
// export * from './forms';

// Feedback (to be implemented)
// export * from './feedback';

// Navigation (to be implemented)
// export * from './navigation';

// Data Display (to be implemented)
// export * from './data-display';

// Surfaces (to be implemented)
// export * from './surfaces';

// Utils (to be implemented)
// export * from './utils';
