// vite.config.ts
import { defineConfig } from "file:///mnt/F/Manazl%20app/monorep/node_modules/.pnpm/vite@5.4.11_@types+node@13.13.52_terser@5.37.0/node_modules/vite/dist/node/index.js";
import react from "file:///mnt/F/Manazl%20app/monorep/node_modules/.pnpm/@vitejs+plugin-react@4.3.4_vite@5.4.11_@types+node@13.13.52_terser@5.37.0_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import viteTsconfigPaths from "file:///mnt/F/Manazl%20app/monorep/node_modules/.pnpm/vite-tsconfig-paths@4.3.2_typescript@5.7.2_vite@5.4.11_@types+node@13.13.52_terser@5.37.0_/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig({
  // depending on your application, base can also be "/"
  base: "",
  plugins: [react(), viteTsconfigPaths()],
  resolve: {
    alias: {
      src: "/src"
    }
  },
  root: "",
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000  
    port: 3e3
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L0YvTWFuYXpsIGFwcC9tb25vcmVwL2FwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL21udC9GL01hbmF6bCBhcHAvbW9ub3JlcC9hcHAvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL21udC9GL01hbmF6bCUyMGFwcC9tb25vcmVwL2FwcC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCB2aXRlVHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gICAgLy8gZGVwZW5kaW5nIG9uIHlvdXIgYXBwbGljYXRpb24sIGJhc2UgY2FuIGFsc28gYmUgXCIvXCJcbiAgICBiYXNlOiAnJyxcbiAgICBwbHVnaW5zOiBbcmVhY3QoKSwgdml0ZVRzY29uZmlnUGF0aHMoKV0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgICBhbGlhczoge1xuICAgICAgICAgIHNyYzogXCIvc3JjXCIsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcm9vdDogJycsXG4gICAgICBcbiAgICBzZXJ2ZXI6IHtcbiAgICAgICAgLy8gdGhpcyBlbnN1cmVzIHRoYXQgdGhlIGJyb3dzZXIgb3BlbnMgdXBvbiBzZXJ2ZXIgc3RhcnRcbiAgICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgICAgLy8gdGhpcyBzZXRzIGEgZGVmYXVsdCBwb3J0IHRvIDMwMDAgIFxuICAgICAgICBwb3J0OiAzMDAwLFxuICAgIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlEsU0FBUyxvQkFBb0I7QUFDeFMsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sdUJBQXVCO0FBQzlCLElBQU8sc0JBQVEsYUFBYTtBQUFBO0FBQUEsRUFFeEIsTUFBTTtBQUFBLEVBQ04sU0FBUyxDQUFDLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztBQUFBLEVBQ3RDLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNMLEtBQUs7QUFBQSxJQUNQO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUFBLEVBRVIsUUFBUTtBQUFBO0FBQUEsSUFFSixNQUFNO0FBQUE7QUFBQSxJQUVOLE1BQU07QUFBQSxFQUNWO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
