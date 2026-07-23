export type ShowcaseTab =
  | 'primitives'
  | 'auth-card'
  | 'sidebar'
  | 'command-bar'
  | 'product-card'
  | 'cart-drawer'
  | 'data-table'
  | 'modal-toast';

export interface TabConfig {
  id: ShowcaseTab;
  label: string;
  category: 'Primitives' | 'Complex Components' | 'Overlays & Feedback';
  description: string;
  iconName: string;
}
