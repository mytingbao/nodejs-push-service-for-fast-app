import router from "../router"
export function routerLink(path: string): void {
  router.push({
    path,
  })
}
