import { sidebarMenu } from './sidebar.menu';
import { sidebarStyles } from './sidebar.styles';

export function Sidebar() {
  return (
    <div style={sidebarStyles.container}>

      {sidebarMenu.map((item) => (
        <div key={item.path} style={sidebarStyles.item}>
          {item.label}
        </div>
      ))}

    </div>
  );
}