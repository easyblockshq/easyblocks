export const removeEdges = (data: {
  edges: [{ node: Object }];
}): Array<Object> => {
  if (!data) return [];
  return data.edges.map((edge) => edge.node);
};
