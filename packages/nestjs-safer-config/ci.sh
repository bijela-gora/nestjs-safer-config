rm -rf dist && \
  pnpm run check:style && \
  pnpm run lint && \
  pnpm run test && \
  pnpm run build
