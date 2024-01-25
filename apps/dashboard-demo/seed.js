module.exports = () => {
  const mockAssets = Array.from({ length: 10 }, (_, i) => ({
    name: `Asset ${i + 1}`,
    description: `Asset ${i + 1} description`,
    mimeType: "image/png",
    id: `${i + 1}`,
    type: "image",
    isDisabled: Boolean(i % 2),
    imageUrl: `https://picsum.photos/1000/1000?random=${i}`,
    updatedAt: new Date().toISOString(),
  }));

  return {
    assets: mockAssets,
  };
};
