import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeAreaWrapperProps extends ViewProps {
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  children: React.ReactNode;
}

/**
 * Safe wrapper component that uses useSafeAreaInsets hook
 * This is more reliable than SafeAreaView component and won't crash
 * even if the native module isn't fully initialized
 */
export function SafeAreaWrapper({ 
  edges = ['top', 'bottom'], 
  style, 
  children,
  ...props 
}: SafeAreaWrapperProps) {
  const insets = useSafeAreaInsets();
  
  const paddingStyle = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };

  return (
    <View style={[paddingStyle, style]} {...props}>
      {children}
    </View>
  );
}
