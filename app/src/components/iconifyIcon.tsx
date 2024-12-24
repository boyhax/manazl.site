import { Icon } from "@iconify/react";
import useTheme from "src/hooks/useTheme";

export default function IconifyIcon({ name, size }: { name: string; size? }) {
  const { isDark } = useTheme();
  size = size || "2rem";
  const color = isDark ? "white" : "black";
  return (
    <Icon
      key={name + "icon" + color}
      icon={name}
      width={size}
      height={size}
      color={color}
    ></Icon>
  );
}
