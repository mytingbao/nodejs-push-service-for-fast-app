import { useRouter, useRoute } from "vue-router";
export function useRouteMixin() {
  const router = useRouter();
  const route = useRoute();
  function routerLink(path: string, query?: {}) {
    router.push({ path, query: query });
  }
  return { routerLink, route };
}
