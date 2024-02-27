export function replaceParams(
  url: string,
  params: Record<string, string | number>,
): string {
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, value.toString());
  });
  return url;
}
